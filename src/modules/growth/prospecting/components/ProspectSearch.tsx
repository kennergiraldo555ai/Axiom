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
    <SearchBar onSubmit={handleSubmit} className="items-end">
      <div className="flex-1 w-full">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-[var(--c-text-secondary)] mb-1"
        >
          Categoría
        </label>
        <Input
          id="category"
          name="category"
          list="category-suggestions"
          placeholder="Ej. Dentistas, Agencias de Software..."
          disabled={isSearching}
          required
        />
        <datalist id="category-suggestions">
          <option value="Dentistas" />
          <option value="Clínicas Odontológicas" />
          <option value="Barberías" />
          <option value="Peluquerías" />
          <option value="Clínicas Estéticas" />
          <option value="Spas" />
          <option value="Gimnasios" />
          <option value="Restaurantes" />
          <option value="Cafeterías" />
          <option value="Hoteles" />
          <option value="Talleres Automotrices" />
          <option value="Inmobiliarias" />
          <option value="Abogados" />
          <option value="Contadores" />
          <option value="Veterinarias" />
          <option value="Agencias de Viajes" />
          <option value="Ferreterías" />
          <option value="Constructoras" />
          <option value="Tiendas de Mascotas" />
          <option value="Academias" />
        </datalist>
      </div>
      <div className="flex-1 w-full sm:max-w-[300px]">
        <label className="block text-sm font-medium text-[var(--c-text-secondary)] mb-1">
          Ciudad
        </label>
        <CityAutocomplete onSelect={setSelectedCity} disabled={isSearching} />
      </div>
      <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
        <Search className="mr-2 h-4 w-4" />
        {isSearching ? "Buscando..." : "Buscar"}
      </Button>
    </SearchBar>
  );
}
