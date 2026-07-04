"use client";

import * as React from "react";
import { SearchBar } from "@/modules/_shared/components/SearchBar";
import { Input } from "@/modules/_shared/components/Input";
import { Select } from "@/modules/_shared/components/Select";
import { Button } from "@/modules/_shared/components/Button";
import { Search } from "lucide-react";
import { searchProspectsAction } from "../presentation/actions";
import { toast } from "sonner";

interface ProspectSearchProps {
  onSearchComplete: () => void;
}

export function ProspectSearch({ onSearchComplete }: ProspectSearchProps) {
  const [isSearching, setIsSearching] = React.useState(false);

  // Simplified city coords mapping for MVP
  const CITIES = [
    { label: "Madrid, ES", value: "madrid", lat: 40.4168, lng: -3.7038 },
    { label: "Barcelona, ES", value: "barcelona", lat: 41.3851, lng: 2.1734 },
    { label: "Valencia, ES", value: "valencia", lat: 39.4699, lng: -0.3774 },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const cityValue = formData.get("city") as string;

    if (!category || !cityValue) {
      toast.error("Por favor ingresa una categoría y ciudad");
      return;
    }

    const city = CITIES.find((c) => c.value === cityValue);
    if (!city) return;

    setIsSearching(true);
    const loadingToast = toast.loading("Buscando prospectos...");

    try {
      const query = `${category} en ${city.label}`;
      const response = await searchProspectsAction(query, { lat: city.lat, lng: city.lng });

      if (response.success) {
        toast.success(`Encontrados ${response.data?.length || 0} prospectos`, {
          id: loadingToast,
        });
        onSearchComplete();
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
          placeholder="Ej. Barberías, Clínicas Dentales..."
          disabled={isSearching}
          required
        />
      </div>
      <div className="flex-1 w-full sm:max-w-[300px]">
        <label
          htmlFor="city"
          className="block text-sm font-medium text-[var(--c-text-secondary)] mb-1"
        >
          Ciudad
        </label>
        <Select
          id="city"
          name="city"
          defaultValue=""
          disabled={isSearching}
          required
          options={CITIES.map((c) => ({ value: c.value, label: c.label }))}
        />
      </div>
      <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
        <Search className="mr-2 h-4 w-4" />
        {isSearching ? "Buscando..." : "Buscar"}
      </Button>
    </SearchBar>
  );
}
