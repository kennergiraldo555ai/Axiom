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
        className="fixed inset-0 z-50 bg-[var(--c-bg-base)]/80 backdrop-blur-md animate-in fade-in-0 duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-4 right-4 z-50 flex flex-col bg-[var(--c-bg-elevated)]/90 backdrop-blur-3xl border border-[var(--c-border-strong)] rounded-[var(--r-2xl)] shadow-glow animate-in slide-in-from-right-full duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden",
          widthClass,
          className,
        )}
        style={{ width: "calc(100vw - 2rem)" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Glow accent bar at the top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--c-accent)] to-transparent opacity-50" />
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
        "flex flex-col space-y-2 p-8 border-b border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] shrink-0 shadow-tactile relative z-10",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="text-xl font-bold text-[var(--c-text-primary)] drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
            {title}
          </h2>
        )}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0 rounded-full text-[var(--c-text-tertiary)] hover:text-[var(--c-accent)] hover:bg-[var(--c-accent)]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
            aria-label="Cerrar panel"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {description && (
        <div className="text-sm font-medium text-[var(--c-accent)] opacity-80">{description}</div>
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
        "flex items-center justify-end p-6 border-t border-[var(--c-border-strong)] bg-[var(--c-bg-elevated)] shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
