import * as React from "react";
import { cn } from "@/lib/utils";

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full flex-col", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-start border-b border-[var(--c-border-subtle)] bg-transparent w-full overflow-x-auto hide-scrollbar",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; active?: boolean }
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 text-[13px] font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      active
        ? "border-b-2 border-[var(--c-accent)] text-[var(--c-text-primary)]"
        : "border-b-2 border-transparent text-[var(--c-text-tertiary)] hover:text-[var(--c-text-secondary)] hover:border-[var(--c-border-strong)]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; active?: boolean }
>(({ className, active, ...props }, ref) => {
  if (!active) return null;
  return (
    <div
      ref={ref}
      className={cn("mt-4 focus-visible:outline-none animate-in fade-in-50 duration-300", className)}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
