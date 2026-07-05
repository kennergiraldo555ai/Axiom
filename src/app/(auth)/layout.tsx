import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg-base)]">
      <div className="w-full max-w-md p-8 bg-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--c-text-primary)] tracking-tight">AXIOM</h1>
          <p className="text-[var(--c-text-secondary)] mt-2">
            Inteligencia comercial impulsada por IA
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
