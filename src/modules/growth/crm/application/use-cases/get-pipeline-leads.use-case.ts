import { prisma } from "@/lib/db/client";
import type { Result } from "@/lib/utils/result";
import { ok, err } from "@/lib/utils/result";
import type { PipelineLead } from "../../domain/types";
import { LeadStatus } from "@prisma/client";

export async function getPipelineLeadsUseCase(
  workspaceId: string,
): Promise<Result<PipelineLead[]>> {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        workspaceId,
        // En el Kanban normalmente no mostramos leads archivados por defecto
        status: {
          not: LeadStatus.ARCHIVED,
        },
      },
      select: {
        id: true,
        name: true,
        businessName: true,
        status: true,
        priority: true,
        value: true,
        currency: true,
        expectedCloseAt: true,
        createdAt: true,
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return ok(leads);
  } catch (error) {
    console.error("Error fetching pipeline leads:", error);
    return err(new Error("No se pudieron cargar los clientes potenciales del embudo"));
  }
}
