import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  solution?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title,
  description,
  solution,
  onRetry,
  isRetrying,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-[var(--r-xl)] border border-[var(--c-danger)]/20 bg-[var(--c-danger)]/5 p-8 text-center animate-in fade-in-50",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--c-danger)]/10 text-[var(--c-danger)] mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--c-text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--c-text-secondary)]">{description}</p>

        {solution && (
          <div className="mt-4 rounded-md bg-[var(--c-bg-elevated)] border border-[var(--c-border-default)] p-3 text-sm text-[var(--c-text-primary)] text-left w-full">
            <span className="font-semibold text-[var(--c-info)] block mb-1">Posible solución:</span>
            {solution}
          </div>
        )}

        {onRetry && (
          <Button
            variant="outline"
            className="mt-6 border-[var(--c-danger)]/30 hover:bg-[var(--c-danger)]/10 hover:text-[var(--c-danger)]"
            onClick={onRetry}
            disabled={isRetrying}
          >
            <RotateCw className={cn("mr-2 h-4 w-4", isRetrying && "animate-spin")} />
            {isRetrying ? "Reintentando..." : "Reintentar"}
          </Button>
        )}
      </div>
    </div>
  );
}
