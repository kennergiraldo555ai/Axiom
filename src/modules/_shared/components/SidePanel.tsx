"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./Button";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  width?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function SidePanel({ isOpen, onClose, children, className, width = "md" }: SidePanelProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const widthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl",
  }[width];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md animate-in fade-in-0 transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-[var(--c-bg-elevated)] border-l border-[var(--c-border-subtle)] shadow-[var(--shadow-lg)] animate-in slide-in-from-right-full duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          widthClass,
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}

export function SidePanelHeader({
  className,
  title,
  description,
  onClose,
  children,
}: {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 p-8 border-b border-[var(--c-border-subtle)] bg-[var(--c-bg-base)] shrink-0",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {title && <h2 className="text-xl font-semibold text-[var(--c-text-primary)]">{title}</h2>}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0 rounded-full text-[var(--c-text-tertiary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-bg-subtle)]"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {description && <div className="text-sm text-[var(--c-text-secondary)]">{description}</div>}
      {children}
    </div>
  );
}

export function SidePanelBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>;
}

export function SidePanelFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end p-6 border-t border-[var(--c-border-subtle)] bg-[var(--c-bg-base)] shrink-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
