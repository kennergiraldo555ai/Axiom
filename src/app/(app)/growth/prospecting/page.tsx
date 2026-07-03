import type { Metadata } from "next";

export const metadata: Metadata = { title: "Prospecting" };

/** Prospecting — implemented in Phase 3. */
export default function ProspectingPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--c-text-primary)", marginBottom: "var(--s-5)" }}>
        Prospecting
      </h1>
      <p style={{ color: "var(--c-text-secondary)", fontSize: "var(--text-sm)" }}>
        Implemented in Phase 3 — Sprint 0.2+
      </p>
    </div>
  );
}
