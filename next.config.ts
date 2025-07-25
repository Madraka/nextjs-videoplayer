import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
  },
  images: {
    domains: ['via.placeholder.com'],
  },
  // Vercel deployment optimization
  poweredByHeader: false,
  compress: true,
  eslint: {
    // Allow production builds to complete even if there are ESLint warnings
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
