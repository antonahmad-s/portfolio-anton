'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Navbar from '@/components/layout/Navbar';
import Preloader from '@/components/layout/Preloader';
import SectionDivider from '@/components/ui/SectionDivider';

// Lazy-loaded sections for better performance
const Hero = dynamic(() => import('@/components/sections/Hero'), {
  ssr: false,
});
const Stats = dynamic(() => import('@/components/sections/Stats'), {
  ssr: false,
});
const About = dynamic(() => import('@/components/sections/About'), {
  ssr: false,
});
const Experience = dynamic(() => import('@/components/sections/Experience'), {
  ssr: false,
});
const Skills = dynamic(() => import('@/components/sections/Skills'), {
  ssr: false,
});
const ProjectList = dynamic(() => import('@/components/sections/ProjectList'), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Default to dark for new design

  // Theme Toggle Handler - Fixed to handle both classes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Initialize Lenis Smooth Scroll (Further Optimized)
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      // Dynamic import of Lenis to avoid SSR issues
      import('@studio-freight/lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({
          duration: 1.2, // Smoother duration
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0, // Normal wheel speed
          touchMultiplier: 2,
          lerp: 0.1, // Lower lerp for smoother interpolation
        });

        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Integrate with ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Sync GSAP ticker with Lenis for smoother ScrollTrigger
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
          lenis.destroy();
        };
      });
    }
  }, [loading]);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-ink relative transition-colors duration-500">
      {/* Global Noise Grain */}
      <div className="fixed inset-0 z-[9999] pointer-events-none opacity-40 bg-noise mix-blend-overlay"></div>

      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="relative opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            {/* Global decorative grid lines */}
            <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 opacity-10">
              <div className="w-px h-full bg-ink dashed-line"></div>
              <div className="w-px h-full bg-ink hidden md:block dashed-line"></div>
              <div className="w-px h-full bg-ink hidden md:block dashed-line"></div>
              <div className="w-px h-full bg-ink dashed-line"></div>
            </div>

            <div id="hero">
              <Hero />
            </div>
            <SectionDivider />

            <div id="stats">
              <Stats />
            </div>
            <SectionDivider />

            <div id="about">
              <About />
            </div>
            <SectionDivider />

            <div id="experience">
              <Experience />
            </div>
            <SectionDivider />

            <div id="skills">
              <Skills />
            </div>
            <SectionDivider />

            <div id="portfolio">
              <ProjectList />
            </div>
            <SectionDivider />

            <footer
              id="contact"
              className="px-6 md:px-12 py-24 bg-paper relative z-10 border-t border-ink/10 transition-colors duration-500"
            >
              <div className="max-w-[100rem] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
                <div>
                  <div className="font-mono text-xs text-accent bg-ink px-2 py-1 inline-block mb-4">
                    KERNEL_INFO
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                    Jakarta State University
                  </h2>
                  <p className="font-mono text-gray-500">
                    Informatics Engineering
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4">
                  <a
                    href="mailto:email@example.com"
                    className="bg-ink text-paper px-8 py-4 font-mono font-bold hover:bg-accent hover:text-ink transition-colors text-lg"
                  >
                    INITIATE_COMMUNICATION()
                  </a>
                  <a
                    href="https://github.com/antonahmad-s"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink font-mono underline hover:text-accent decoration-2 underline-offset-4"
                  >
                    ACCESS_REPOSITORY -&gt;
                  </a>
                </div>
              </div>

              <div className="max-w-[100rem] mx-auto mt-24 flex justify-between font-mono text-[10px] uppercase text-gray-400">
                <p>ANTON AHMAD SUSILO © {new Date().getFullYear()}</p>
                <p>BLUEPRINT_VER_3.0</p>
              </div>
            </footer>
          </main>
        </>
      )}
    </div>
  );
}
