import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "var(--c-bg-base, #0a0a0b)",
        color: "var(--c-text-primary, #f4f4f5)",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "16px",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "3rem", fontWeight: 700, color: "var(--c-text-tertiary, #71717a)" }}>
        404
      </span>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Page not found</h1>
      <p style={{ color: "var(--c-text-secondary, #a1a1aa)", maxWidth: "400px" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        style={{
          marginTop: "8px",
          color: "var(--c-accent, #4ade80)",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Go to Dashboard →
      </Link>
    </div>
  );
}
