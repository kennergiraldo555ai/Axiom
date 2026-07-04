import type { Metadata } from "next";
import { ProspectLayout } from "@/modules/growth/prospecting/components/ProspectLayout";

export const metadata: Metadata = {
  title: "Prospecting | AXIOM Growth",
  description: "Encuentra y analiza negocios para convertirlos en leads de alto valor.",
};

export default function ProspectingPage() {
  return (
    <div className="flex flex-col h-full space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--c-text-primary)]">
          Prospecting
        </h1>
        <p className="text-sm text-[var(--c-text-secondary)] max-w-2xl">
          Encuentra nuevos negocios, analiza su presencia online con inteligencia artificial y
          descubre oportunidades de venta ocultas.
        </p>
      </header>

      <ProspectLayout />
    </div>
  );
}
