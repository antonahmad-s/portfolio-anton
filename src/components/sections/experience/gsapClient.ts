'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Safe to call multiple times; GSAP docs say it doesn't hurt.
export function ensureGsapPluginsRegistered() {
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
