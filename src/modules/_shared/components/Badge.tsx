import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--c-accent)] focus:ring-offset-1 focus:ring-offset-[var(--c-bg-base)] border",
  {
    variants: {
      variant: {
        default:
          "border-[var(--c-accent-border)] bg-[var(--c-accent-subtle)] text-[var(--c-accent)]",
        secondary:
          "border-[var(--c-border-subtle)] bg-[var(--c-bg-hover)] text-[var(--c-text-secondary)] hover:bg-[var(--c-border-subtle)]",
        destructive: "border-red-900/30 bg-red-900/20 text-red-400",
        outline: "text-[var(--c-text-secondary)] border-[var(--c-border-subtle)]",
        success: "border-emerald-900/30 bg-emerald-900/20 text-emerald-400",
        warning: "border-amber-900/30 bg-amber-900/20 text-amber-400",
        info: "border-blue-900/30 bg-blue-900/20 text-blue-400",
        premium:
          "border-[var(--c-border-default)] bg-[var(--c-bg-base)] text-[var(--c-text-primary)] shadow-premium",
        ai: "border-[var(--c-violet)]/30 bg-[var(--c-violet)]/10 text-[var(--c-violet)] shadow-[0_0_10px_rgba(168,85,247,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
