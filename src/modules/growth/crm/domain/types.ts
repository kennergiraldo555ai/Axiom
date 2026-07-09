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
  { id: "NEW", label: "Nuevo", color: "var(--c-primary)" },
  { id: "CONTACTED", label: "Contactado", color: "var(--c-secondary)" },
  { id: "QUALIFIED", label: "Calificado", color: "var(--c-primary)" },
  { id: "PROPOSAL", label: "Propuesta", color: "var(--c-accent)" },
  { id: "WON", label: "Ganado", color: "var(--c-secondary)" },
  { id: "LOST", label: "Perdido", color: "var(--c-accent)" },
];
