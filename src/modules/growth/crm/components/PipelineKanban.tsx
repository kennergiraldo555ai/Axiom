"use client";

import { useOptimistic, useState, startTransition } from "react";
import type { LeadStatus } from "@prisma/client";
import { PIPELINE_COLUMNS, type PipelineLead } from "../domain/types";
import { moveLeadAction } from "../presentation/actions";
import { LeadCard } from "./LeadCard";
import { toast } from "sonner";

interface PipelineKanbanProps {
  initialLeads: PipelineLead[];
}

export function PipelineKanban({ initialLeads }: PipelineKanbanProps) {
  const [optimisticLeads, addOptimisticMove] = useOptimistic(
    initialLeads,
    (state: PipelineLead[], update: { leadId: string; newStatus: LeadStatus }) => {
      return state.map((lead) =>
        lead.id === update.leadId ? { ...lead, status: update.newStatus } : lead,
      );
    },
  );

  // Zustand o estado local es válido para UI drag and drop temporal
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
    // Necesario para Firefox
    e.dataTransfer.setData("text/plain", leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, columnId: LeadStatus) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const leadId = draggedLeadId;
    const currentLead = optimisticLeads.find((l) => l.id === leadId);

    setDraggedLeadId(null);

    if (!currentLead || currentLead.status === columnId) return;

    // Mutación optimista
    startTransition(() => {
      addOptimisticMove({ leadId, newStatus: columnId });
    });

    // Acción del servidor real
    const result = await moveLeadAction(leadId, columnId);

    if (!result.success) {
      toast.error(result.error || "No se pudo actualizar el estado del cliente potencial");
    } else {
      toast.success("Cliente potencial actualizado");
    }
  };

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {PIPELINE_COLUMNS.map((column) => (
        <div
          key={column.id}
          className="flex w-[320px] shrink-0 flex-col rounded-xl bg-white/5 border border-white/10"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: column.color }} />
              <h3 className="font-medium text-sm text-gray-200">{column.label}</h3>
            </div>
            <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-0.5 rounded-full">
              {optimisticLeads.filter((l) => l.status === column.id).length}
            </span>
          </div>

          {/* Column Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[150px]">
            {optimisticLeads
              .filter((lead) => lead.status === column.id)
              .map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <LeadCard lead={lead} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
