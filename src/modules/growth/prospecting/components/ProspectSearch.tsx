"use client";

import * as React from "react";
import { SearchBar } from "@/modules/_shared/components/SearchBar";
import { Input } from "@/modules/_shared/components/Input";
import { Button } from "@/modules/_shared/components/Button";
import { Search } from "lucide-react";
import { searchProspectsAction } from "../presentation/actions";
import { toast } from "sonner";
import { CityAutocomplete, type CityData } from "@/modules/_shared/components/CityAutocomplete";

import type { ProspectEntity } from "../domain/entities/prospect.entity";

interface ProspectSearchProps {
  onSearchStart: () => void;
  onSearchComplete: (prospects: ProspectEntity[]) => void;
}

export function ProspectSearch({ onSearchStart, onSearchComplete }: ProspectSearchProps) {
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<CityData | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;

    if (!category || !selectedCity) {
      toast.error("Por favor ingresa una categoría y selecciona una ciudad");
      return;
    }
    onSearchStart();
    setIsSearching(true);
    const loadingToast = toast.loading("Buscando prospectos...");

    try {
      const query = `${category} en ${selectedCity.name}, ${selectedCity.country}`;
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
    <SearchBar onSubmit={handleSubmit} className="items-end gap-5 p-5">
      <div className="flex-1 w-full">
        <label
          htmlFor="category"
          className="block text-[13px] font-semibold text-[var(--c-text-secondary)] mb-2 tracking-wide"
        >
          Categoría
        </label>
        <Input
          id="category"
          name="category"
          placeholder="Ej. Dentistas, Agencias de Software..."
          disabled={isSearching}
          required
          className="h-10 text-sm"
        />
      </div>
      <div className="flex-1 w-full sm:max-w-[300px]">
        <label className="block text-[13px] font-semibold text-[var(--c-text-secondary)] mb-2 tracking-wide">
          Ciudad
        </label>
        <CityAutocomplete onSelect={setSelectedCity} disabled={isSearching} />
      </div>
      <Button
        type="submit"
        disabled={isSearching}
        variant="default"
        className="w-full sm:w-auto h-10 px-8"
      >
        <Search className="mr-2 h-4 w-4" />
        {isSearching ? "Buscando..." : "Buscar"}
      </Button>
    </SearchBar>
  );
}
