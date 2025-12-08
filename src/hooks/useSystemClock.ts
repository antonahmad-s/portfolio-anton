'use client';

import { useState, useEffect } from 'react';

/**
 * Returns the current time formatted as HH:mm:ss
 * Separating this logic makes the Navbar component pure and testable.
 */
export const useSystemClock = (): string => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };

    // Initial call
    updateTime();

    // Interval
    const timer = setInterval(updateTime, 1000);

    // Cleanup to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  return time;
};
