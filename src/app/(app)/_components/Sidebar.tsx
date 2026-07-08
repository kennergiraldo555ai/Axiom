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
      // If sign out fails, force redirect anyway
      window.location.href = "/login";
    }
  }

  return (
    <aside className="w-[var(--sidebar-width-expanded)] min-h-screen bg-[var(--c-bg-elevated)] border-r border-[var(--c-border-subtle)] flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 border-b border-[var(--c-border-subtle)] shrink-0">
        <span className="text-base font-bold text-[var(--c-text-primary)] tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--c-accent)] flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
            <span className="text-black text-xs font-black">A</span>
          </div>
          AXIOM
        </span>
      </div>

      {/* Main nav */}
      <nav
        className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-hide"
        aria-label="Main Navigation"
      >
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--c-text-tertiary)] px-3 mb-2">
              {group.label}
            </span>
            {group.items.map((item) => (
              <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="p-3 border-t border-[var(--c-border-subtle)] shrink-0 flex flex-col gap-1">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
        <button
          id="sidebar-sign-out"
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-3 px-3 py-2 rounded-[var(--r-md)] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] text-[var(--c-text-secondary)] hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-danger)] disabled:opacity-50"
        >
          <span className="text-[var(--c-text-tertiary)]">
            {signingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
          </span>
          {signingOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
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
      className={`group flex items-center gap-3 px-3 py-2 rounded-[var(--r-md)] text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] ${
        active
          ? "bg-[var(--c-bg-hover)] text-[var(--c-text-primary)] font-semibold shadow-sm"
          : "text-[var(--c-text-secondary)] hover:bg-[var(--c-bg-hover)] hover:text-[var(--c-text-primary)]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`transition-colors ${active ? "text-[var(--c-text-primary)]" : "text-[var(--c-text-tertiary)] group-hover:text-[var(--c-text-primary)]"}`}
      >
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}
