/**
 * App topbar — search trigger, notifications bell, user menu.
 * Command palette (cmd+k) will be wired in a future sprint.
 * Spec §6.2.
 */
export function Topbar() {
  return (
    <header
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--s-5)",
        backgroundColor: "var(--c-bg-elevated)",
        borderBottom: "1px solid var(--c-border-subtle)",
        flexShrink: 0,
      }}
    >
      {/* Left — command palette trigger */}
      <button
        id="topbar-command-palette-trigger"
        aria-label="Open command palette (⌘K)"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--s-2)",
          padding: "var(--s-2) var(--s-3)",
          backgroundColor: "var(--c-bg-subtle)",
          border: "1px solid var(--c-border-subtle)",
          borderRadius: "var(--r-md)",
          color: "var(--c-text-tertiary)",
          fontSize: "var(--text-sm)",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          minWidth: "200px",
        }}
      >
        <span>Search…</span>
        <kbd
          style={{
            marginLeft: "auto",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-mono)",
            padding: "1px 4px",
            backgroundColor: "var(--c-bg-hover)",
            borderRadius: "var(--r-sm)",
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Right — notifications + user */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--s-3)" }}>
        {/* Notifications bell — placeholder */}
        <button
          id="topbar-notifications-bell"
          aria-label="Notifications"
          style={{
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "var(--r-md)",
            border: "none",
            backgroundColor: "transparent",
            color: "var(--c-text-secondary)",
            cursor: "pointer",
            fontSize: "var(--text-base)",
          }}
        >
          🔔
        </button>

        {/* User avatar — placeholder */}
        <button
          id="topbar-user-menu"
          aria-label="User menu"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "var(--c-accent-subtle)",
            border: "1px solid var(--c-accent-border)",
            color: "var(--c-accent)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          A
        </button>
      </div>
    </header>
  );
}
