import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server Components are the default — no extra config needed.
  // Runtime: nodejs by default (edge-compatible where possible per spec §4.3).
  experimental: {},
  // Enables typed routes for stronger route-level type safety.
  typedRoutes: true,
};

import { withSentryConfig } from "@sentry/nextjs";

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  tunnelRoute: "/monitoring",
});
