'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Theme Provider Component
 *
 * Prevents FOUC and manages theme persistence
 * Uses next-themes for automatic system preference detection
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="dark" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by waiting for client-side mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder during SSR to prevent FOUC
    return (
      <div className="bg-paper text-ink" suppressHydrationWarning>
        {children}
      </div>
    );
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
