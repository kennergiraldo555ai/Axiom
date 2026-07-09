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
    items: [
      {
        href: "/dashboard",
        label: "Panel",
        icon: <LayoutDashboard className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    label: "Motor de Crecimiento",
    items: [
      {
        href: "/growth/prospecting",
        label: "Prospectos",
        icon: <Target className="w-[18px] h-[18px]" />,
      },
      {
        href: "/growth/campaigns",
        label: "Campañas",
        icon: <Megaphone className="w-[18px] h-[18px]" />,
      },
      {
        href: "/growth/automation",
        label: "Automatización",
        icon: <Workflow className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    label: "Ventas & CRM",
    items: [
      {
        href: "/crm/leads",
        label: "Clientes Potenciales",
        icon: <Sparkles className="w-[18px] h-[18px]" />,
      },
      {
        href: "/crm/opportunities",
        label: "Oportunidades",
        icon: <Briefcase className="w-[18px] h-[18px]" />,
      },
      {
        href: "/crm/companies",
        label: "Empresas",
        icon: <Building2 className="w-[18px] h-[18px]" />,
      },
      { href: "/crm/contacts", label: "Contactos", icon: <Users className="w-[18px] h-[18px]" /> },
      {
        href: "/crm/conversations",
        label: "Conversaciones",
        icon: <MessageSquare className="w-[18px] h-[18px]" />,
      },
    ],
  },
  {
    label: "Análisis",
    items: [
      { href: "/reports", label: "Reportes", icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    ],
  },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/settings", label: "Configuración", icon: <Settings className="w-[18px] h-[18px]" /> },
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
    <aside className="relative z-20 flex min-h-screen w-[260px] shrink-0 flex-col border-r border-[var(--c-border-subtle)] bg-[var(--c-bg-base)]">
      {/* Logo */}
      <div className="flex h-[100px] shrink-0 items-center px-8">
        <span className="flex items-center gap-4 text-[22px] font-black tracking-[0.1em] text-[var(--c-text-primary)]">
          <div className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[var(--r-xl)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] shadow-[0_0_24px_-8px_rgb(99_102_241_/_0.8)]">
            <span className="relative z-10 text-[20px] font-black text-white">A</span>
          </div>
          AXIOM
        </span>
      </div>

      {/* Main nav */}
      <nav
        className="custom-scrollbar flex-1 space-y-10 overflow-y-auto px-6 py-6"
        aria-label="Navegación Principal"
      >
        {NAV_GROUPS.map((group) => {
          const labelEs =
            group.label === "Overview"
              ? "Vista General"
              : group.label === "Growth"
                ? "Crecimiento"
                : group.label;
          return (
            <div key={group.label} className="flex flex-col gap-2">
              <span className="mb-4 px-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--c-text-tertiary)]">
                {labelEs}
              </span>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
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
            </div>
          );
        })}
      </nav>

      {/* Bottom nav & User */}
      <div className="mt-auto flex shrink-0 flex-col gap-6 p-6">
        <div className="flex flex-col gap-1">
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
        <div className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] bg-[linear-gradient(180deg,var(--c-bg-elevated),var(--c-bg-base))] p-5 shadow-tactile transition-all hover:border-[var(--c-primary-border)] hover:shadow-glow">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--c-primary),transparent)] opacity-50" />

          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-bold text-[var(--c-text-primary)] group-hover:text-[var(--c-primary)] transition-colors">
                Plan Growth
              </span>
              <span className="text-[12px] font-medium text-[var(--c-text-tertiary)]">
                Profesional
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--c-text-tertiary)] transition-colors group-hover:text-[var(--c-primary)]" />
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="h-1.5 w-full bg-[var(--c-border-strong)] rounded-full overflow-hidden">
              <div className="h-full w-[62%] rounded-full bg-[linear-gradient(90deg,var(--c-primary),var(--c-accent))] shadow-[0_0_14px_rgb(99_102_241_/_0.8)]" />
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium">
              <span className="text-[var(--c-text-tertiary)]">Renueva el 12 Jul 2025</span>
              <span className="text-[var(--c-text-secondary)] font-bold">62%</span>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="flex cursor-pointer items-center gap-4 rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] p-3 shadow-tactile transition-all hover:border-[var(--c-primary-border)] hover:bg-[var(--c-bg-hover)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] shadow-inner">
            <span className="text-[13px] font-black text-[var(--c-text-primary)]">KG</span>
          </div>
          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <span className="text-[14px] font-bold text-[var(--c-text-primary)] truncate">
              Kenner Giraldo
            </span>
            <span className="text-[12px] font-medium text-[var(--c-text-tertiary)] truncate">
              Admin
            </span>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--r-md)] text-[var(--c-text-tertiary)] transition-colors hover:bg-[var(--c-bg-base)] hover:text-[var(--c-danger)] border border-transparent hover:border-[var(--c-border-strong)]"
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
      className={`group relative flex items-center gap-4 overflow-hidden rounded-[var(--r-xl)] px-4 py-3.5 text-[14px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-primary)] ${
        active
          ? "bg-[var(--c-primary)]/10 text-[var(--c-primary)]"
          : "bg-transparent text-[var(--c-text-secondary)] hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-text-primary)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {/* Active state indicator */}
      {active && (
        <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-[var(--c-primary)] shadow-[0_0_12px_rgb(99_102_241_/_0.8)]" />
      )}

      <span
        className={`transition-all duration-300 relative z-10 flex items-center justify-center ${
          active
            ? "text-[var(--c-primary)] drop-shadow-[0_0_8px_rgb(99_102_241_/_0.5)]"
            : "text-[var(--c-text-tertiary)] group-hover:text-[var(--c-text-primary)]"
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-10 tracking-wide">{item.label}</span>
    </Link>
  );
}
