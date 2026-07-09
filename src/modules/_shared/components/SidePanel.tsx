"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
        className="fixed inset-0 z-50 bg-[var(--c-bg-base)]/80 backdrop-blur-xl animate-in fade-in-0 duration-500"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-4 right-4 z-50 flex flex-col overflow-hidden rounded-[var(--r-2xl)] border border-[var(--c-border-strong)] bg-[var(--c-bg-base)] shadow-[0_24px_80px_-24px_rgba(11,13,18,1)] backdrop-blur-3xl animate-in slide-in-from-right-full duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          widthClass,
          className,
        )}
        style={{ width: "calc(100vw - 2rem)" }}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}

interface SidePanelHeaderProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function SidePanelHeader({
  className,
  title,
  description,
  onClose,
  children,
}: SidePanelHeaderProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex shrink-0 flex-col space-y-2 bg-[var(--c-bg-base)]/80 backdrop-blur-xl px-10 pt-10 pb-6",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-[22px] font-black text-[var(--c-text-primary)] tracking-tight">
            {title}
          </h2>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--c-border-strong)] bg-[var(--c-bg-glass)] text-[var(--c-text-tertiary)] shadow-tactile transition-all hover:border-[var(--c-text-primary)] hover:text-[var(--c-text-primary)] hover:scale-105"
            aria-label="Cerrar panel"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
      {description && (
        <div className="text-[14px] font-medium text-[var(--c-text-secondary)]">{description}</div>
      )}
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
  return <div className={cn("flex-1 overflow-y-auto custom-scrollbar", className)}>{children}</div>;
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
        "flex shrink-0 items-center justify-end border-t border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] p-8 shadow-[0_-12px_34px_-24px_rgb(11_13_18_/_0.85)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
