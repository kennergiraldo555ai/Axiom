"use client";

import * as React from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "./Input";

export interface CityData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  country: string;
  admin1?: string; // State / Region
}

interface CityAutocompleteProps {
  onSelect: (city: CityData | null) => void;
  disabled?: boolean;
}

interface OpenMeteoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export function CityAutocomplete({ onSelect, disabled }: CityAutocompleteProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<CityData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<CityData | null>(null);

  const wrapperRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!query || query.length < 2) {
      return;
    }

    if (selectedCity && query === `${selectedCity.name}, ${selectedCity.country}`) {
      return; // Prevent searching when a city is already selected and input matches it
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query,
          )}&count=10&language=es&format=json`,
        );
        const data = await response.json();

        if (data.results) {
          setResults(
            data.results.map((r: OpenMeteoResult) => ({
              id: r.id,
              name: r.name,
              lat: r.latitude,
              lng: r.longitude,
              country: r.country,
              admin1: r.admin1,
            })),
          );
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error searching cities:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selectedCity]);

  const handleSelect = (city: CityData) => {
    const formattedName = `${city.name}, ${city.country}`;
    setQuery(formattedName);
    setSelectedCity(city);
    setIsOpen(false);
    onSelect(city);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    if (val.length < 2) {
      setResults([]);
    }
    if (selectedCity) {
      setSelectedCity(null);
      onSelect(null);
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative group">
        <Input
          type="text"
          placeholder="Ej. Madrid, Barcelona, Bogotá..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          className="w-full h-[50px] text-[15px] pl-12 pr-10 bg-[var(--c-bg-base)] border-[var(--c-border-strong)] focus:border-[var(--c-accent)] focus:ring-[var(--c-accent)] focus:shadow-[0_0_15px_rgba(0,229,255,0.3)] font-medium transition-all shadow-tactile rounded-[var(--r-md)]"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <MapPin className="h-5 w-5 text-[var(--c-text-tertiary)] group-focus-within:text-[var(--c-accent)] group-focus-within:drop-shadow-[0_0_5px_rgba(0,229,255,0.8)] transition-all" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          {isLoading ? <Loader2 className="h-4 w-4 text-[var(--c-accent)] animate-spin" /> : null}
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] rounded-[var(--r-xl)] shadow-glow overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {results.length > 0 ? (
            <ul className="py-2 max-h-[300px] overflow-auto custom-scrollbar">
              {results.map((city) => (
                <li
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-2 mx-2 rounded-[var(--r-md)] hover:bg-[var(--c-accent)]/10 cursor-pointer flex items-center gap-3 transition-colors group/item"
                >
                  <div className="flex-1 flex flex-col">
                    <span className="text-[13px] font-bold text-[var(--c-text-primary)] group-hover/item:text-[var(--c-accent)] transition-colors">
                      {city.name}
                    </span>
                    <span className="text-[11px] text-[var(--c-text-secondary)]">
                      {city.admin1 ? `${city.admin1}, ` : ""}
                      {city.country}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="px-4 py-6 text-[13px] text-[var(--c-accent)] text-center font-medium opacity-70">
              No se encontraron ciudades
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
