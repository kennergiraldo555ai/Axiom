import { logger } from "@/lib/observability/logger";
import { aiRouter } from "@/lib/ai/router";
import { evaluateProspectPrompt } from "@/lib/ai/prompts/growth/prospecting";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
import { z } from "zod";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { AIProviderId } from "@/lib/ai/types";

const AnalyzeProspectInputSchema = z.object({
  workspaceId: z.string().min(1),
  prospectId: z.string().min(1),
  forceReanalyze: z.boolean().default(false),
});

export type AnalyzeProspectInput = z.infer<typeof AnalyzeProspectInputSchema>;

export class AnalyzeProspectUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: AnalyzeProspectInput): Promise<ProspectEntity> {
    const validated = AnalyzeProspectInputSchema.parse(input);
    const { workspaceId, prospectId, forceReanalyze } = validated;

    const startTime = performance.now();
    logger.info({ workspaceId, prospectId }, "Iniciando AnalyzeProspectUseCase");

    try {
      // 1. Obtener prospecto
      const prospect = await this.prospectRepository.findById(prospectId);
      if (!prospect || prospect.workspaceId !== workspaceId) {
        throw new Error("Prospect not found or does not belong to workspace");
      }

      // 2. Verificar estado
      if (prospect.analysisStatus === "COMPLETED" && !forceReanalyze) {
        logger.info({ prospectId }, "Prospecto ya analizado. Saltando.");
        return prospect;
      }

      // Marcar en progreso
      await this.prospectRepository.update(prospectId, { analysisStatus: "IN_PROGRESS" });

      // 3. Preparar Prompt
      const provider: AIProviderId =
        (process.env.DEFAULT_AI_PROVIDER as AIProviderId) || "anthropic";
      const model = process.env.DEFAULT_AI_MODEL || "claude-3-5-sonnet-20240620";

      const promptResult = evaluateProspectPrompt({
        companyName: prospect.name,
        location: prospect.address || "Unknown",
        additionalInfo:
          typeof prospect.metadata === "object" ? JSON.stringify(prospect.metadata) : "",
        category: prospect.categoryId || "General",
      });

      // 4. Llamar al AI Router (sin conocer que es Anthropic)
      const aiResponse = await aiRouter.complete({
        provider,
        model,
        requestId: `analyze-${prospectId}-${Date.now()}`,
        systemPrompt: promptResult.systemPrompt,
        userPrompt: promptResult.userPrompt,
        temperature: 0.1, // Baja temperatura para análisis estructurado
      });

      // 5. Parsear respuesta (esperamos un JSON crudo o bloque XML)
      let parsedAnalysis: Record<string, unknown>;
      try {
        parsedAnalysis = JSON.parse(aiResponse.text);
      } catch {
        // Fallback básico si devuelve texto con markdown
        const match = aiResponse.text.match(/\{[\s\S]*\}/);
        if (match) {
          parsedAnalysis = JSON.parse(match[0]);
        } else {
          throw new Error("La respuesta de la IA no es un JSON válido");
        }
      }

      // 6. Actualizar y persistir
      const updatedProspect = await this.prospectRepository.update(prospectId, {
        analysisStatus: "COMPLETED",
        qualityScore: (parsedAnalysis.qualityScore as number) || 50,
        scoreRationale: (parsedAnalysis.scoreRationale as Record<string, unknown>) || null,
        signals: (parsedAnalysis.signals as Record<string, unknown>) || null,
        opportunities: (parsedAnalysis.opportunities as Record<string, unknown>[]) || null,
        analyzedAt: new Date(),
        analyzedByModel: model,
      });

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(
        {
          workspaceId,
          prospectId,
          qualityScore: updatedProspect.qualityScore,
          durationMs,
        },
        "AnalyzeProspectUseCase completado exitosamente",
      );

      return updatedProspect;
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(
        {
          workspaceId,
          prospectId,
          error: err.message,
        },
        "AnalyzeProspectUseCase fallido",
      );

      // Revert status on failure
      await this.prospectRepository
        .update(prospectId, { analysisStatus: "FAILED" })
        .catch(() => {});

      throw err;
    }
  }
}
