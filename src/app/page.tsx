import { redirect } from "next/navigation";

/**
 * Root page — redirects to the app dashboard.
 * Auth guard will redirect to /login if unauthenticated (implemented in Sprint 0.2).
 */
export default function RootPage() {
  redirect("/dashboard");
}
