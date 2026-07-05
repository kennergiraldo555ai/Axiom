"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/client";
import type { LeadStatus } from "@prisma/client";

export async function moveLeadAction(leadId: string, newStatus: LeadStatus) {
  try {
    const { workspaceId } = await requireWorkspace();

    // Verify lead belongs to user's workspace
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { workspaceId: true, status: true },
    });

    if (!lead || lead.workspaceId !== workspaceId) {
      return { success: false, error: "Cliente potencial no encontrado" };
    }

    // Update status and log event
    await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: { status: newStatus },
      }),
      prisma.leadEvent.create({
        data: {
          leadId,
          eventType: "status_changed",
          fromValue: lead.status,
          toValue: newStatus,
        },
      }),
    ]);

    revalidatePath("/crm");
    return { success: true };
  } catch (error) {
    console.error("Error moving lead:", error);
    return { success: false, error: "Error al actualizar el estado" };
  }
}
