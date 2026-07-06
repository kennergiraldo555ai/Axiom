/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { ProspectSearch } from "./ProspectSearch";
import { ProspectTable } from "./ProspectTable";
import { ProspectSidePanel } from "./ProspectSidePanel";
import { getProspectsAction } from "../presentation/actions";
import type { ProspectEntity } from "../domain/entities/prospect.entity";
import { ErrorState } from "@/modules/_shared/components/ErrorState";
import { Search, Building2, Sparkles, TrendingUp, Globe } from "lucide-react";

type PageState = "initial" | "loading" | "results" | "empty-results" | "error";

export function ProspectLayout() {
  const [prospects, setProspects] = React.useState<ProspectEntity[]>([]);
  const [pageState, setPageState] = React.useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const [selectedProspectId, setSelectedProspectId] = React.useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);

  const fetchProspects = React.useCallback(async () => {
    setErrorMessage(null);
    try {
      const response = await getProspectsAction();
      if (response.success && response.data) {
        const items = response.data.data;
        if (items.length > 0) {
          setProspects(items);
          setPageState("results");
          setHasSearched(true);
        } else if (hasSearched) {
          // User has searched before and now results are empty
          setPageState("results");
          setProspects([]);
        } else {
          // Fresh load, no prospects yet — show onboarding
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
      if (hasSearched) {
        setErrorMessage("Ocurrió un error inesperado al conectar con el servidor.");
        setPageState("error");
      } else {
        setPageState("initial");
      }
    }
  }, [hasSearched]);

  React.useEffect(() => {
    fetchProspects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchComplete = () => {
    setHasSearched(true);
    fetchProspects();
  };

  const handleSelectProspect = (prospect: ProspectEntity) => {
    setSelectedProspectId(prospect.id);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedProspectId(null), 300);
  };

  const selectedProspect = React.useMemo(() => {
    return prospects.find((p) => p.id === selectedProspectId) || null;
  }, [prospects, selectedProspectId]);

  return (
    <div className="flex flex-col space-y-6">
      <ProspectSearch onSearchComplete={handleSearchComplete} />

      {pageState === "loading" && <ProspectTableSkeleton />}

      {pageState === "initial" && <OnboardingState />}

      {pageState === "results" && prospects.length === 0 && <EmptyResultsState />}

      {pageState === "results" && prospects.length > 0 && (
        <ProspectTable
          prospects={prospects}
          isLoading={false}
          selectedId={selectedProspectId}
          onSelect={handleSelectProspect}
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

      <ProspectSidePanel
        prospect={selectedProspect}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onUpdate={fetchProspects}
      />
    </div>
  );
}

// ── Onboarding State (First visit, no data yet) ─────────────────────

function OnboardingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="max-w-lg text-center">
        {/* Icon cluster */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--c-accent)]/20 to-[var(--c-accent)]/5 border border-[var(--c-accent)]/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-[var(--c-accent)]" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[var(--c-text-primary)] mb-3 tracking-tight">
          Encuentra tu próximo cliente
        </h2>
        <p className="text-[14px] text-[var(--c-text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">
          Busca negocios por categoría y ciudad. AXIOM los analizará con inteligencia artificial
          para encontrar oportunidades de venta ocultas.
        </p>

        {/* Search examples */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: Building2, label: "Dental Clinics" },
            { icon: Globe, label: "Software Agencies" },
            { icon: Building2, label: "Real Estate" },
            { icon: Globe, label: "Restaurants" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)] text-[13px] text-[var(--c-text-secondary)]"
            >
              <Icon className="w-3.5 h-3.5 text-[var(--c-text-tertiary)]" />
              {label}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-[12px] text-[var(--c-text-tertiary)]">
            Ingresa una categoría y ciudad en el buscador de arriba para comenzar
          </p>
          <div className="w-6 h-6 rounded-full border border-[var(--c-border-strong)] flex items-center justify-center animate-bounce">
            <svg
              className="w-3 h-3 text-[var(--c-text-tertiary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty Results State (Search returned zero results) ──────────────

function EmptyResultsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)] flex items-center justify-center mx-auto mb-6">
          <Search className="w-6 h-6 text-[var(--c-text-tertiary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--c-text-primary)] mb-2 tracking-tight">
          Sin resultados
        </h3>
        <p className="text-[14px] text-[var(--c-text-secondary)] leading-relaxed">
          La búsqueda no encontró negocios con esos criterios. Intenta con otra categoría o una
          ciudad diferente.
        </p>
      </div>
    </div>
  );
}

// ── Skeleton Loader ─────────────────────────────────────────────────

function ProspectTableSkeleton() {
  return (
    <div className="w-full rounded-xl border border-[var(--c-border-subtle)] bg-[var(--c-bg-elevated)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-6 px-6 py-4 border-b border-[var(--c-border-subtle)]">
        <div className="h-3 w-24 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
        <div className="h-3 w-20 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
        <div className="h-3 w-16 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
        <div className="h-3 w-20 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
        <div className="h-3 w-16 rounded bg-[var(--c-bg-subtle)] animate-pulse ml-auto" />
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-6 px-6 py-5 border-b border-[var(--c-border-subtle)] last:border-b-0"
        >
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-48 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
            <div className="h-3 w-28 rounded bg-[var(--c-bg-subtle)] animate-pulse opacity-60" />
          </div>
          <div className="h-3 w-32 rounded bg-[var(--c-bg-subtle)] animate-pulse hidden sm:block" />
          <div className="h-3 w-12 rounded bg-[var(--c-bg-subtle)] animate-pulse hidden sm:block" />
          <div className="h-5 w-20 rounded-full bg-[var(--c-bg-subtle)] animate-pulse" />
          <div className="h-4 w-8 rounded bg-[var(--c-bg-subtle)] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
