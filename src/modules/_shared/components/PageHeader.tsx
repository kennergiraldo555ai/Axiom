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
        className={cn("relative z-10 mb-16 flex flex-col gap-8", className)}
        {...props}
      >
        {breadcrumbs && (
          <div className="text-[12px] text-[var(--c-text-tertiary)] flex items-center gap-3 font-bold tracking-[0.2em] uppercase">
            {breadcrumbs}
          </div>
        )}
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="flex max-w-4xl flex-col gap-5">
            <div className="flex items-center gap-5">
              {icon && (
                <div className="text-[var(--c-accent)] drop-shadow-[0_0_24px_rgb(168_85_247_/_0.65)] scale-110">
                  {icon}
                </div>
              )}
              <h1 className="text-5xl font-black tracking-tight text-[var(--c-text-primary)] md:text-[56px] drop-shadow-[0_0_15px_rgb(230_232_238_/_0.15)] leading-none">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="max-w-2xl text-[16px] font-medium leading-relaxed text-[var(--c-text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-4">
            {metadata}
            {actions}
          </div>
        </div>
      </div>
    );
  },
);
PageHeader.displayName = "PageHeader";
