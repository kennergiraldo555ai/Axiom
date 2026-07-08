import type { Metadata } from "next";
import { ProspectLayout } from "@/modules/growth/prospecting/components/ProspectLayout";
import { PageHeader } from "@/modules/_shared/components/PageHeader";

export const metadata: Metadata = {
  title: "Prospecting | AXIOM Growth",
  description: "Encuentra y analiza negocios para convertirlos en leads de alto valor.",
};

export default function ProspectingPage() {
  return (
    <div className="flex flex-col h-full space-y-2">
      <PageHeader
        title="Prospecting"
        subtitle="Encuentra nuevos negocios, analiza su presencia online con inteligencia artificial y descubre oportunidades de venta ocultas."
        breadcrumbs="Growth / Prospecting"
      />
      <ProspectLayout />
    </div>
  );
}
