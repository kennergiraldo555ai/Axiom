import type { Metadata } from "next";
import { Sparkles, Activity, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const previewItems = [
  { label: "Prospección Inteligente", icon: Target },
  { label: "Análisis Predictivo", icon: Activity },
  { label: "Automatización", icon: Zap },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center p-8 animate-in fade-in-50 duration-500">
      <div className="relative flex w-full max-w-3xl flex-col items-center space-y-8 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-16 h-32 bg-[linear-gradient(90deg,transparent,rgb(99_102_241_/_0.13),rgb(168_85_247_/_0.1),transparent)] blur-3xl" />

        <div className="relative">
          <div className="absolute inset-0 rounded-[var(--r-xl)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] opacity-30 blur-xl" />
          <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] shadow-tactile">
            <span className="font-display text-3xl font-black text-[var(--c-text-primary)]">A</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-bold tracking-normal text-[var(--c-text-primary)] sm:text-5xl">
            AXIOM <span className="text-[var(--c-primary)]">GROWTH</span>
          </h1>
          <p className="mx-auto max-w-[560px] text-lg leading-relaxed text-[var(--c-text-secondary)]">
            El motor de inteligencia comercial está en desarrollo. Muy pronto tendrás acceso al
            panel completo de análisis, prospección y gestión de oportunidades.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {previewItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 rounded-[var(--r-xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] p-5 text-center shadow-tactile"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--r-md)] border border-[var(--c-primary-border)] bg-[var(--c-primary-subtle)] text-[var(--c-primary)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--c-text-primary)]">
                  {item.label}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pt-8 text-[13px] font-medium text-[var(--c-text-tertiary)]">
          <Sparkles className="h-4 w-4 text-[var(--c-accent)]" />
          Próximamente en producción
        </div>
      </div>
    </div>
  );
}
