import type { Lead, LeadStatus } from "@prisma/client";

export type PipelineLead = Pick<
  Lead,
  | "id"
  | "name"
  | "businessName"
  | "status"
  | "priority"
  | "value"
  | "currency"
  | "expectedCloseAt"
  | "createdAt"
>;

export interface PipelineColumn {
  id: LeadStatus;
  label: string; // En español para la UI
  color: string;
}

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: "NEW", label: "Nuevo", color: "var(--c-blue, #3b82f6)" },
  { id: "CONTACTED", label: "Contactado", color: "var(--c-amber, #f59e0b)" },
  { id: "QUALIFIED", label: "Calificado", color: "var(--c-indigo, #6366f1)" },
  { id: "PROPOSAL", label: "Propuesta", color: "var(--c-purple, #a855f7)" },
  { id: "WON", label: "Ganado", color: "var(--c-green, #22c55e)" },
  { id: "LOST", label: "Perdido", color: "var(--c-danger, #ef4444)" },
];
