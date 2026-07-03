import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

/** Settings — profile, integrations, AI config. Implemented in Phase 4. */
export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--c-text-primary)", marginBottom: "var(--s-5)" }}>
        Settings
      </h1>
      <p style={{ color: "var(--c-text-secondary)", fontSize: "var(--text-sm)" }}>
        Implemented in Phase 4 — Sprint 0.2+
      </p>
    </div>
  );
}
