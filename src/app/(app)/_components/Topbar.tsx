"use client";

import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const ROUTE_MAP: Record<string, string> = {
  dashboard: "Panel",
  growth: "Growth",
  prospecting: "Prospectos",
  campaigns: "Campañas",
  crm: "CRM",
  leads: "Clientes Potenciales",
  settings: "Configuración",
};

export function Topbar() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-40 flex h-[110px] shrink-0 items-center justify-between bg-[var(--c-bg-base)]/80 px-8 backdrop-blur-2xl md:px-16 xl:px-24">
      <div className="flex items-center gap-3 text-[13px] font-bold tracking-wide">
        <Link
          href="/dashboard"
          className="text-[var(--c-text-tertiary)] transition-colors hover:text-[var(--c-primary)]"
        >
          AXIOM
        </Link>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const label = ROUTE_MAP[path] || path;

          return (
            <div key={path} className="flex items-center gap-3">
              <span className="text-[var(--c-border-strong)]">/</span>
              <span
                className={
                  isLast
                    ? "text-[var(--c-text-primary)]"
                    : "text-[var(--c-text-tertiary)] transition-colors hover:text-[var(--c-text-primary)]"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-5 md:gap-6">
        <div className="group relative hidden md:block">
          <div className="relative flex h-11 w-72 items-center gap-3 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)]/50 px-4 shadow-tactile transition-all focus-within:border-[var(--c-primary-border)] focus-within:bg-[var(--c-bg-glass)] focus-within:shadow-[0_0_24px_-12px_rgb(99_102_241_/_0.95)] hover:border-[var(--c-border-hover)]">
            <Search className="h-4 w-4 text-[var(--c-text-tertiary)] transition-colors group-focus-within:text-[var(--c-primary)]" />
            <input
              type="text"
              placeholder="Buscar en AXIOM..."
              className="w-full border-none bg-transparent text-[14px] font-medium text-[var(--c-text-primary)] outline-none placeholder:text-[var(--c-text-disabled)]"
            />
            <div className="flex items-center justify-center rounded border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] px-2 py-0.5 shadow-sm">
              <span className="font-mono text-[10px] font-bold text-[var(--c-text-tertiary)]">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        <button
          id="topbar-notifications-bell"
          aria-label="Notificaciones"
          className="group relative flex h-11 w-11 items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)]/50 text-[var(--c-text-secondary)] shadow-tactile transition-all hover:border-[var(--c-primary-border)] hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-primary)]"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[var(--c-primary)] shadow-[0_0_8px_rgb(99_102_241_/_0.8)]">
            <span className="sr-only">Nuevas notificaciones</span>
          </span>
        </button>
      </div>
    </header>
  );
}
