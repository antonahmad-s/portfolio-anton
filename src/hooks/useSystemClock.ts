'use client';

import { useState, useEffect } from 'react';

/**
 * System Clock Hook
 *
 * Returns formatted current time in Jakarta timezone
 * Updates every second with requestAnimationFrame for better performance
 *
 * @performance Uses RAF instead of setInterval for better accuracy
 * @param format - Time format: '12h' or '24h' (default: '24h')
 */
export function useSystemClock(format: '12h' | '24h' = '24h'): string {
  const [time, setTime] = useState<string>('--:--:--');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let rafId: number;
    let lastUpdate = 0;

    const updateClock = (timestamp: number) => {
      // Throttle updates to once per second
      if (timestamp - lastUpdate >= 1000) {
        const now = new Date();

        // Jakarta timezone (UTC+7)
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: format === '12h',
        };

        const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
        setTime(formatted);
        lastUpdate = timestamp;
      }

      rafId = requestAnimationFrame(updateClock);
    };

    rafId = requestAnimationFrame(updateClock);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [format]);

  // Prevent hydration mismatch
  if (!mounted) {
    return '--:--:--';
  }

  return time;
}
