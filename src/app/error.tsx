"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Spec §2.1: Sentry would catch this
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg-base)]">
      <div className="max-w-md p-8 text-center border border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] rounded-xl">
        <h2 className="text-xl font-bold text-[var(--c-danger)] mb-2">Algo salió mal</h2>
        <p className="text-[var(--c-text-secondary)] mb-6 text-sm">
          Ocurrió un error inesperado. Ya hemos sido notificados.
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-[var(--c-bg-subtle)] hover:bg-[var(--c-bg-hover)] text-[var(--c-text-primary)] border border-[var(--c-border-default)] rounded-md transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
