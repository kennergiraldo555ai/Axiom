"use client";

import { useState } from "react";
import { createClient } from "@/lib/auth/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      if (error) throw error;
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--c-text-primary)]">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 bg-[var(--c-bg-subtle)] border border-[var(--c-border-default)] rounded-md text-[var(--c-text-primary)] focus:outline-none focus:border-[var(--c-accent)] transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full py-2 px-4 bg-[var(--c-accent)] hover:bg-[var(--c-accent-hover)] text-black font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? "Sending..."
          : status === "success"
            ? "Check your email"
            : "Send Magic Link"}
      </button>

      {status === "error" && (
        <p className="text-sm text-[var(--c-danger)] mt-2 text-center">
          An error occurred. Please try again.
        </p>
      )}
    </form>
  );
}
