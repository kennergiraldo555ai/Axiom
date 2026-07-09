"use client";

import * as React from "react";
import { SearchBar } from "@/modules/_shared/components/SearchBar";
import { Button } from "@/modules/_shared/components/Button";
import { Search } from "lucide-react";
import { searchProspectsAction } from "../presentation/actions";
import { toast } from "sonner";
import { CityAutocomplete, type CityData } from "@/modules/_shared/components/CityAutocomplete";
import { CategoryAutocomplete } from "@/modules/_shared/components/CategoryAutocomplete";

import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectSearchProps {
  onSearchStart: () => void;
  onSearchComplete: (prospects: ProspectEntity[]) => void;
}

export function ProspectSearch({ onSearchStart, onSearchComplete }: ProspectSearchProps) {
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<CityData | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedCategory || !selectedCity) {
      toast.error("Por favor ingresa una categoría y selecciona una ciudad");
      return;
    }
    onSearchStart();
    setIsSearching(true);
    const loadingToast = toast.loading("Buscando prospectos...");

    try {
      const query = `${selectedCategory} en ${selectedCity.name}, ${selectedCity.country}`;
      const response = await searchProspectsAction(query, {
        lat: selectedCity.lat,
        lng: selectedCity.lng,
      });

      if (response.success) {
        toast.success(`Encontrados ${response.data?.length || 0} prospectos`, {
          id: loadingToast,
        });
        onSearchComplete(response.data || []);
      } else {
        toast.error("Error al buscar prospectos", {
          description: response.error,
          id: loadingToast,
        });
      }
    } catch {
      toast.error("Error inesperado", { id: loadingToast });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="group relative z-20 w-full max-w-6xl mx-auto my-6">
      {/* Background glow for the search panel */}
      <div className="pointer-events-none absolute -inset-px rounded-[var(--r-2xl)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent),var(--c-secondary))] opacity-20 blur-2xl transition duration-1000 group-hover:opacity-40" />

      <div className="relative rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(180deg,rgba(18,20,27,0.7),rgba(11,13,18,0.9))] p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(11,13,18,1)] backdrop-blur-3xl overflow-visible">
        <SearchBar
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-end gap-8 w-full bg-transparent p-0 border-none shadow-none"
        >
          <div className="flex-1 w-full relative group/input z-30">
            <label className="block text-[13px] font-bold tracking-wide text-[var(--c-text-secondary)] mb-3 transition-colors group-hover/input:text-[var(--c-text-primary)]">
              ¿Qué buscas?
            </label>
            <CategoryAutocomplete onSelect={setSelectedCategory} disabled={isSearching} />
          </div>

          <div className="flex-1 w-full md:max-w-[400px] relative group/input z-20">
            <label className="block text-[13px] font-bold tracking-wide text-[var(--c-text-secondary)] mb-3 transition-colors group-hover/input:text-[var(--c-text-primary)]">
              ¿Dónde?
            </label>
            <CityAutocomplete onSelect={setSelectedCity} disabled={isSearching} />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto z-10">
            <Button
              type="submit"
              disabled={isSearching}
              className="h-[60px] flex-1 rounded-[var(--r-xl)] border border-transparent bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] px-10 text-[15px] font-black tracking-wider text-white shadow-[0_18px_40px_-15px_rgb(99_102_241_/_0.8)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-15px_rgb(168_85_247_/_0.9)] md:flex-none"
            >
              <Search className="mr-3 h-6 w-6" strokeWidth={2.5} />
              {isSearching ? "Buscando..." : "Buscar Prospectos"}
            </Button>
            <button
              type="button"
              className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-hover)]/50 text-[var(--c-text-secondary)] shadow-tactile transition-all hover:border-[var(--c-accent-border)] hover:bg-[var(--c-bg-elevated)] hover:text-[var(--c-accent)]"
              title="Filtros avanzados"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>
          </div>
        </SearchBar>

        {/* Decorative arrow pointing to search */}
        <div className="absolute -bottom-12 left-16 pointer-events-none hidden md:flex items-center gap-4 opacity-50">
          <div className="w-10 h-10 rounded-full bg-[var(--c-bg-base)] border border-[var(--c-border-strong)] flex items-center justify-center shadow-inner">
            <div className="h-4 w-4 rounded-full bg-[var(--c-primary)] shadow-[0_0_12px_rgb(99_102_241_/_0.9)]" />
          </div>
          <span className="text-[13px] font-medium text-[var(--c-text-tertiary)] max-w-[250px] leading-relaxed">
            Busca por categoría y ubicación para encontrar los mejores prospectos para AXIOM.
          </span>
        </div>
      </div>
    </div>
  );
}
