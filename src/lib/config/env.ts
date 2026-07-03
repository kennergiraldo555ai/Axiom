/**
 * Environment variable loader with Zod validation.
 * Spec §3, §9.3 rule 19: no secrets in client bundles.
 *
 * Every env var used in the app must be declared here.
 * Missing required vars cause a startup crash with a clear error message.
 *
 * Usage:
 *   import { env } from "@/lib/config/env";
 *   env.DATABASE_URL // fully typed
 */
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // ─── Supabase ────────────────────────────────────────────────────
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid PostgreSQL URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // ─── App ─────────────────────────────────────────────────────────
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 chars").optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Validates env vars at module load time.
 * Throws with a descriptive error if any required var is missing.
 */
function createEnv() {
  // Client vars are available everywhere
  const clientResult = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"],
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  });

  if (!clientResult.success) {
    console.error("❌ Invalid client environment variables:");
    console.error(clientResult.error.flatten().fieldErrors);
    // In dev, warn. In production, throw.
    if (process.env["NODE_ENV"] === "production") {
      throw new Error("Invalid client environment configuration. Check logs.");
    }
  }

  // Server vars — only validate on the server
  if (typeof window === "undefined") {
    const serverResult = serverEnvSchema.safeParse(process.env);
    if (!serverResult.success) {
      console.error("❌ Invalid server environment variables:");
      console.error(serverResult.error.flatten().fieldErrors);
      if (process.env["NODE_ENV"] === "production") {
        throw new Error("Invalid server environment configuration. Check logs.");
      }
    }
  }

  return {
    // Server-only (never expose to client)
    DATABASE_URL: process.env["DATABASE_URL"] ?? "",
    DIRECT_URL: process.env["DIRECT_URL"] ?? "",
    SUPABASE_SERVICE_ROLE_KEY: process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "",
    NODE_ENV: (process.env["NODE_ENV"] ?? "development") as "development" | "test" | "production",

    // Public (safe for client)
    NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"] ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ?? "",
    NEXT_PUBLIC_APP_URL: process.env["NEXT_PUBLIC_APP_URL"],
  };
}

export const env = createEnv();
