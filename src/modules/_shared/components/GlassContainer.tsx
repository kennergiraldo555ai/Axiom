import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "light" | "medium" | "heavy";
}

export const GlassContainer = React.forwardRef<HTMLDivElement, GlassContainerProps>(
  ({ className, intensity = "medium", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden border border-[var(--c-border-subtle)]",
          intensity === "light" && "bg-white/5 backdrop-blur-sm",
          intensity === "medium" && "bg-[var(--c-bg-subtle)] backdrop-blur-md",
          intensity === "heavy" && "bg-[var(--c-bg-elevated)] backdrop-blur-lg",
          className,
        )}
        {...props}
      />
    );
  },
);
GlassContainer.displayName = "GlassContainer";
