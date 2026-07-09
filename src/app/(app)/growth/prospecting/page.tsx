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
    <div className="flex h-full flex-col space-y-8">
      <PageHeader
        title="Prospecting"
        icon={<Sparkles className="h-8 w-8" />}
        subtitle="Encuentra nuevos negocios, analiza su presencia online con inteligencia artificial y descubre oportunidades de venta ocultas."
        actions={
          <button className="flex items-center gap-2 rounded-[var(--r-md)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_18px_34px_-22px_rgb(99_102_241_/_0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_42px_-20px_rgb(168_85_247_/_0.9)]">
            <Plus className="h-4 w-4" />
            Nuevo Prospecto
          </button>
        }
        metadata={
          <div className="mr-4 flex items-center gap-3 rounded-[var(--r-md)] border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] px-4 py-2 shadow-tactile">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--c-secondary)]">
                Última sincronización
              </span>
              <span className="text-[11px] text-[var(--c-text-secondary)]">Hace 5 min</span>
            </div>
            <button className="rounded-[var(--r-md)] p-2 text-[var(--c-text-tertiary)] transition-colors hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-primary)]">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        }
      />
      <ProspectLayout />
    </div>
  );
}
