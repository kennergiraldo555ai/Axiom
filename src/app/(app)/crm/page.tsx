import type { Metadata } from "next";
import { requireWorkspace } from "@/lib/auth/guards";
import { getPipelineLeadsUseCase } from "@/modules/growth/crm/application/use-cases/get-pipeline-leads.use-case";
import { PipelineKanban } from "@/modules/growth/crm/components/PipelineKanban";
import { Button } from "@/modules/_shared/components/Button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Embudo | AXIOM",
  description: "Gestión de clientes potenciales y pipeline comercial",
};

export default async function CrmPage() {
  const { workspaceId } = await requireWorkspace();

  const leadsResult = await getPipelineLeadsUseCase(workspaceId);
  const leads = leadsResult.ok ? leadsResult.value : [];

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--c-border-subtle)] px-1 pb-6">
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-normal text-[var(--c-text-primary)]">
            Embudo de Ventas
          </h1>
          <p className="text-sm text-[var(--c-text-secondary)]">
            Gestiona y cierra oportunidades comerciales
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo cliente potencial
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden pt-6">
        <PipelineKanban initialLeads={leads} />
      </div>
    </div>
  );
}
