import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
