import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--c-bg-base)]">
      <div className="flex flex-col items-center gap-4 text-[var(--c-text-secondary)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--c-accent)]" />
        <p className="text-sm font-medium tracking-wide">Loading AXIOM...</p>
      </div>
    </div>
  );
}
