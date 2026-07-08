"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { useState } from "react";
import { createClient } from "@/lib/auth/supabase/client";
import {
  LayoutDashboard,
  Target,
  Users,
  Building2,
  Briefcase,
  MessageSquare,
  Megaphone,
  Workflow,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visión General",
    items: [{ href: "/dashboard", label: "Panel", icon: <LayoutDashboard className="w-4 h-4" /> }],
  },
  {
    label: "Motor de Crecimiento",
    items: [
      { href: "/growth/prospecting", label: "Prospectos", icon: <Target className="w-4 h-4" /> },
      { href: "/growth/campaigns", label: "Campañas", icon: <Megaphone className="w-4 h-4" /> },
      {
        href: "/growth/automation",
        label: "Automatización",
        icon: <Workflow className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Ventas & CRM",
    items: [
      { href: "/crm/leads", label: "Clientes Potenciales", icon: <Sparkles className="w-4 h-4" /> },
      {
        href: "/crm/opportunities",
        label: "Oportunidades",
        icon: <Briefcase className="w-4 h-4" />,
      },
      { href: "/crm/companies", label: "Empresas", icon: <Building2 className="w-4 h-4" /> },
      { href: "/crm/contacts", label: "Contactos", icon: <Users className="w-4 h-4" /> },
      {
        href: "/crm/conversations",
        label: "Conversaciones",
        icon: <MessageSquare className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Análisis",
    items: [{ href: "/reports", label: "Reportes", icon: <BarChart3 className="w-4 h-4" /> }],
  },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/settings", label: "Configuración", icon: <Settings className="w-4 h-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      window.location.href = "/login";
    }
  }

  return (
    <aside className="w-[var(--sidebar-width-expanded)] min-h-screen bg-[var(--c-bg-base)] border-r border-[var(--c-border-subtle)] flex flex-col shrink-0 relative z-20">
      {/* Logo */}
      <div className="h-24 flex items-center px-10 shrink-0">
        <span className="text-xl font-bold text-[var(--c-text-primary)] tracking-tight flex items-center gap-4">
          <div className="w-10 h-10 rounded-[var(--r-md)] bg-[var(--c-bg-elevated)] flex items-center justify-center shadow-tactile border border-[var(--c-border-strong)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--c-accent)]/20 to-transparent pointer-events-none" />
            <span className="text-[var(--c-accent)] text-lg font-black drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] relative z-10">
              A
            </span>
          </div>
          AXIOM
        </span>
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 overflow-y-auto py-6 px-6 space-y-8 custom-scrollbar"
        aria-label="Navegación Principal"
      >
        {NAV_GROUPS.map((group) => {
          // Translate group labels for Neo-Tactile 100% Spanish compliance
          const labelEs =
            group.label === "Overview"
              ? "Vista General"
              : group.label === "Growth"
                ? "Crecimiento"
                : group.label;
          return (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--c-text-tertiary)] px-4 mb-3 drop-shadow-[0_0_5px_rgba(255,255,255,0.05)]">
                {labelEs}
              </span>
              {group.items.map((item) => {
                // Translate item labels
                const itemLabelEs =
                  item.label === "Dashboard"
                    ? "Panel"
                    : item.label === "Prospecting"
                      ? "Prospectos"
                      : item.label === "Campaigns"
                        ? "Campañas"
                        : item.label === "Leads"
                          ? "Clientes Pot."
                          : item.label === "Settings"
                            ? "Ajustes"
                            : item.label;
                return (
                  <SidebarItem
                    key={item.href}
                    item={{ ...item, label: itemLabelEs }}
                    active={isActive(item.href)}
                  />
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom nav & User */}
      <div className="p-6 shrink-0 flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-2">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const itemLabelEs = item.label === "Settings" ? "Configuración" : item.label;
            return (
              <SidebarItem
                key={item.href}
                item={{ ...item, label: itemLabelEs }}
                active={isActive(item.href)}
              />
            );
          })}
        </div>

        {/* Plan Growth Card */}
        <div className="mt-2 p-4 rounded-2xl bg-gradient-to-b from-[var(--c-bg-elevated)] to-[var(--c-bg-base)] border border-[var(--c-border-strong)] shadow-tactile flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--c-violet)]/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-[var(--c-text-primary)] group-hover:text-[var(--c-accent)] transition-colors">
                Plan Growth
              </span>
              <span className="text-[11px] text-[var(--c-text-tertiary)]">Profesional</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--c-text-tertiary)] group-hover:text-[var(--c-accent)] transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-1.5 w-full bg-[var(--c-bg-hover)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[var(--c-violet)] to-[var(--c-accent)] w-[62%] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[var(--c-text-tertiary)]">Renueva el 12 Jul 2025</span>
              <span className="text-[var(--c-text-secondary)] font-bold">62%</span>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="flex items-center gap-3 p-3 mt-2 rounded-2xl hover:bg-[var(--c-bg-hover)] transition-colors cursor-pointer border border-transparent hover:border-[var(--c-border-subtle)]">
          <div className="w-10 h-10 rounded-full bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] flex items-center justify-center shadow-tactile shrink-0">
            <span className="text-xs font-bold text-[var(--c-text-primary)]">KG</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[13px] font-semibold text-[var(--c-text-primary)] truncate">
              Kenner Giraldo
            </span>
            <span className="text-[11px] text-[var(--c-text-tertiary)] truncate">Admin</span>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-[var(--c-text-tertiary)] hover:text-[var(--c-danger)] transition-colors p-1"
            title="Cerrar sesión"
          >
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  item: NavItem;
  active: boolean;
}

function SidebarItem({ item, active }: SidebarItemProps) {
  return (
    <Link
      href={item.href as Route}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] relative overflow-hidden ${
        active
          ? "text-[var(--c-text-primary)] font-semibold bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
          : "text-[var(--c-text-secondary)] hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-text-primary)] border border-transparent"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {/* Active state inner glow & indicator */}
      {active && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-violet)]/10 via-[var(--c-accent)]/5 to-transparent pointer-events-none" />
        </>
      )}

      <span
        className={`transition-all duration-300 relative z-10 ${
          active
            ? "text-[var(--c-violet)] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
            : "text-[var(--c-text-tertiary)] group-hover:text-[var(--c-text-primary)]"
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-10 tracking-wide">{item.label}</span>
    </Link>
  );
}
