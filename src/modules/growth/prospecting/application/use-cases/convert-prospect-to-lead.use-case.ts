import { logger } from "@/lib/observability/logger";
import { z } from "zod";
import type { ProspectEntity } from "../../domain/entities/prospect.entity";
import type { IProspectRepository } from "../../domain/repositories/prospect.repository";

const ConvertProspectToLeadInputSchema = z.object({
  workspaceId: z.string().min(1),
  prospectId: z.string().min(1),
  finalMessage: z.string().trim().min(20),
});

export type ConvertProspectToLeadInput = z.infer<typeof ConvertProspectToLeadInputSchema>;

export class ConvertProspectToLeadUseCase {
  constructor(private readonly prospectRepository: IProspectRepository) {}

  async execute(input: ConvertProspectToLeadInput): Promise<ProspectEntity> {
    const validated = ConvertProspectToLeadInputSchema.parse(input);
    const { workspaceId, prospectId, finalMessage } = validated;

    logger.info({ workspaceId, prospectId }, "Iniciando ConvertProspectToLeadUseCase");

    const prospect = await this.prospectRepository.findById(prospectId);
    if (!prospect || prospect.workspaceId !== workspaceId) {
      throw new Error("Prospect not found or does not belong to workspace");
    }

    if (prospect.convertedToLeadId) {
      throw new Error("Prospect has already been converted to a lead");
    }

    if (prospect.analysisStatus !== "COMPLETED") {
      throw new Error("Cannot convert a prospect before the AI analysis is completed");
    }

    const updatedProspect = await this.prospectRepository.convertToLead({
      workspaceId,
      prospectId,
      finalMessage,
    });

    logger.info(
      {
        workspaceId,
        prospectId,
        leadId: updatedProspect.convertedToLeadId,
      },
      "ConvertProspectToLeadUseCase completado exitosamente",
    );

    return updatedProspect;
  }
}
