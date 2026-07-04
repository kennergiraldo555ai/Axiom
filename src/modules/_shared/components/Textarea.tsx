import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-[var(--r-md)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] px-3 py-2 text-sm text-[var(--c-text-primary)] placeholder:text-[var(--c-text-tertiary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-accent)] focus-visible:border-[var(--c-accent)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
