import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 relative w-full">
        <select
          className={cn(
            "flex h-9 w-full appearance-none rounded-[var(--r-md)] border bg-[var(--c-bg-elevated)] px-3 py-1 pr-8 text-[13px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--c-bg-base)] disabled:cursor-not-allowed disabled:opacity-50 hover:bg-[var(--c-bg-hover)]",
            error
              ? "border-[var(--c-danger)] focus-visible:ring-[var(--c-danger)]"
              : "border-[var(--c-border-subtle)] focus-visible:ring-[var(--c-accent)] hover:border-[var(--c-border-default)]",
            className,
          )}
          ref={ref}
          {...props}
        >
          <option value="" disabled hidden>
            Select an option
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[var(--c-bg-elevated)] text-[var(--c-text-primary)]"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-[var(--c-text-tertiary)] pointer-events-none" />
        {error && <span className="text-xs text-[var(--c-danger)] font-medium">{error}</span>}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
