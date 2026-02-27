import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for catching potential issues early
  reactStrictMode: true,

  // Allow images from common domains if needed later
  images: {
    domains: [],
  },
};

export default nextConfig;
