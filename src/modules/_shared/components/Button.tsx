import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--r-md)] text-[13px] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-primary)] disabled:pointer-events-none disabled:opacity-50 ring-offset-2 ring-offset-[var(--c-bg-base)] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--c-primary),var(--c-accent))] text-white shadow-[0_12px_28px_-18px_rgb(99_102_241_/_0.9)] font-semibold hover:shadow-[0_16px_34px_-18px_rgb(168_85_247_/_0.9)]",
        destructive:
          "bg-[var(--c-accent)] text-white shadow-md shadow-[var(--c-accent-subtle)] font-semibold hover:bg-[var(--c-primary)]",
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
