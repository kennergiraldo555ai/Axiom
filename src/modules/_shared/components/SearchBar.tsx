import * as React from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps extends React.HTMLAttributes<HTMLFormElement> {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export function SearchBar({ children, className, onSubmit, ...props }: SearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex flex-col sm:flex-row items-end sm:items-start gap-4 p-4 rounded-[var(--r-2xl)] border border-[var(--c-border-subtle)] bg-[var(--c-bg-subtle)] backdrop-blur-md shadow-premium transition-all duration-300 focus-within:shadow-glow focus-within:border-[var(--c-accent-border)]",
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
}
