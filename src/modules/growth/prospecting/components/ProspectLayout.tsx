"use client";

import * as React from "react";
import { ProspectSearch } from "./ProspectSearch";
import { ProspectTable } from "./ProspectTable";
import { ProspectSidePanel } from "./ProspectSidePanel";
import { getProspectsAction } from "../presentation/actions";
import type { ProspectEntity } from "../domain/entities/prospect.entity";
import { ErrorState } from "@/modules/_shared/components/ErrorState";

export function ProspectLayout() {
  const [prospects, setProspects] = React.useState<ProspectEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const fetchProspects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProspectsAction();
      if (response.success && response.data) {
        // En MVP no manejamos paginación en UI aún, solo mostramos los items
        setProspects(response.data.data);
      } else {
        setError(response.error || "Error al cargar prospectos");
      }
    } catch {
      setError("Error inesperado al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProspects();
  }, [fetchProspects]);

  const handleSearchComplete = () => {
    fetchProspects();
  };

  const handleSelectProspect = (prospect: ProspectEntity) => {
    setSelectedProspectId(prospect.id);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    // Remove selected ID after animation completes to avoid flashing empty state
    setTimeout(() => setSelectedProspectId(null), 300);
  };

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p) => p.id === selectedProspectId) || null;
  }, [prospects, selectedProspectId]);

  return (
    <div className="flex flex-col space-y-6">
      <ProspectSearch onSearchComplete={handleSearchComplete} />

      {error ? (
        <ErrorState
          title="No pudimos cargar los prospectos"
          description="Ocurrió un error al intentar conectarse al servidor o procesar la petición."
          solution={error}
          onRetry={fetchProspects}
          isRetrying={isLoading}
        />
      ) : (
        <ProspectTable
          prospects={prospects}
          isLoading={isLoading}
          selectedId={selectedProspectId}
          onSelect={handleSelectProspect}
        />
      )}

      <ProspectSidePanel
        prospect={selectedProspect}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdate={fetchProspects}
      />
    </div>
  );
}
