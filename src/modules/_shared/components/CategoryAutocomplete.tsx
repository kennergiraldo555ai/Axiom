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
      <div className="relative group/input-inner">
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
          className="flex h-[60px] w-full rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)]/50 backdrop-blur-md px-6 py-4 text-[16px] font-medium text-[var(--c-text-primary)] shadow-tactile transition-all placeholder:text-[var(--c-text-disabled)] focus-visible:border-[var(--c-primary)] focus-visible:bg-[var(--c-bg-glass)] focus-visible:shadow-[0_0_30px_-10px_rgb(99_102_241_/_0.8)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-primary)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--c-border-hover)]"
          autoComplete="off"
          required
        />
        <ChevronsUpDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--c-text-tertiary)] pointer-events-none transition-colors group-hover/input-inner:text-[var(--c-primary)]" />
      </div>

      {open && filteredCategories.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 max-h-72 overflow-y-auto custom-scrollbar rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(180deg,var(--c-bg-elevated),var(--c-bg-base))] backdrop-blur-2xl p-2 shadow-[0_24px_50px_-12px_rgb(11_13_18_/_1)] z-50 animate-in fade-in zoom-in-95 duration-200">
          {filteredCategories.map((category) => (
            <div
              key={category}
              onClick={() => handleSelect(category)}
              className="relative flex cursor-pointer select-none items-center rounded-[var(--r-lg)] px-4 py-3.5 text-[14px] font-semibold outline-none hover:bg-[var(--c-primary)]/10 hover:text-[var(--c-primary)] transition-all text-[var(--c-text-secondary)]"
            >
              <span
                className={`mr-3 flex h-5 w-5 items-center justify-center transition-all ${value === category ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
              >
                <Check
                  className="h-5 w-5 text-[var(--c-primary)] drop-shadow-[0_0_8px_rgb(99_102_241_/_0.8)]"
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
