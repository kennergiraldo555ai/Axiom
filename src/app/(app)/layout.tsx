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
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">{children}</main>
      </div>

      <style>{`
        .app-shell {
          display: flex;
          min-height: 100vh;
          background-color: var(--c-bg-base);
        }

        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .app-content {
          flex: 1;
          padding: var(--s-6);
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
