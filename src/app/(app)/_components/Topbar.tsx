import { Search, Bell } from "lucide-react";

/**
 * App topbar — search trigger, notifications bell, user menu.
 * Command palette (cmd+k) will be wired in a future sprint.
 * Spec §6.2.
 */
export function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between px-8 bg-[var(--c-bg-base)] border-b border-[var(--c-border-subtle)] shrink-0 sticky top-0 z-40">
      {/* Left — command palette trigger */}
      <button
        id="topbar-command-palette-trigger"
        aria-label="Open command palette (⌘K)"
        className="flex items-center gap-3 px-3 py-1.5 bg-[var(--c-bg-elevated)] border border-[var(--c-border-subtle)] rounded-[var(--r-md)] text-[var(--c-text-tertiary)] text-sm cursor-text hover:border-[var(--c-border-default)] transition-all min-w-[280px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] group shadow-sm"
      >
        <Search className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="font-medium text-xs tracking-wide">Search or jump to...</span>
        <div className="ml-auto flex items-center gap-1">
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[var(--c-bg-hover)] border border-[var(--c-border-subtle)] rounded shadow-sm opacity-70">
            ⌘
          </kbd>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-[var(--c-bg-hover)] border border-[var(--c-border-subtle)] rounded shadow-sm opacity-70">
            K
          </kbd>
        </div>
      </button>

      {/* Right — notifications + user */}
      <div className="flex items-center gap-4">
        {/* Notifications bell */}
        <button
          id="topbar-notifications-bell"
          aria-label="Notifications"
          className="w-8 h-8 flex items-center justify-center rounded-[var(--r-md)] text-[var(--c-text-secondary)] hover:text-[var(--c-text-primary)] hover:bg-[var(--c-bg-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar */}
        <button
          id="topbar-user-menu"
          aria-label="User menu"
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--c-accent)] to-[#a855f7] p-[1px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-bg-base)] shadow-md"
        >
          <div className="w-full h-full rounded-full bg-[var(--c-bg-elevated)] flex items-center justify-center">
            <span className="text-[var(--c-text-primary)] text-xs font-bold">K</span>
          </div>
        </button>
      </div>
    </header>
  );
}
