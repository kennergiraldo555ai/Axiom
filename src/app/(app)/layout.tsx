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
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--c-bg-base)] selection:bg-[var(--c-primary)] selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(99_102_241_/_0.08),transparent_28%,transparent_68%,rgb(34_211_238_/_0.05)),linear-gradient(180deg,rgb(18_20_27_/_0.45),transparent_22%)]" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen z-10 relative">
        <Topbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto custom-scrollbar px-6 py-10 md:px-16 xl:px-24 md:py-16 pb-40">
          {children}
        </main>
      </div>
    </div>
  );
}
