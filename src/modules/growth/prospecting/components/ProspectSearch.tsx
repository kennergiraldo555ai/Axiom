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
    <div className="relative group z-10 w-full max-w-5xl">
      {/* Background glow for the search panel */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--c-violet)]/20 via-[var(--c-accent)]/20 to-[var(--c-violet)]/20 rounded-[var(--r-2xl)] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none" />

      <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[var(--c-bg-elevated)] to-[#0B0D12] border border-[var(--c-border-strong)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] rounded-[var(--r-2xl)] backdrop-blur-2xl">
        <SearchBar
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-end gap-6 w-full bg-transparent p-0 border-none shadow-none"
        >
          <div className="flex-1 w-full relative group/input">
            <label className="block text-[12px] font-semibold text-[var(--c-text-secondary)] mb-2.5 transition-colors group-hover/input:text-[var(--c-text-primary)]">
              Categoría
            </label>
            <CategoryAutocomplete onSelect={setSelectedCategory} disabled={isSearching} />
          </div>

          <div className="flex-1 w-full md:max-w-[340px] relative group/input">
            <label className="block text-[12px] font-semibold text-[var(--c-text-secondary)] mb-2.5 transition-colors group-hover/input:text-[var(--c-text-primary)]">
              Ciudad
            </label>
            <CityAutocomplete onSelect={setSelectedCity} disabled={isSearching} />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              type="submit"
              disabled={isSearching}
              className="flex-1 md:flex-none h-[50px] px-8 bg-[var(--c-violet)] text-white font-bold text-[14px] tracking-wide border border-transparent shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:bg-[#b388ff] hover:-translate-y-0.5 transition-all duration-300 rounded-[var(--r-md)]"
            >
              <Search className="mr-2.5 h-5 w-5" strokeWidth={2.5} />
              {isSearching ? "Buscando..." : "Buscar Prospectos"}
            </Button>
            <button
              type="button"
              className="h-[50px] w-[50px] flex items-center justify-center rounded-[var(--r-md)] bg-[var(--c-bg-hover)] border border-[var(--c-border-strong)] text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:border-[var(--c-border-hover)] transition-all shadow-tactile shrink-0"
              title="Filtros avanzados"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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
        <div className="absolute -bottom-8 left-10 pointer-events-none hidden md:flex items-center gap-3 opacity-60">
          <div className="w-8 h-8 rounded-full bg-[var(--c-bg-hover)] border border-[var(--c-border-strong)] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[var(--c-violet)] shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          </div>
          <span className="text-[12px] text-[var(--c-text-tertiary)] max-w-[200px] leading-tight">
            Busca por categoría y ubicación para encontrar los mejores prospectos.
          </span>
          <svg
            className="w-12 h-12 text-[var(--c-text-disabled)] ml-2"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 90 Q 30 20 90 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M80 10 L 95 20 L 80 30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
