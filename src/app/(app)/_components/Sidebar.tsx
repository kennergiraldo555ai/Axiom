"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/growth/prospecting", label: "Prospecting", icon: "◎" },
  { href: "/growth/opportunities", label: "Opportunities", icon: "◈" },
  { href: "/crm", label: "CRM", icon: "◉" },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [{ href: "/settings", label: "Settings", icon: "⚙" }];

/**
 * App sidebar — collapsible navigation per spec §6.2.
 * Collapse state will be managed by Zustand in a future sprint.
 * Currently rendered in expanded mode (240px).
 */
export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        width: "var(--sidebar-width-expanded)",
        minHeight: "100vh",
        backgroundColor: "var(--c-bg-elevated)",
        borderRight: "1px solid var(--c-border-subtle)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          padding: "0 var(--s-4)",
          borderBottom: "1px solid var(--c-border-subtle)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 700,
            color: "var(--c-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          AXIOM
        </span>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: "var(--s-2) 0" }}>
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div style={{ padding: "var(--s-2) 0", borderTop: "1px solid var(--c-border-subtle)" }}>
        {BOTTOM_NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} item={item} active={isActive(item.href)} />
        ))}
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
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--s-3)",
        padding: "var(--s-2) var(--s-4)",
        margin: "1px var(--s-2)",
        borderRadius: "var(--r-md)",
        color: active ? "var(--c-text-primary)" : "var(--c-text-secondary)",
        backgroundColor: active ? "var(--c-bg-hover)" : "transparent",
        textDecoration: "none",
        fontSize: "var(--text-sm)",
        fontWeight: active ? 500 : 400,
        transition: "all var(--transition-fast)",
      }}
    >
      <span style={{ fontSize: "var(--text-base)", opacity: 0.7 }}>{item.icon}</span>
      {item.label}
    </Link>
  );
}
