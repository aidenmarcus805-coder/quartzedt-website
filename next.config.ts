import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const baseConfig: NextConfig = {
  /* config options here */
};

// IMPORTANT:
// Use a different dist dir in dev so running `next build` can’t clobber dev chunks (prevents 404s for /_next/static/*).
export default function nextConfig(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...baseConfig, distDir: '.next-dev' };
  }

  return baseConfig;
}
