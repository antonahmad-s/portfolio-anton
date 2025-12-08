'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import InspectorWrapper from '../ui/InspectorWrapper';

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
  const scanLineRef = useRef<SVGRectElement>(null);
  const bgSvgRef = useRef<SVGSVGElement>(null);

  // Animation refs for cleanup
  const splitInstanceRef = useRef<SplitType | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // State for SSR safety
  const [mounted, setMounted] = useState(false);

  // Prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ========================================
     ANIMATION SETUP - WITH PROPER CLEANUP
     ======================================== */

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

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

      /* ========================================
         SCANLINE ANIMATION - OPTIMIZED
         ======================================== */

      if (scanLineRef.current && containerRef.current) {
        const scanTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (scanLineRef.current) {
              const yPos = -20 + self.progress * 140;
              scanLineRef.current.setAttribute('y', `${yPos}%`);
            }
          },
        });

        scrollTriggersRef.current.push(scanTrigger);
      }

      /* ========================================
         BACKGROUND SVG FADE ON SCROLL
         ======================================== */

      if (bgSvgRef.current) {
        const bgTrigger = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            if (bgSvgRef.current) {
              gsap.set(bgSvgRef.current, {
                opacity: 0.3 - self.progress * 0.3,
              });
            }
          },
        });

        scrollTriggersRef.current.push(bgTrigger);
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
  }, [mounted]);

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
      {/* Background SVG - OPTIMIZED */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none select-none will-change-opacity"
        aria-hidden="true"
      >
        <svg
          ref={bgSvgRef}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
          role="presentation"
        >
          <defs>
            <mask id="textMask">
              <rect width="100%" height="100%" fill="black" />
              <text
                x="50%"
                y="40%"
                textAnchor="middle"
                className="text-[150px] md:text-[250px] font-black font-serif uppercase tracking-tighter"
                fill="white"
                dominantBaseline="middle"
              >
                IT QUALITY
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                className="text-[150px] md:text-[250px] font-black font-serif uppercase tracking-tighter"
                fill="white"
                dominantBaseline="middle"
              >
                ASSURANCE
              </text>
              <rect
                ref={scanLineRef}
                x="0"
                y="-20%"
                width="100%"
                height="15%"
                fill="white"
                opacity="0.8"
              />
            </mask>

            {/* Grid Pattern - SIMPLIFIED */}
            <pattern
              id="gridPattern"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Masked Content */}
          <g mask="url(#textMask)" className="text-ink">
            <rect
              width="100%"
              height="100%"
              fill="url(#gridPattern)"
              opacity="0.5"
            />

            {/* Flowchart Elements - REDUCED COMPLEXITY */}
            <g stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="300" y="200" width="300" height="150" rx="4" />
              <path d="M450 350 L450 500" markerEnd="url(#arrow)" />
              <polygon points="450,500 400,550 500,550" />
              <rect x="800" y="550" width="300" height="150" rx="4" />
              <path d="M600 550 L800 550" strokeDasharray="10,5" />
              <circle cx="1200" cy="400" r="100" />
              <path d="M600 275 L1100 400" strokeDasharray="5,5" />
              <rect x="1400" y="300" width="200" height="400" rx="4" />
              <path d="M1200 400 L1400 400" />
            </g>
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl w-full mx-auto relative z-10">
        {/* Reference Label */}
        <div
          className="absolute -top-16 left-0 font-mono text-[10px] text-muted tracking-widest uppercase"
          aria-hidden="true"
        >
          REF: AAS-2024-V2 // QUALITY_ARCHITECT
        </div>

        {/* Hero Title */}
        <div className="flex flex-col items-start justify-center">
          <InspectorWrapper label="H1_TITLE" id="hero-name">
            <h1
              ref={nameRef}
              id="hero-title"
              className="text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.85] font-serif font-normal uppercase tracking-tighter text-ink"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
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
                Architecting Reliability for Financial &amp; IT Systems.
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

      {/* Accessible alternative for background text */}
      <div className="sr-only">
        Background decoration text: IT Quality Assurance
      </div>
    </section>
  );
};

export default Hero;
