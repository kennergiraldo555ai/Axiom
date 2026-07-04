import * as React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-[var(--r-xl)] border border-dashed border-[var(--c-border-default)] bg-[var(--c-bg-subtle)] p-8 text-center animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--c-bg-elevated)] text-[var(--c-text-tertiary)] mb-4">
          {icon || <FolderOpen className="h-10 w-10" />}
        </div>
        <h2 className="text-xl font-semibold text-[var(--c-text-primary)]">{title}</h2>
        <p className="mb-8 mt-2 text-sm font-normal leading-6 text-[var(--c-text-secondary)]">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}
