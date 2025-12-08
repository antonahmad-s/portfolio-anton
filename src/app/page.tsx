'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from 'next-themes';

// Components (with SSR enabled for SEO!)
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/layout/Preloader';
import SectionDivider from '@/components/ui/SectionDivider';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import ProjectList from '@/components/sections/ProjectList';
import ContactFooter from '@/components/sections/ContactFooter';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================
   MAIN HOME PAGE COMPONENT
   ======================================== */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const lenisRef = useRef<any>(null);
  const rafIdRef = useRef<number | null>(null);

  /* ========================================
     LENIS SMOOTH SCROLL - OPTIMIZED WITH CLEANUP
     ======================================== */

  useEffect(() => {
    // Only initialize after preloader completes
    if (loading || typeof window === 'undefined') return;

    let lenis: any = null;

    // Dynamic import to avoid SSR issues
    import('@studio-freight/lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical' as const,
          gestureOrientation: 'vertical' as const,
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 2,
          lerp: 0.05, // Smoother interpolation (reduced from 0.1)
          infinite: false,
        });

        lenisRef.current = lenis;

        // RAF Loop
        function raf(time: number) {
          lenis?.raf(time);
          rafIdRef.current = requestAnimationFrame(raf);
        }

        rafIdRef.current = requestAnimationFrame(raf);

        // Sync with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // GSAP ticker integration
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        // Initial ScrollTrigger refresh
        ScrollTrigger.refresh();
      })
      .catch((error) => {
        console.error('Failed to load Lenis:', error);
      });

    // 🔒 CRITICAL: Cleanup function prevents memory leaks
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }

      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Remove GSAP ticker
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
    };
  }, [loading]);

  /* ========================================
     SCROLL TO SECTION - WITH LENIS
     ======================================== */

  const scrollToSection = (sectionId: string) => {
    if (!lenisRef.current) return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    lenisRef.current.scrollTo(target, {
      offset: -80, // Account for fixed navbar
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  /* ========================================
     THEME TOGGLE - USING NEXT-THEMES
     ======================================== */

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /* ========================================
     RENDER
     ======================================== */

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-paper relative">
      {/* Noise Overlay - FIXED Z-INDEX */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-noise mix-blend-overlay"
        aria-hidden="true"
      />

      {/* Preloader */}
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          {/* Navigation */}
          <Navbar
            theme={(theme as 'light' | 'dark') || 'dark'}
            toggleTheme={toggleTheme}
            scrollToSection={scrollToSection}
          />

          {/* Main Content */}
          <main
            className="relative z-10 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]"
            role="main"
          >
            {/* Decorative Grid Lines */}
            <div
              className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 opacity-[0.06]"
              aria-hidden="true"
            >
              <div className="w-px h-full bg-ink dashed-line" />
              <div className="w-px h-full bg-ink hidden md:block dashed-line" />
              <div className="w-px h-full bg-ink hidden md:block dashed-line" />
              <div className="w-px h-full bg-ink dashed-line" />
            </div>

            {/* Sections */}
            <section id="hero" aria-label="Hero Section">
              <Hero />
            </section>
            <SectionDivider />

            <section id="stats" aria-label="Statistics Section">
              <Stats />
            </section>
            <SectionDivider />

            <section id="about" aria-label="About Section">
              <About />
            </section>
            <SectionDivider />

            <section id="experience" aria-label="Experience Section">
              <Experience />
            </section>
            <SectionDivider />

            <section id="skills" aria-label="Skills Section">
              <Skills />
            </section>
            <SectionDivider />

            <section id="portfolio" aria-label="Portfolio Section">
              <ProjectList />
            </section>
            <SectionDivider />

            {/* Contact Footer */}
            <ContactFooter />
          </main>
        </>
      )}
    </div>
  );
}
