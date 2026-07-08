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
    <div className="flex min-h-screen bg-[#0B0D12] relative overflow-hidden selection:bg-[var(--c-accent)] selection:text-white">
      {/* Global Ambient Glow - Deeper and more subtle */}
      <div className="absolute top-0 left-[20%] w-[1000px] h-[800px] bg-gradient-to-br from-[var(--c-accent)]/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-[#A855F7]/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-0" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen z-10 relative">
        <Topbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto overflow-y-auto custom-scrollbar px-10 py-6 md:px-16 md:py-10 pb-32">
          {children}
        </main>
      </div>
    </div>
  );
}
