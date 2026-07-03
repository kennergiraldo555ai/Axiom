"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // AXIOM spec requires dark mode as the default and light mode as a non-goal for MVP.
  // We force dark mode to ensure the UI stays consistent with the spec.
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      {children}
    </NextThemesProvider>
  );
}
