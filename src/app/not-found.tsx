import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg-base)]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[var(--c-text-primary)] mb-4">404</h1>
        <h2 className="text-xl font-medium text-[var(--c-text-secondary)] mb-8">Page not found</h2>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-[var(--c-bg-subtle)] hover:bg-[var(--c-bg-hover)] text-[var(--c-text-primary)] border border-[var(--c-border-default)] rounded-md transition-colors inline-block"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
