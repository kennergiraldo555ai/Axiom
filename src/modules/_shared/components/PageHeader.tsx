import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  metadata?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, breadcrumbs, actions, metadata, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-4 mb-8", className)} {...props}>
        {breadcrumbs && (
          <div className="text-sm text-[var(--c-text-tertiary)] flex items-center gap-2 font-medium">
            {breadcrumbs}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--c-text-primary)]">
              {title}
            </h1>
            {subtitle && <p className="text-base text-[var(--c-text-secondary)]">{subtitle}</p>}
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
