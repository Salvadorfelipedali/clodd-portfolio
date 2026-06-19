import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  devIndicators: false,
  allowedDevOrigins: ['192.168.31.165', '192.168.31.193'],

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
