import type { Metadata } from "next";
import { Sparkles, Activity, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] items-center justify-center p-8 animate-in fade-in-50 duration-500">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 relative">
        {/* Glow effect background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--c-accent)]/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Logo / Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)] to-[#a855f7] blur-xl opacity-30 rounded-3xl" />
          <div className="w-20 h-20 bg-[var(--c-bg-elevated)] border border-[var(--c-border-strong)] rounded-3xl shadow-xl flex items-center justify-center relative z-10">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[var(--c-accent)] to-[#a855f7]">
              A
            </span>
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--c-text-primary)]">
            AXIOM <span className="text-[var(--c-accent)]">GROWTH</span>
          </h1>
          <p className="text-lg text-[var(--c-text-secondary)] max-w-[500px] mx-auto leading-relaxed">
            El motor de inteligencia comercial está en desarrollo. Muy pronto tendrás acceso al
            panel completo de análisis, prospección y gestión de oportunidades.
          </p>
        </div>

        {/* Feature preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8 relative z-10">
          <div className="bg-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] p-5 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-semibold text-[var(--c-text-primary)] uppercase tracking-wider">
              Prospección Inteligente
            </h3>
          </div>
          <div className="bg-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] p-5 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)] flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-semibold text-[var(--c-text-primary)] uppercase tracking-wider">
              Análisis Predictivo
            </h3>
          </div>
          <div className="bg-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] p-5 rounded-2xl flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-[13px] font-semibold text-[var(--c-text-primary)] uppercase tracking-wider">
              Automatización
            </h3>
          </div>
        </div>

        {/* Tagline */}
        <div className="pt-8 flex items-center gap-2 text-[13px] text-[var(--c-text-tertiary)] font-medium">
          <Sparkles className="w-4 h-4 text-[var(--c-accent)]" />
          Próximamente en producción
        </div>
      </div>
    </div>
  );
}
