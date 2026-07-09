import * as React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

/**
 * A reusable premium Empty State component.
 * Uses a subtle glassmorphic icon container and rich typography.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500 py-20 px-6",
        className,
      )}
      {...props}
    >
      <div className="relative mb-6 group">
        <div className="absolute inset-0 rounded-[var(--r-xl)] bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-border-subtle)] bg-[var(--c-bg-subtle)] text-[var(--c-text-secondary)] shadow-sm">
          {icon || <FolderOpen className="h-7 w-7" />}
        </div>
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-[var(--c-text-primary)] mb-3">
        {title}
      </h3>

      <p className="text-[14px] leading-relaxed text-[var(--c-text-secondary)] max-w-sm mx-auto mb-8 text-balance">
        {description}
      </p>

      {action && <div className="mb-4">{action}</div>}
      {children}
    </div>
  );
}
