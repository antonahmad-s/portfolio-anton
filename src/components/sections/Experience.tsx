'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;

      if (track && section) {
        const getScrollAmount = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1.5, // Smoother scrub for less jank
            invalidateOnRefresh: true,
            anticipatePin: 1, // Reduces jank when pinning
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-ink text-paper relative overflow-hidden h-screen flex flex-col justify-center"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      ></div>

      <div className="absolute top-12 left-6 md:left-12 z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-italic text-paper mix-blend-difference">
          Execution Logs
        </h2>
        <div className="font-mono text-xs text-accent mt-2">
          Timeline :: 2020 - PRESENT
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-0 w-max items-center h-full pl-6 md:pl-12"
      >
        {/* PT EDTS (Latest) */}
        <div className="w-[85vw] md:w-[60vw] h-[65vh] flex flex-col justify-between border-l-4 border-accent pl-8 pr-16 md:pr-24 py-4 relative group hover:bg-white/5 transition-colors duration-500 bg-white/5">
          <div>
            <div className="inline-block bg-accent text-ink px-2 py-1 font-mono text-xs font-bold mb-6">
              v3.0 // LATEST
            </div>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-2">
              PT EDTS
            </h3>
            <h4 className="text-xl md:text-2xl text-gray-400 font-serif italic mb-6">
              Senior Quality Assurance
            </h4>
            <div className="font-mono text-xs text-gray-500">
              2025 - PRESENT
            </div>
          </div>

          <div className="border-t border-paper/20 pt-6">
            <ul className="space-y-4 font-mono text-sm md:text-base text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Spearheading QA strategies for enterprise-scale digital
                transformation projects.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Integrating AI-driven testing tools into the CI/CD pipeline.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Mentoring junior QA engineers on automation best practices.
              </li>
            </ul>
          </div>
        </div>

        {/* PT MII */}
        <div className="w-[85vw] md:w-[60vw] h-[65vh] flex flex-col justify-between border-l border-paper/30 pl-8 pr-16 md:pr-24 py-4 relative group hover:bg-white/5 transition-colors duration-500">
          <div>
            <div className="inline-block border border-gray-500 text-gray-400 px-2 py-1 font-mono text-xs font-bold mb-6">
              v2.0 // COMPLETED
            </div>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-2">
              PT. Mitra Integrasi Informatika
            </h3>
            <h4 className="text-xl md:text-2xl text-gray-400 font-serif italic mb-6">
              Assigned to: FIFGROUP
            </h4>
            <div className="font-mono text-xs text-gray-500">
              MAY 2022 - 2025
            </div>
          </div>

          <div className="border-t border-paper/20 pt-6">
            <ul className="space-y-4 font-mono text-sm md:text-base text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Reviewing Functional Design Documents (FDD) &amp; Technical
                Design Documents (TDD).
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Developing &amp; maintaining automated test scripts using
                Katalon Studio.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Lead for User Acceptance Testing (UAT) and deployment
                verification.
              </li>
            </ul>
          </div>
        </div>

        {/* PT Tri Nindya Utama */}
        <div className="w-[85vw] md:w-[60vw] h-[65vh] flex flex-col justify-between border-l border-paper/30 pl-8 pr-16 md:pr-24 py-4 relative group hover:bg-white/5 transition-colors duration-500">
          <div>
            <div className="inline-block border border-gray-500 text-gray-400 px-2 py-1 font-mono text-xs font-bold mb-6">
              v1.0 // ARCHIVED
            </div>
            <h3 className="text-3xl md:text-5xl font-serif leading-tight mb-2">
              PT. Tri Nindya Utama
            </h3>
            <h4 className="text-xl md:text-2xl text-gray-400 font-serif italic mb-6">
              QA Engineer
            </h4>
            <div className="font-mono text-xs text-gray-500">
              NOV 2020 - APR 2022
            </div>
          </div>

          <div className="border-t border-paper/20 pt-6">
            <ul className="space-y-4 font-mono text-sm md:text-base text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Created comprehensive Test Plans and Scenarios based on business
                requirements.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Executed rigorous Manual Testing (Functional, Regression,
                Integration).
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">&gt;&gt;</span>
                Produced detailed User Manuals for end-user training.
              </li>
            </ul>
          </div>
        </div>

        {/* End Spacer */}
        <div className="w-[20vw] h-[65vh] flex items-center justify-center border-l border-paper/30">
          <div className="rotate-90 font-mono text-xs text-gray-500 tracking-widest">
            END_OF_LOGS
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
