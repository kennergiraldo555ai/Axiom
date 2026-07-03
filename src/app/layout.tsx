import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/lib/providers/app-providers";

export const metadata: Metadata = {
  title: {
    default: "AXIOM",
    template: "%s | AXIOM",
  },
  description:
    "AXIOM — Your personal and business operating system. Find prospects, analyze opportunities, and grow your business.",
  robots: {
    index: false, // Private app — do not index
    follow: false,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
