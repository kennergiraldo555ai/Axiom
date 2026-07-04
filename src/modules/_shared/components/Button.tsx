import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--r-md)] text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 ring-offset-2 ring-offset-[var(--c-bg-base)] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--c-accent)] text-white hover:bg-[var(--c-accent-hover)] shadow-md shadow-[var(--c-accent-subtle)] font-semibold",
        destructive:
          "bg-[var(--c-danger)] text-white hover:bg-[#ef4444] shadow-md shadow-red-900/20 font-semibold",
        outline:
          "border border-[var(--c-border-default)] bg-transparent hover:bg-[var(--c-bg-subtle)] text-[var(--c-text-primary)] hover:border-[var(--c-border-strong)]",
        secondary:
          "bg-[var(--c-bg-elevated)] text-[var(--c-text-primary)] hover:bg-[var(--c-bg-hover)] border border-[var(--c-border-subtle)] shadow-sm",
        ghost: "hover:bg-[var(--c-bg-hover)] text-[var(--c-text-primary)]",
        link: "text-[var(--c-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[var(--r-sm)] px-3 text-xs",
        lg: "h-10 rounded-[var(--r-lg)] px-8 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const Comp = "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
