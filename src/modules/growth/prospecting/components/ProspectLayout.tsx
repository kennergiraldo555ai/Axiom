"use client";

import * as React from "react";
import { ProspectSearch } from "./ProspectSearch";
import { ProspectTable } from "./ProspectTable";
import { ProspectSidePanel } from "./ProspectSidePanel";
import { getProspectsAction } from "../presentation/actions";
import type { ProspectEntity } from "../domain/entities/prospect.entity";
import { ErrorState } from "@/modules/_shared/components/ErrorState";
import { EmptyState } from "@/modules/_shared/components/EmptyState";
import { Search, Sparkles, Globe } from "lucide-react";

type PageState = "initial" | "loading" | "results" | "empty-results" | "error";

export function ProspectLayout() {
  const [prospects, setProspects] = React.useState<ProspectEntity[]>([]);
  const [pageState, setPageState] = React.useState<PageState>("initial");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [isSearchMode, setIsSearchMode] = React.useState(false);

  const fetchProspects = React.useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (!isLoadMore) {
        setErrorMessage(null);
        setPageState("loading");
        setIsSearchMode(false);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await getProspectsAction({}, pageNum, 20);
        if (response.success && response.data) {
          const items = response.data.data;
          const totalItems = isLoadMore ? [...prospects, ...items] : items;

          if (totalItems.length > 0) {
            setProspects(totalItems);
            setPageState("results");
            setHasSearched(true);
            setHasMore(items.length === 20);
          } else if (hasSearched) {
            setPageState("results");
            setProspects([]);
          } else {
            setPageState("initial");
          }
        } else {
          // Only show error if user has interacted, otherwise show initial state
          if (hasSearched) {
            setErrorMessage(response.error || "Ocurrió un problema al cargar los datos.");
            setPageState("error");
          } else {
            setPageState("initial");
          }
        }
      } catch {
        if (hasSearched && !isLoadMore) {
          setErrorMessage("Ocurrió un error inesperado al conectar con el servidor.");
          setPageState("error");
        } else if (!hasSearched) {
          setPageState("initial");
        }
      } finally {
        setIsLoadingMore(false);
      }
    },
    [hasSearched, prospects],
  );

  // Note: We removed the automatic fetchProspects() on mount.
  // The module now always starts in the "initial" state.

  const handleSearchStart = () => {
    setPageState("loading");
    setProspects([]);
    setSelectedProspectId(null);
    setPage(1);
    setHasMore(true);
  };

  const handleSearchComplete = (newProspects: ProspectEntity[]) => {
    setHasSearched(true);
    setIsSearchMode(true);
    setProspects(newProspects);
    setPageState(newProspects.length > 0 ? "results" : "empty-results");
    // La búsqueda retorna todos los resultados de la sesión de una vez, no hay paginación.
    setHasMore(false);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore || isSearchMode) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProspects(nextPage, true);
  };

  const handleSelectProspect = (prospect: ProspectEntity) => {
    setSelectedProspectId(prospect.id);
  };

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p) => p.id === selectedProspectId) || null;
  }, [prospects, selectedProspectId]);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === "desc") return { key, direction: "asc" };
        return null;
      }
      return { key, direction: "desc" };
    });
  };

  const sortedProspects = React.useMemo(() => {
    const sortable = [...prospects];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        if (sortConfig.key === "qualityScore") {
          const aScore = a.qualityScore || 0;
          const bScore = b.qualityScore || 0;
          if (aScore < bScore) return sortConfig.direction === "asc" ? -1 : 1;
          if (aScore > bScore) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
        return 0;
      });
    }
    return sortable;
  }, [prospects, sortConfig]);

  const handleUpdate = React.useCallback(
    (updatedProspect?: ProspectEntity) => {
      if (updatedProspect) {
        setProspects((current) =>
          current.map((p) => (p.id === updatedProspect.id ? updatedProspect : p)),
        );
      } else {
        if (!isSearchMode) {
          fetchProspects(page, false);
        }
      }
    },
    [isSearchMode, fetchProspects, page],
  );

  return (
    <div className="flex flex-col gap-8 p-0">
      <ProspectSearch onSearchStart={handleSearchStart} onSearchComplete={handleSearchComplete} />

      {pageState === "loading" && <ProspectGridSkeleton />}

      {pageState === "initial" && <OnboardingState />}

      {pageState === "results" && prospects.length === 0 && <EmptyResultsState />}

      {pageState === "results" && prospects.length > 0 && (
        <ProspectTable
          prospects={sortedProspects}
          isLoading={false}
          selectedId={selectedProspectId}
          onSelect={handleSelectProspect}
          onSort={handleSort}
          sortConfig={sortConfig}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
        />
      )}

      {pageState === "error" && (
        <ErrorState
          title="No pudimos cargar los prospectos"
          description={errorMessage || "Ocurrió un problema. Por favor, intenta de nuevo."}
          onRetry={() => {
            setPageState("loading");
            fetchProspects();
          }}
          isRetrying={false}
        />
      )}

      {selectedProspect && (
        <ProspectSidePanel
          prospect={selectedProspect}
          isOpen={!!selectedProspect}
          onClose={() => setSelectedProspectId(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

// ── Onboarding State (First visit, no data yet) ─────────────────────

// ── Onboarding State (First visit, no data yet) ─────────────────────

function OnboardingState() {
  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center justify-center py-16 md:py-24">
      {/* Massive glowing rings and binoculars illustration */}
      <div className="group relative mb-12">
        <div className="pointer-events-none absolute inset-x-[-120px] top-1/2 h-36 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgb(99_102_241_/_0.12),rgb(168_85_247_/_0.1),transparent)] blur-3xl" />

        {/* Floating elements */}
        <div className="absolute -right-10 -top-10 flex h-16 w-16 animate-pulse items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(135deg,var(--c-bg-elevated),var(--c-bg-base))] shadow-tactile">
          <Sparkles className="w-8 h-8 text-[var(--c-violet)]" />
        </div>

        {/* Center illustration container */}
        <div className="relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(180deg,var(--c-border-base),var(--c-bg-base))] shadow-[0_20px_60px_-30px_rgb(11_13_18_/_0.9)] sm:h-64 sm:w-64">
          {/* Inner ring */}
          <div className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-[var(--r-xl)] border border-[var(--c-border-subtle)]" />
          {/* Binoculars representation using overlapping glowing circles */}
          <div className="relative flex items-center gap-2">
            <div className="relative z-10 h-16 w-16 rounded-full border-4 border-[var(--c-primary)] bg-[var(--c-bg-base)] shadow-[0_0_30px_rgb(99_102_241_/_0.54),inset_0_0_20px_rgb(99_102_241_/_0.24)] sm:h-20 sm:w-20">
              <div className="absolute inset-2 rounded-full bg-[var(--c-accent)]/20" />
            </div>
            <div className="relative z-10 h-16 w-16 rounded-full border-4 border-[var(--c-accent)] bg-[var(--c-bg-base)] shadow-[0_0_30px_rgb(168_85_247_/_0.54),inset_0_0_20px_rgb(168_85_247_/_0.24)] sm:h-20 sm:w-20">
              <div className="absolute inset-2 rounded-full bg-[var(--c-violet)]/20" />
            </div>
            {/* Center connector */}
            <div className="absolute left-1/2 top-1/2 z-0 h-4 w-8 -translate-x-1/2 -translate-y-1/2 bg-[var(--c-border-base)]" />
          </div>
          {/* "A" logo hint floating */}
          <div className="absolute bottom-8 right-8 text-[var(--c-accent)] opacity-40 font-bold text-4xl">
            A
          </div>
        </div>
      </div>

      <div className="text-center max-w-2xl mb-16 relative z-10">
        <h2 className="mb-4 text-3xl font-bold tracking-normal text-[var(--c-text-primary)] sm:text-4xl">
          Encuentra tu próximo gran cliente
        </h2>
        <p className="text-[15px] sm:text-lg text-[var(--c-text-secondary)] leading-relaxed">
          Busca negocios por categoría y ubicación para descubrir oportunidades de crecimiento
          ocultas.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full relative z-10">
        <div className="flex flex-col items-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] p-8 text-center shadow-tactile transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-accent-border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--c-violet)]/10 border border-[var(--c-violet)]/20 flex items-center justify-center mb-6">
            <Sparkles className="w-7 h-7 text-[var(--c-violet)]" />
          </div>
          <h3 className="text-[16px] font-bold text-[var(--c-text-primary)] mb-3">IA Avanzada</h3>
          <p className="text-[13px] text-[var(--c-text-tertiary)] leading-relaxed">
            Analizamos su presencia online automáticamente para puntuar su calidad.
          </p>
        </div>

        <div className="flex flex-col items-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] p-8 text-center shadow-tactile transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-primary-border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--c-info)]/10 border border-[var(--c-info)]/20 flex items-center justify-center mb-6">
            <Globe className="w-7 h-7 text-[var(--c-info)]" />
          </div>
          <h3 className="text-[16px] font-bold text-[var(--c-text-primary)] mb-3">
            Datos Inteligentes
          </h3>
          <p className="text-[13px] text-[var(--c-text-tertiary)] leading-relaxed">
            Información precisa y actualizada en tiempo real de múltiples fuentes.
          </p>
        </div>

        <div className="flex flex-col items-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] p-8 text-center shadow-tactile transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-secondary-border)]">
          <div className="w-14 h-14 rounded-2xl bg-[var(--c-accent)]/10 border border-[var(--c-accent)]/20 flex items-center justify-center mb-6">
            <Search className="w-7 h-7 text-[var(--c-accent)]" />
          </div>
          <h3 className="text-[16px] font-bold text-[var(--c-text-primary)] mb-3">Oportunidades</h3>
          <p className="text-[13px] text-[var(--c-text-tertiary)] leading-relaxed">
            Detectamos el potencial de crecimiento oculto para acelerar tus ventas.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Empty Results State (Search returned zero results) ──────────────

function EmptyResultsState() {
  return (
    <EmptyState
      title="Sin resultados"
      description="La búsqueda no encontró negocios con esos criterios. Intenta con otra categoría o una ciudad diferente."
      icon={<Search className="w-8 h-8 text-[var(--c-text-tertiary)]" />}
    />
  );
}

// ── Skeleton Loader ─────────────────────────────────────────────────

import { Skeleton } from "@/modules/_shared/components/Skeleton";

function ProspectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pb-12">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[var(--r-2xl)] border border-[var(--c-border-subtle)] bg-[var(--c-bg-subtle)] p-5 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mt-2">
            <Skeleton className="h-3 w-full col-span-2" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-[var(--c-border-subtle)] flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
