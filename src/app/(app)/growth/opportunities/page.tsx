import type { Metadata } from "next";

export const metadata: Metadata = { title: "Opportunities" };

/** Opportunities — implemented in Phase 3. */
export default function OpportunitiesPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--c-text-primary)", marginBottom: "var(--s-5)" }}>
        Opportunities
      </h1>
      <p style={{ color: "var(--c-text-secondary)", fontSize: "var(--text-sm)" }}>
        Implemented in Phase 3 — Sprint 0.2+
      </p>
    </div>
  );
}
