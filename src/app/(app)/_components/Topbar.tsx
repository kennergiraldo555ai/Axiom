"use client";

import { Bell } from "lucide-react";
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
    <header className="h-24 flex items-center justify-between px-10 shrink-0 sticky top-0 z-40 bg-transparent">
      {/* Left — Breadcrumbs */}
      <div className="flex items-center gap-3 text-[12px] font-semibold tracking-wider">
        <Link
          href="/dashboard"
          className="text-[var(--c-text-tertiary)] hover:text-[var(--c-accent)] transition-colors"
        >
          AXIOM
        </Link>
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const label = ROUTE_MAP[path] || path;

          return (
            <div key={path} className="flex items-center gap-3">
              <span className="text-[var(--c-text-tertiary)]">/</span>
              <span
                className={
                  isLast
                    ? "text-[var(--c-text-primary)]"
                    : "text-[var(--c-text-tertiary)] hover:text-[var(--c-text-primary)] transition-colors"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right — actions + user */}
      <div className="flex items-center gap-5">
        {/* Global Search */}
        <div className="relative group hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-bg-hover)] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] rounded-full h-10 px-4 gap-3 w-64 shadow-tactile focus-within:border-[var(--c-accent)] focus-within:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--c-text-tertiary)] group-focus-within:text-[var(--c-accent)] transition-colors"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar en AXIOM..."
              className="bg-transparent border-none outline-none text-[13px] text-[var(--c-text-primary)] placeholder:text-[var(--c-text-tertiary)] w-full font-medium"
            />
            <div className="flex items-center justify-center bg-[var(--c-bg-hover)] rounded px-1.5 py-0.5 border border-[var(--c-border-subtle)]">
              <span className="text-[10px] font-mono text-[var(--c-text-tertiary)]">⌘K</span>
            </div>
          </div>
        </div>

        {/* Notifications bell */}
        <button
          id="topbar-notifications-bell"
          aria-label="Notificaciones"
          className="relative w-10 h-10 flex items-center justify-center rounded-full bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] shadow-tactile group hover:border-[var(--c-border-hover)] hover:bg-[var(--c-bg-hover)]"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[var(--c-violet)] border-2 border-[var(--c-bg-base)] flex items-center justify-center">
            <span className="text-[8px] font-bold text-white leading-none">2</span>
          </span>
        </button>

        {/* User avatar */}
        <button
          id="topbar-user-menu"
          aria-label="Menú de usuario"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] focus-visible:outline-none shadow-tactile hover:border-[var(--c-accent-border)] transition-all"
        >
          <span className="text-xs font-bold text-[var(--c-text-primary)]">KG</span>
        </button>
      </div>
    </header>
  );
}
