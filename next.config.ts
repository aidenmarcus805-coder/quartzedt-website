import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const baseConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/owner/:path*',
        destination: '/dashboard/owner/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/desktop/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

// IMPORTANT:
// Use a different dist dir in dev so running `next build` can’t clobber dev chunks (prevents 404s for /_next/static/*).
export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...baseConfig, distDir: '.next-dev' };
  }

  return baseConfig;
}
