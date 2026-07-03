import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server Components are the default — no extra config needed.
  // Runtime: nodejs by default (edge-compatible where possible per spec §4.3).
  experimental: {
    // Enables typed routes for stronger route-level type safety.
    typedRoutes: true,
  },
};

export default nextConfig;
