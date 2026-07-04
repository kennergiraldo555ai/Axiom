import type { Metadata } from "next";
import { Sidebar } from "./_components/Sidebar";
import { Topbar } from "./_components/Topbar";

export const metadata: Metadata = {
  title: "AXIOM",
};

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Authenticated app shell — sidebar + topbar + main content area.
 * Auth guard will be added in Sprint 0.2 (Phase 0 — Supabase Auth).
 * Spec §6.2: 240px sidebar expanded, 56px collapsed, max-width 1280px content.
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--c-bg-base)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 w-full max-w-[1440px] mx-auto overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
