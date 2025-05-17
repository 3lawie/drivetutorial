/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
//import "./src/env.js";
//
///** @type {import("next").NextConfig} */
//const config = {
//    // added rules
//    eslint: {
//        ignoreDuringBuilds:true,
//    },
//    typescript: {
//        ignoreBuildErrors:true,
//    },
//};
//
//export default config;
//
// next.config.jsA
/** @type {import("next").NextConfig} */
const nextConfig = {
  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // PostHog rewrites
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;