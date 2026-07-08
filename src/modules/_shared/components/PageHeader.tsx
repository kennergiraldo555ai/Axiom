import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string | React.ReactNode;
  icon?: React.ReactNode;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  metadata?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, icon, subtitle, breadcrumbs, actions, metadata, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-6 mb-12 relative z-10", className)}
        {...props}
      >
        {breadcrumbs && (
          <div className="text-[11px] text-[var(--c-text-tertiary)] flex items-center gap-2 font-bold tracking-widest uppercase">
            {breadcrumbs}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="text-[var(--c-accent)] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]">
                  {icon}
                </div>
              )}
              <h1 className="text-4xl font-black tracking-tight text-[var(--c-text-primary)] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-[15px] font-medium leading-relaxed text-[var(--c-text-secondary)] max-w-3xl">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {metadata}
            {actions}
          </div>
        </div>
      </div>
    );
  },
);
PageHeader.displayName = "PageHeader";
