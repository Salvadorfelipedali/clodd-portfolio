import type { NextConfig } from "next";

// Fonts are self-hosted via next/font — no Google Fonts CDN needed at runtime.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://kinescope.io https://*.kinescope.io",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: https: https://*.kinescopecdn.net",
  "media-src 'self' https://kinescope.io https://*.kinescope.io",
  "frame-src https://kinescope.io https://*.kinescope.io",
  "connect-src 'self' https://kinescope.io https://*.kinescope.io https://api.kinescope.io",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['192.168.31.165', '192.168.31.193'],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kinescope.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.kinescope.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.kinescope.io",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // CORS for all routes — allows mobile on local network to fetch assets
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, HEAD, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
          {
            key: "Content-Security-Policy",
            value: CSP,
          },
        ],
      },
      {
        // Cache fonts aggressively — they never change between deploys
        source: "/_next/static/media/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
