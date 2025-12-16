'use client';

import React, { useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import InspectorWrapper from '../ui/InspectorWrapper';

// Lazy load 3D scene for performance
const Scene3D = lazy(() => import('../three/Scene3D'));

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================
   HERO SECTION COMPONENT
   ======================================== */

const Hero: React.FC = () => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLHeadingElement>(null);

  // Animation refs for cleanup
  const splitInstanceRef = useRef<SplitType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  /* ========================================
     ANIMATION SETUP - WITH PROPER CLEANUP
     ======================================== */

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Main timeline
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
      });
      timelineRef.current = tl;

      /* ========================================
         KINETIC TYPOGRAPHY - OPTIMIZED
         ======================================== */

      if (nameRef.current) {
        // Create SplitType instance
        const split = new SplitType(nameRef.current, {
          types: 'chars',
          tagName: 'span',
        });
        splitInstanceRef.current = split;

        const chars = split.chars;

        if (chars && chars.length > 0) {
          // Initial state
          gsap.set(chars, {
            opacity: 0,
            y: 100,
            rotationX: -15,
            transformOrigin: '50% 50%',
          });

          // Staggered entrance
          tl.to(
            chars,
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1.2,
              stagger: {
                amount: 0.6,
                from: 'start',
              },
              ease: 'expo.out',
            },
            0.3
          );

          // Parallax scroll effect - GPU-ACCELERATED
          const parallaxTrigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
            onUpdate: (self) => {
              const progress = self.progress;

              // Use transform3d for GPU acceleration
              gsap.set(nameRef.current, {
                y: progress * 150,
                opacity: 1 - progress * 0.6,
                scale: 1 - progress * 0.05,
                force3D: true,
              });
            },
          });

          scrollTriggersRef.current.push(parallaxTrigger);
        }
      }

      /* ========================================
         SUBTITLE REVEAL
         ======================================== */

      if (subRef.current) {
        tl.from(
          subRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          },
          0.8
        );
      }

      /* ========================================
         LINE DRAW ANIMATION
         ======================================== */

      if (lineRef.current) {
        tl.from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.5,
            ease: 'expo.out',
          },
          0.5
        );
      }
    }, containerRef);

    /* ========================================
       🔒 CRITICAL: CLEANUP FUNCTION
       ======================================== */

    return () => {
      // Revert SplitType (removes all generated DOM nodes)
      if (splitInstanceRef.current) {
        splitInstanceRef.current.revert();
        splitInstanceRef.current = null;
      }

      // Kill timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      // Kill all ScrollTriggers
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];

      // Revert GSAP context
      ctx.revert();
    };
  }, []);

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[95vh] flex flex-col justify-center px-6 md:px-12 pt-32 overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* 3D Background - CYBER TERRAIN */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none"
        aria-hidden="true"
      >
        <Suspense fallback={<div className="w-full h-full bg-paper" />}>
          <Scene3D className="w-full h-full" />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto relative z-10">
        {/* Reference Label */}
        <div
          className="absolute -top-16 left-0 font-mono text-[10px] text-muted tracking-widest uppercase"
          aria-hidden="true"
        >
          QUALITY_ARCHITECT
        </div>

        {/* Hero Title - MIX BLEND MODE for contrast */}
        <div className="flex flex-col items-start justify-center">
          <InspectorWrapper label="H1_TITLE" id="hero-name">
            <h1
              ref={nameRef}
              id="hero-title"
              className="text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] font-serif font-normal uppercase tracking-tighter text-ink text-shadow-subtle mix-blend-difference"
              style={{ willChange: 'transform' }}
            >
              ANTON
              <br />
              <span className="italic font-light">AHMAD</span>
              <br />
              SUSILO
            </h1>
          </InspectorWrapper>
        </div>

        {/* Divider Line */}
        <div
          ref={lineRef}
          className="w-full h-0.5 bg-ink mt-8 mb-8 relative"
          role="separator"
          aria-hidden="true"
        >
          <div className="absolute right-0 -top-2.5 font-mono text-xs bg-accent px-2 py-1 text-ink font-bold">
            EST. 2020
          </div>
        </div>

        {/* Subtitle Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* Subtitle */}
          <div className="md:w-1/2">
            <InspectorWrapper label="SUB_HEAD" className="inline-block">
              <h2
                ref={subRef}
                className="text-xl md:text-2xl font-mono text-muted leading-relaxed mt-4 max-w-lg"
              >
                Architecting Reliability for IT Systems.
              </h2>
            </InspectorWrapper>
          </div>

          {/* Status Indicator */}
          <div className="md:w-1/2 flex justify-start md:justify-end mt-8 md:mt-0">
            <div
              className="flex items-center gap-4 glass-panel-sm px-4 py-3"
              role="status"
              aria-live="polite"
            >
              <div
                className="w-3 h-3 bg-success rounded-full animate-pulse"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                SYSTEM STATUS: OPTIMAL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible alternative for background */}
      <div className="sr-only">
        Background decoration: 3D cyber terrain visualization with grid and
        glitch effects
      </div>
    </section>
  );
};

export default Hero;
