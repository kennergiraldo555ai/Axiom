import { Calendar, DollarSign, Building2 } from "lucide-react";
import type { PipelineLead } from "../domain/types";
import { Card } from "@/modules/_shared/components/Card";
import { Badge } from "@/modules/_shared/components/Badge";

interface LeadCardProps {
  lead: PipelineLead;
}

export function LeadCard({ lead }: LeadCardProps) {
  const formattedValue = lead.value
    ? new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: lead.currency || "USD",
        maximumFractionDigits: 0,
      }).format(lead.value / 100) // Asumiendo que el valor está en centavos (best practice)
    : null;

  return (
    <div className="group relative">
      <Card className="cursor-grab border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] p-3 shadow-tactile transition-colors hover:border-[var(--c-border-hover)] active:cursor-grabbing">
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-semibold leading-tight text-[var(--c-text-primary)]">
              {lead.businessName || lead.name}
            </h4>
            {lead.priority > 0 && (
              <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                P{lead.priority}
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5 mt-1">
            {lead.businessName && lead.name !== lead.businessName && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--c-text-secondary)]">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{lead.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[var(--c-text-secondary)]">
              {formattedValue ? (
                <div className="flex items-center gap-1 font-medium text-[var(--c-text-primary)]">
                  <DollarSign className="h-3 w-3 text-[var(--c-secondary)]" />
                  <span>{formattedValue}</span>
                </div>
              ) : (
                <span className="text-[11px] italic text-[var(--c-text-disabled)]">Sin valor</span>
              )}

              <div className="flex items-center gap-1" title="Fecha de creación">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Intl.DateTimeFormat("es-ES", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(lead.createdAt))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
