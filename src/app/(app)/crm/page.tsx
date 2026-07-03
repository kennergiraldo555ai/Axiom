import type { Metadata } from "next";

export const metadata: Metadata = { title: "CRM" };

/** CRM leads list — implemented in Phase 4. */
export default function CrmPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--c-text-primary)", marginBottom: "var(--s-5)" }}>
        CRM
      </h1>
      <p style={{ color: "var(--c-text-secondary)", fontSize: "var(--text-sm)" }}>
        Implemented in Phase 4 — Sprint 0.2+
      </p>
    </div>
  );
}
