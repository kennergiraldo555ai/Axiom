import * as React from "react";
import { cn } from "@/lib/utils";

export type GradientBorderProps = React.HTMLAttributes<HTMLDivElement>;

export const GradientBorder = React.forwardRef<HTMLDivElement, GradientBorderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[var(--r-2xl)] p-[1px] overflow-hidden bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-cyan)]",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--c-accent)] to-[var(--c-cyan)] opacity-20 blur-xl" />
        <div className="relative h-full w-full rounded-[calc(var(--r-2xl)-1px)] bg-[var(--c-bg-base)]">
          {children}
        </div>
      </div>
    );
  },
);
GradientBorder.displayName = "GradientBorder";
