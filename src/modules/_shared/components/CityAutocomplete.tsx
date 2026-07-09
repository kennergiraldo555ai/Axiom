"use client";

import * as React from "react";
import { MapPin, Loader2 } from "lucide-react";

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
      <div className="relative group/input-inner">
        <input
          type="text"
          placeholder="Ej. Madrid, Barcelona, Bogotá..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          className="flex h-[60px] w-full rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)]/50 backdrop-blur-md pl-14 pr-12 text-[16px] font-medium text-[var(--c-text-primary)] shadow-tactile transition-all placeholder:text-[var(--c-text-disabled)] focus-visible:border-[var(--c-primary)] focus-visible:bg-[var(--c-bg-glass)] focus-visible:shadow-[0_0_30px_-10px_rgb(99_102_241_/_0.8)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-primary)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--c-border-hover)]"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
          <MapPin className="h-5 w-5 text-[var(--c-text-tertiary)] transition-all group-focus-within/input-inner:text-[var(--c-primary)] group-focus-within/input-inner:drop-shadow-[0_0_8px_rgb(99_102_241_/_0.8)]" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
          {isLoading ? <Loader2 className="h-5 w-5 text-[var(--c-primary)] animate-spin" /> : null}
        </div>
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-3 bg-[linear-gradient(180deg,var(--c-bg-elevated),var(--c-bg-base))] border border-[var(--c-border-strong)] rounded-[var(--r-xl)] shadow-[0_24px_50px_-12px_rgb(11_13_18_/_1)] overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 p-2">
          {results.length > 0 ? (
            <ul className="max-h-[300px] overflow-auto custom-scrollbar">
              {results.map((city) => (
                <li
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-3.5 mx-2 my-1 rounded-[var(--r-lg)] hover:bg-[var(--c-primary)]/10 cursor-pointer flex items-center gap-4 transition-all group/item"
                >
                  <MapPin className="w-4 h-4 text-[var(--c-text-tertiary)] group-hover/item:text-[var(--c-primary)] transition-colors" />
                  <div className="flex-1 flex flex-col">
                    <span className="text-[14px] font-semibold text-[var(--c-text-primary)] group-hover/item:text-[var(--c-primary)] transition-colors">
                      {city.name}
                    </span>
                    <span className="text-[12px] font-medium text-[var(--c-text-tertiary)]">
                      {city.admin1 ? `${city.admin1}, ` : ""}
                      {city.country}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="px-6 py-8 text-[14px] text-[var(--c-text-secondary)] text-center font-medium">
              No se encontraron ciudades
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
