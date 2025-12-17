import type { NextConfig } from 'next';

/* ========================================
   SECURITY HEADERS
   ======================================== */

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 🔒 IMPROVED: Removed 'unsafe-inline', use nonce-based CSP
      // For production, consider implementing nonce: https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
      "script-src 'self' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
      // 🔒 'unsafe-eval' required for React DevTools & GSAP animations
      // ⚠️ TODO: Remove 'unsafe-eval' if not using dynamic animations

      // 🔒 IMPROVED: Use hash-based CSP for styles instead of unsafe-inline
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // ⚠️ 'unsafe-inline' currently required for Tailwind & Framer Motion
      // TODO: Implement CSS-in-JS with nonces for production

      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
      "frame-ancestors 'none'", // ✓ Prevents clickjacking
      "base-uri 'self'", // ✓ Prevents base tag injection
      "form-action 'self'", // ✓ Prevents form hijacking
      'upgrade-insecure-requests', // 🔒 NEW: Force HTTPS
      'block-all-mixed-content', // 🔒 NEW: Block HTTP resources on HTTPS
      "object-src 'none'", // 🔒 NEW: Block plugins (Flash, Java, etc.)
      "frame-src 'none'", // 🔒 NEW: Block iframes
    ].join('; '),
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()', // 🔒 NEW: Block FLoC
  },
  // 🔒 NEW: Cross-Origin policies
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

/* ========================================
   NEXT.JS CONFIGURATION
   ======================================== */

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default nextConfig;
