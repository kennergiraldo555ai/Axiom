import type { Metadata } from "next";
import { ProspectLayout } from "@/modules/growth/prospecting/components/ProspectLayout";
import { PageHeader } from "@/modules/_shared/components/PageHeader";
import { Sparkles, Plus, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Prospecting | AXIOM Growth",
  description: "Encuentra y analiza negocios para convertirlos en leads de alto valor.",
};

export default function ProspectingPage() {
  return (
    <div className="flex flex-col h-full space-y-8">
      <PageHeader
        title="Prospecting"
        icon={<Sparkles className="w-8 h-8" />}
        subtitle="Encuentra nuevos negocios, analiza su presencia online con inteligencia artificial y descubre oportunidades de venta ocultas."
        actions={
          <button className="flex items-center gap-2 bg-[var(--c-violet)] hover:bg-[#b388ff] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            <Plus className="w-4 h-4" />
            Nuevo Prospecto
          </button>
        }
        metadata={
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-tactile mr-4">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-[var(--c-success)] uppercase tracking-wider">
                Última sincronización
              </span>
              <span className="text-[11px] text-[var(--c-text-secondary)]">Hace 5 min</span>
            </div>
            <button className="text-[var(--c-text-tertiary)] hover:text-[var(--c-accent)] transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />
      <ProspectLayout />
    </div>
  );
}
