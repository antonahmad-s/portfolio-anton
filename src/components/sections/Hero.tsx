'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import InspectorWrapper from '../ui/InspectorWrapper';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLHeadingElement>(null);
  const scanLineRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic Typography - Per-character animation
      if (nameRef.current) {
        const split = new SplitType(nameRef.current, { types: 'chars,words' });
        const chars = split.chars;

        if (chars) {
          gsap.from(chars, {
            y: 100,
            opacity: 0,
            rotateX: 15,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.02, // Per-character stagger for kinetic effect
            delay: 0.3,
          });

          // Parallax scroll effect on name
          gsap.to(nameRef.current, {
            y: 150,
            opacity: 0.4,
            scale: 0.95,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }
      }

      // Subtitle Reveal with glow
      gsap.from(subRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      });

      // Line Draw with accent glow
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.5,
        ease: 'expo.out',
        delay: 0.5,
      });

      // Scanline Animation linked to Scroll
      if (scanLineRef.current && containerRef.current) {
        gsap.to(scanLineRef.current, {
          attr: { y: '120%' },
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] flex flex-col justify-center px-6 md:px-12 pt-32 overflow-hidden"
    >
      {/* Background: Masked Flowchart with Scanline */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none select-none">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
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
                dy=".3em"
              >
                IT QUALITY
              </text>
              <text
                x="50%"
                y="65%"
                textAnchor="middle"
                className="text-[150px] md:text-[250px] font-black font-serif uppercase tracking-tighter"
                fill="white"
                dy=".3em"
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

          <g mask="url(#textMask)" className="text-ink">
            <rect
              width="100%"
              height="100%"
              fill="url(#gridPattern)"
              opacity="0.5"
            />
            <g stroke="currentColor" strokeWidth="2" fill="none">
              <rect x="300" y="200" width="300" height="150" />
              <path d="M450 350 L450 500" />
              <polygon points="450,500 400,550 500,550 450,600" />
              <rect x="800" y="550" width="300" height="150" />
              <path d="M600 550 L800 550" strokeDasharray="10,5" />
              <circle cx="1200" cy="400" r="100" />
              <path d="M600 275 L1100 400" strokeDasharray="5,5" />
              <rect x="1400" y="300" width="200" height="400" />
              <path d="M1200 400 L1400 400" />
            </g>
          </g>
        </svg>
      </div>

      {/* Main Content */}
      <div className="max-w-400 w-full mx-auto relative z-10">
        <div className="absolute -top-16 left-0 font-mono text-[10px] text-ink/60 tracking-widest">
          REF: AAS-2024-V2 // QUALITY_ARCHITECT
        </div>

        <div className="flex flex-col items-start justify-center">
          <InspectorWrapper label="H1_TITLE" id="hero-name">
            <h1
              ref={nameRef}
              className="text-[12vw] leading-[0.85] font-serif font-normal uppercase tracking-tighter text-ink mix-blend-multiply"
            >
              ANTON
              <br />
              <span className="italic">AHMAD</span>
              <br />
              SUSILO
            </h1>
          </InspectorWrapper>
        </div>

        <div ref={lineRef} className="w-full h-[2px] bg-ink mt-8 mb-8 relative">
          <div className="absolute right-0 top-[-10px] font-mono text-xs bg-accent px-2 py-1 text-ink font-bold">
            EST. 2020
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="md:w-1/2">
            <InspectorWrapper label="SUB_HEAD" className="inline-block">
              <h2
                ref={subRef}
                className="text-xl md:text-2xl font-mono text-ink/70 leading-relaxed mt-4 max-w-lg"
              >
                Architecting Reliability for Financial &amp; IT Systems.
              </h2>
            </InspectorWrapper>
          </div>

          <div className="md:w-1/2 flex justify-start md:justify-end mt-8 md:mt-0">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="font-mono text-xs font-bold tracking-widest">
                SYSTEM STATUS: OPTIMAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
