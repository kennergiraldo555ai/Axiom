import { logger } from "@/lib/observability/logger";
import { aiRouter } from "@/lib/ai/router";
import { evaluateProposalPrompt } from "@/lib/ai/prompts/growth/proposal";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";
import { z } from "zod";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { AIProviderId } from "@/lib/ai/types";

const GenerateProposalInputSchema = z.object({
  workspaceId: z.string().min(1),
  prospectId: z.string().min(1),
});

export type GenerateProposalInput = z.infer<typeof GenerateProposalInputSchema>;

export class GenerateProposalUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: GenerateProposalInput): Promise<ProspectEntity> {
    const validated = GenerateProposalInputSchema.parse(input);
    const { workspaceId, prospectId } = validated;

    const startTime = performance.now();
    logger.info({ workspaceId, prospectId }, "Iniciando GenerateProposalUseCase");

    try {
      // 1. Obtener prospecto
      const prospect = await this.prospectRepository.findById(prospectId);
      if (!prospect || prospect.workspaceId !== workspaceId) {
        throw new Error("Prospect not found or does not belong to workspace");
      }

      if (prospect.analysisStatus !== "COMPLETED") {
        throw new Error("Cannot generate a proposal for a prospect that is not fully analyzed");
      }

      // 2. Extraer datos del análisis para el prompt
      const scoreRationale = prospect.scoreRationale as Record<string, unknown> | null;
      const summary = (scoreRationale?.summary as string) || "Business in need of improvement.";

      const signals = prospect.signals as Record<string, unknown> | null;
      const painPoints = Array.isArray(signals?.weaknesses)
        ? (signals?.weaknesses as string[])
        : ["Needs digital presence improvement"];

      const opportunities = Array.isArray(prospect.opportunities) ? prospect.opportunities : [];

      // 3. Preparar Prompt
      const provider: AIProviderId =
        (process.env.DEFAULT_AI_PROVIDER as AIProviderId) || "anthropic";
      const model = process.env.DEFAULT_AI_MODEL || "claude-3-5-sonnet-20240620";

      const promptResult = evaluateProposalPrompt({
        companyName: prospect.name,
        category: prospect.categoryId || "General Business",
        summary,
        painPoints,
        opportunities,
      });

      // 4. Llamar al AI Router (sin conocer que es Anthropic)
      const aiResponse = await aiRouter.complete({
        provider,
        model,
        requestId: `proposal-${prospectId}-${Date.now()}`,
        systemPrompt: promptResult.systemPrompt,
        userPrompt: promptResult.userPrompt,
        temperature: 0.7, // Creatividad media para un email persuasivo
      });

      // 5. Actualizar y persistir el draft
      const updatedProspect = await this.prospectRepository.update(prospectId, {
        messageDraft: aiResponse.text,
        messageDraftModel: model,
        messageDraftAt: new Date(),
      });

      const durationMs = Math.round(performance.now() - startTime);
      logger.info(
        {
          workspaceId,
          prospectId,
          durationMs,
        },
        "GenerateProposalUseCase completado exitosamente",
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
        "GenerateProposalUseCase fallido",
      );
      throw err;
    }
  }
}
