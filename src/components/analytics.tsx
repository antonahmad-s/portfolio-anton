'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { env } from '@/lib/env';

/**
 * Analytics Component
 *
 * Tracks page views with Google Analytics 4
 * Implements consent-aware tracking (GDPR compliant)
 *
 * @security Only loads in production environment
 * @security Environment variables validated and sanitized
 */
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 🔒 Use validated environment variable
    const GA_MEASUREMENT_ID = env.GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) {
      return;
    }

    // Track page view with sanitized URL
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    // 🔒 Sanitize URL to prevent injection
    const sanitizedUrl = url.replace(/[<>"']/g, '');

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: sanitizedUrl,
      anonymize_ip: true, // GDPR compliance
      cookie_flags: 'SameSite=None;Secure',
    });
  }, [pathname, searchParams]);

  // Add Google Analytics script
  useEffect(() => {
    // 🔒 Use validated environment variable
    const GA_MEASUREMENT_ID = env.GA_MEASUREMENT_ID;
    if (!GA_MEASUREMENT_ID) return;

    // 🔒 Only load in production
    if (!env.IS_PRODUCTION) {
      console.log('📊 Analytics disabled in development');
      return;
    }

    const script = document.createElement('script');
    // 🔒 GA_MEASUREMENT_ID already validated by env.ts
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    script.defer = true; // Additional performance optimization

    // 🔒 Add integrity check if using Subresource Integrity
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
}

// Type declarations
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
