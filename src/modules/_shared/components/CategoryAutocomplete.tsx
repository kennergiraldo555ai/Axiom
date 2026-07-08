"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

const CATEGORIES = [
  "Agencias de marketing",
  "Restaurantes",
  "Clínicas dentales",
  "Gimnasios",
  "Bienes raíces",
  "Estudios de arquitectura",
  "Despachos de abogados",
  "Peluquerías",
  "Spa y centros de estética",
  "Tiendas de ropa",
];

interface CategoryAutocompleteProps {
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function CategoryAutocomplete({ onSelect, disabled }: CategoryAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = CATEGORIES.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (category: string) => {
    setValue(category);
    setSearch(category);
    onSelect(category);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setValue(val);
    onSelect(val);
    setOpen(true);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id="category"
          name="category"
          value={search}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
          disabled={disabled}
          placeholder="Ej. Agencias de marketing..."
          className="flex h-[50px] w-full rounded-[var(--r-md)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] px-5 py-3 text-[15px] text-[var(--c-text-primary)] font-medium placeholder:text-[var(--c-text-disabled)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] focus-visible:border-[var(--c-accent)] focus-visible:shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-tactile"
          autoComplete="off"
          required
        />
        <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--c-text-tertiary)] pointer-events-none opacity-50" />
      </div>

      {open && filteredCategories.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto custom-scrollbar rounded-[var(--r-md)] border border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] backdrop-blur-xl p-1.5 shadow-glow z-50 animate-in fade-in zoom-in-95 duration-150">
          {filteredCategories.map((category) => (
            <div
              key={category}
              onClick={() => handleSelect(category)}
              className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm font-medium outline-none hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)] transition-colors text-[var(--c-text-secondary)]"
            >
              <span
                className={`mr-2 flex h-4 w-4 items-center justify-center ${value === category ? "opacity-100" : "opacity-0"}`}
              >
                <Check
                  className="h-4 w-4 text-[var(--c-accent)] drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]"
                  strokeWidth={3}
                />
              </span>
              {category}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
