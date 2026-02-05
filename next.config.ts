import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'certcheck.worldathletics.org',
        pathname: '/OpenDocument/**',
      },
    ],
  },
};

export default nextConfig;
