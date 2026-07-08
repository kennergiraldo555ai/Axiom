import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-[var(--r-md)] border bg-[var(--c-bg-subtle)] px-3 py-1 text-[13px] text-[var(--c-text-primary)] transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--c-text-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--c-bg-hover)]",
            error
              ? "border-[var(--c-danger)] focus-visible:ring-[var(--c-danger)]"
              : "border-[var(--c-border-subtle)] focus-visible:ring-[var(--c-accent)] focus-visible:border-[var(--c-accent)] hover:border-[var(--c-border-default)]",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-[var(--c-danger)] font-medium">{error}</span>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
