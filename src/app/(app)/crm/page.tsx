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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/5">
        <div>
          <h1 className="text-xl font-semibold text-gray-100 mb-1">Embudo de Ventas</h1>
          <p className="text-sm text-gray-400">Gestiona y cierra oportunidades comerciales</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo cliente potencial
          </Button>
        </div>
      </div>

      {/* Main Content (Kanban) */}
      <div className="flex-1 overflow-hidden p-6 bg-[#0a0a0a]">
        <PipelineKanban initialLeads={leads} />
      </div>
    </div>
  );
}
