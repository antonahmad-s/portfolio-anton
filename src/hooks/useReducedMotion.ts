'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's motion preference
 *
 * Respects `prefers-reduced-motion` media query for accessibility.
 * Properly handles SSR/CSR hydration to prevent mismatches.
 *
 * @returns {boolean | null} null during SSR, boolean after hydration
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion();
 *
 * // Wait for hydration before animating
 * if (prefersReducedMotion === null) return null;
 *
 * // Disable animations if user prefers reduced motion
 * if (!prefersReducedMotion) {
 *   gsap.from(ref.current, { y: 100, duration: 1 });
 * }
 * ```
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
 */
export const useReducedMotion = (): boolean | null => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    // Check if browser supports matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      setPrefersReducedMotion(false);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Handler for media query changes
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value and subscribe to changes
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Alternative: Hook with default fallback for SSR
 *
 * Returns false during SSR (assumes motion enabled)
 * Better for components that must render during SSR
 *
 * @returns {boolean} Always returns boolean (false during SSR)
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotionWithFallback();
 *
 * // Can use immediately without null check
 * return (
 *   <div className={prefersReducedMotion ? '' : 'animate-fade-in'}>
 *     Content
 *   </div>
 * );
 * ```
 */
export const useReducedMotionWithFallback = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Advanced: Hook with custom media query support
 *
 * @param query - Custom media query string
 * @param defaultValue - Default value during SSR
 *
 * @returns {boolean | null} null during SSR, boolean after hydration
 *
 * @example
 * ```tsx
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)', false);
 * const isMobile = useMediaQuery('(max-width: 768px)', false);
 * const isHighContrast = useMediaQuery('(prefers-contrast: high)', false);
 *
 * if (isDarkMode === null) return null; // Wait for hydration
 * ```
 */
export const useMediaQuery = (
  query: string,
  defaultValue: boolean = false
): boolean | null => {
  const [matches, setMatches] = useState<boolean | null>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query, defaultValue]);

  return matches;
};

/**
 * Utility: Check if animations should be disabled globally
 *
 * Combines multiple conditions for comprehensive check
 *
 * @returns {boolean} True if animations should be disabled
 *
 * @example
 * ```tsx
 * if (shouldDisableAnimations()) {
 *   // Skip heavy animations, particles, etc.
 *   return <StaticComponent />;
 * }
 * ```
 */
export const shouldDisableAnimations = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Check low-end device (2 or fewer cores)
  const isLowEnd = navigator.hardwareConcurrency
    ? navigator.hardwareConcurrency <= 2
    : false;

  return prefersReduced || isLowEnd;
};
