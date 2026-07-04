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
        "flex flex-col sm:flex-row items-end sm:items-start gap-4 p-4 rounded-[var(--r-xl)] border border-[var(--c-border-subtle)] bg-[var(--c-bg-elevated)] shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </form>
  );
}
