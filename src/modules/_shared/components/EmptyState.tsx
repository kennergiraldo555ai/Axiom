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
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--c-accent)] to-[#a855f7] opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity duration-500" />
        <div className="relative w-16 h-16 flex items-center justify-center rounded-[var(--r-2xl)] bg-[var(--c-bg-subtle)] border border-[var(--c-border-subtle)] shadow-sm text-[var(--c-text-secondary)]">
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
