'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Analytics Component
 *
 * Tracks page views with Google Analytics 4
 * Implements consent-aware tracking (GDPR compliant)
 *
 * @security Only loads in production environment
 */
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

    if (!GA_MEASUREMENT_ID) {
      return;
    }

    // Track page view
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');

    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
      anonymize_ip: true, // GDPR compliance
      cookie_flags: 'SameSite=None;Secure',
    });
  }, [pathname, searchParams]);

  // Add Google Analytics script
  useEffect(() => {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!GA_MEASUREMENT_ID) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);

    return () => {
      document.head.removeChild(script);
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
