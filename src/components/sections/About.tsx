'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.module-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        },
      });

      gsap.from('.divider-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 1.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 md:px-12 bg-paper relative z-10 overflow-hidden"
    >
      <div className="max-w-[100rem] mx-auto">
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row items-baseline justify-between border-b border-ink pb-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight">
            System Identity
          </h2>
          <div className="font-mono text-sm mt-2 md:mt-0">
            <span className="bg-ink text-paper px-2 py-1">
              KERNEL_VERSION: 3.0
            </span>
            <span className="ml-4 text-gray-500">HYBRID_ARCHITECT</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Vertical Dividers */}
          <div className="divider-line absolute left-1/3 top-0 bottom-0 w-[1px] bg-ink hidden md:block -translate-x-1/2 opacity-20"></div>
          <div className="divider-line absolute left-2/3 top-0 bottom-0 w-[1px] bg-ink hidden md:block -translate-x-1/2 opacity-20"></div>

          {/* Column 1: Photo */}
          <div className="module-card flex flex-col">
            <div className="font-mono text-xs text-ink border border-ink inline-block px-2 py-1 mb-6 w-max">
              PERSONNEL_ID
            </div>

            <div className="flex-grow bg-gray-200 relative overflow-hidden min-h-[400px] border border-ink group">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                alt="Anton Ahmad Susilo"
                fill
                className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Corner Markers */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink"></div>

              {/* ID Badge */}
              <div className="absolute bottom-6 left-6 bg-paper px-3 py-2 border border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-bold font-serif text-lg leading-none">
                  ANTON A. SUSILO
                </div>
                <div className="font-mono text-[10px] text-gray-500 mt-1">
                  ID: QA-ARCH-001
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: QA Core */}
          <div className="module-card">
            <div className="font-mono text-xs text-accent bg-ink inline-block px-2 py-1 mb-6">
              01 // CORE_FOUNDATION
            </div>
            <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-6">
              The Guardian of Stability.
            </h3>
            <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-8">
              My foundation is built on the rigorous principles of Quality
              Assurance. For over 4 years, I have architected test strategies
              that ensure financial systems don&apos;t just
              &quot;work&quot;—they persist.
            </p>
            <ul className="font-mono text-xs space-y-3 text-gray-500 border-t border-ink/10 pt-4">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent"></div>Risk Mitigation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent"></div>Pixel-Perfect
                Validation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent"></div>User-Centric Empathy
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent"></div>Process Optimization
              </li>
            </ul>
          </div>

          {/* Column 3: AI Dev Evolution */}
          <div className="module-card">
            <div className="font-mono text-xs text-ink border border-ink inline-block px-2 py-1 mb-6">
              02 // NEW_EXPANSION
            </div>
            <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-6 italic">
              Compiling the Future.
            </h3>
            <p className="font-mono text-sm md:text-base text-gray-600 leading-relaxed mb-8">
              Beyond validating code, I am now writing it. I am expanding my
              kernel to become an{' '}
              <span className="font-bold text-ink bg-accent/20 px-1">
                AI Web Developer
              </span>
              .
            </p>

            <div className="border border-ink/20 p-5 bg-white/50 relative">
              <div className="absolute -top-3 left-4 bg-paper px-2 font-mono text-[10px] text-gray-400">
                STACK_EXPLORATION
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-ink text-paper font-mono text-xs font-bold">
                  Next.js 15
                </span>
                <span className="px-3 py-1 border border-ink text-ink font-mono text-xs font-bold hover:bg-accent transition-colors">
                  React
                </span>
                <span className="px-3 py-1 border border-ink text-ink font-mono text-xs font-bold hover:bg-accent transition-colors">
                  Tailwind
                </span>
                <span className="px-3 py-1 border border-ink text-ink font-mono text-xs font-bold hover:bg-accent transition-colors">
                  Hono
                </span>
                <span className="px-3 py-1 border border-ink text-ink font-mono text-xs font-bold hover:bg-accent transition-colors">
                  GenAI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
