'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';

// Components (with SSR enabled for SEO!)
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/layout/Preloader';
import SectionDivider from '@/components/ui/SectionDivider';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import About from '@/components/sections/About';
import Experience from '@/components/sections/experience';
import Skills from '@/components/sections/Skills';
import ProjectList from '@/components/sections/ProjectList';
import ContactFooter from '@/components/sections/ContactFooter';

/* ========================================
   MAIN HOME PAGE COMPONENT
   ======================================== */

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  /* ========================================
     SCROLL TO SECTION - WITH LENIS
     ======================================== */

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80; // account for fixed navbar

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
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
