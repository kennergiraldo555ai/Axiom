"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary — catches unhandled errors in the app shell.
 * console.error is intentionally allowed here per spec §9.2 rule 6.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log to observability layer — will be wired to Sentry in Phase 6
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#0a0a0b",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "16px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ color: "#a1a1aa", maxWidth: "480px" }}>
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <code
            style={{
              fontSize: "0.75rem",
              color: "#71717a",
              fontFamily: "monospace",
            }}
          >
            Error ID: {error.digest}
          </code>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            padding: "8px 16px",
            backgroundColor: "#4ade80",
            color: "#0a0a0b",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
