'use client';

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChevronRight, Calendar, Briefcase } from 'lucide-react';
import { ensureGsapPluginsRegistered } from './gsapClient';

interface ExperienceItem {
  id: string;
  version: string;
  status: 'latest' | 'completed' | 'archived';
  company: string;
  role: string;
  period: string;
  dateRange: string;
  responsibilities: string[];
}

const experienceData: ExperienceItem[] = [
  {
    id: 'edts-2025',
    version: 'v3.0',
    status: 'latest',
    company: 'PT EDTS',
    role: 'Senior Quality Assurance',
    period: '2025 - PRESENT',
    dateRange: '2025-01-01',
    responsibilities: [
      'Spearheading QA strategies for enterprise-scale digital transformation projects.',
      'Integrating AI-driven testing tools into the CI/CD pipeline.',
      'Mentoring junior QA engineers on automation best practices.',
    ],
  },
  {
    id: 'mii-2022',
    version: 'v2.0',
    status: 'completed',
    company: 'PT. Mitra Integrasi Informatika',
    role: 'Quality Assurance Engineer',
    period: 'MAY 2022 - 2025',
    dateRange: '2022-05-01/2025-01-01',
    responsibilities: [
      'Reviewing Functional Design Documents (FDD) & Technical Design Documents (TDD).',
      'Developing & maintaining automated test scripts using Katalon Studio.',
      'Lead for User Acceptance Testing (UAT) and deployment verification.',
    ],
  },
  {
    id: 'tnu-2020',
    version: 'v1.0',
    status: 'archived',
    company: 'PT. Tri Nindya Utama',
    role: 'QA Engineer',
    period: 'NOV 2020 - APR 2022',
    dateRange: '2020-11-01/2022-04-30',
    responsibilities: [
      'Created comprehensive Test Plans and Scenarios based on business requirements.',
      'Executed rigorous Manual Testing (Functional, Regression, Integration).',
      'Produced detailed User Manuals for end-user training.',
    ],
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const ids = useMemo(() => experienceData.map((e) => `exp-${e.id}`), []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // GSAP + ScrollTrigger setup: useLayoutEffect to measure/pin without visual jumps.
  useLayoutEffect(() => {
    if (isMobile || !trackRef.current || !sectionRef.current) return;

    const { gsap, ScrollTrigger } = ensureGsapPluginsRegistered();

    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      // Use a tween so ScrollTrigger drives it; ctx.revert() will clean up reliably.
      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Extra safety: keep ScrollTrigger in sync when fonts/images shift layout.
      ScrollTrigger.refresh();
      return () => tween.kill();
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  const focusByIndex = (nextIndex: number) => {
    const i = clamp(nextIndex, 0, experienceData.length - 1);
    setActiveIndex(i);
    document.getElementById(ids[i])?.focus();
  };

  // Roving tabindex for arrow key navigation (only one item is tabbable).
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusByIndex(index + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusByIndex(index - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      focusByIndex(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      focusByIndex(experienceData.length - 1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className={`
        bg-ink text-paper relative overflow-hidden
        ${isMobile ? 'min-h-screen py-24' : 'h-screen'}
        flex flex-col
      `}
      aria-labelledby="experience-heading"
    >
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          color: 'var(--color-paper)',
        }}
        aria-hidden="true"
      />

      <header
        className={`px-6 md:px-12 pt-12 pb-8 z-20 ${
          isMobile ? '' : 'shrink-0'
        }`}
      >
        <h2
          id="experience-heading"
          className="text-4xl md:text-5xl font-serif italic text-paper"
        >
          Execution Logs
        </h2>

        <div className="font-mono text-xs text-accent mt-2 flex items-center gap-2">
          <Calendar size={12} aria-hidden="true" focusable={false} />
          <time dateTime="2020/2025">Timeline :: 2020 - PRESENT</time>
        </div>

        {!isMobile && (
          <div className="mt-4 font-mono text-xs text-gray-500 flex items-center gap-2">
            <span>SCROLL_DOWN</span>
            <ChevronRight
              size={12}
              className="animate-pulse"
              aria-hidden="true"
              focusable={false}
            />
          </div>
        )}
      </header>

      {isMobile ? (
        <div className="px-6 space-y-12">
          {experienceData.map((exp) => (
            <article
              key={exp.id}
              id={`exp-${exp.id}`}
              className="border-l-4 border-accent pl-6 py-4"
              tabIndex={0}
              aria-labelledby={`exp-title-${exp.id}`}
            >
              <div
                className={`
                  inline-block px-2 py-1 font-mono text-xs font-bold mb-4
                  ${
                    exp.status === 'latest'
                      ? 'bg-accent text-ink'
                      : 'border border-gray-500 text-gray-400'
                  }
                `}
              >
                {exp.version} {'// '}
                {exp.status.toUpperCase()}
              </div>

              <h3
                id={`exp-title-${exp.id}`}
                className="text-2xl md:text-3xl font-serif leading-tight mb-2"
              >
                {exp.company}
              </h3>

              <h4 className="text-lg text-gray-400 font-serif italic mb-4 flex items-center gap-2">
                <Briefcase size={16} aria-hidden="true" focusable={false} />
                {exp.role}
              </h4>

              <time
                dateTime={exp.dateRange}
                className="font-mono text-xs text-gray-500 block mb-6"
              >
                {exp.period}
              </time>

              <ul
                className="space-y-3 font-mono text-sm text-gray-300"
                role="list"
              >
                {exp.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="text-accent mt-1 shrink-0"
                      aria-hidden="true"
                    >
                      &gt;&gt;
                    </span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <div className="text-center py-8 border-t border-paper/20">
            <div className="font-mono text-xs text-gray-500 tracking-widest uppercase">
              END_OF_LOGS
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex gap-0 w-max items-start flex-1 pl-12"
          role="list"
          aria-label="Career timeline"
        >
          {experienceData.map((exp, index) => (
            <article
              key={exp.id}
              id={`exp-${exp.id}`}
              className={`
                w-[60vw] min-h-[65vh] flex flex-col justify-between
                pl-8 pr-24 py-8 relative group transition-all duration-500
                ${
                  index === 0
                    ? 'border-l-4 border-accent'
                    : 'border-l border-paper/30'
                }
                hover:bg-white/5 focus-within:bg-white/10
                focus-within:ring-2 focus-within:ring-accent
                focus-within:ring-offset-2 focus-within:ring-offset-ink
              `}
              // Roving tabindex: only active card is in Tab order.
              tabIndex={index === activeIndex ? 0 : -1}
              role="listitem"
              aria-labelledby={`exp-title-${exp.id}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setActiveIndex(index)}
            >
              <div>
                <div
                  className={`
                    inline-block px-2 py-1 font-mono text-xs font-bold mb-6
                    ${
                      exp.status === 'latest'
                        ? 'bg-accent text-ink'
                        : 'border border-gray-500 text-gray-400'
                    }
                  `}
                >
                  {exp.version} {'// '}
                  {exp.status.toUpperCase()}
                </div>

                <h3
                  id={`exp-title-${exp.id}`}
                  className="text-5xl font-serif leading-tight mb-2"
                >
                  {exp.company}
                </h3>

                <h4 className="text-2xl text-gray-400 font-serif italic mb-6 flex items-center gap-2">
                  <Briefcase size={20} aria-hidden="true" focusable={false} />
                  {exp.role}
                </h4>

                <time
                  dateTime={exp.dateRange}
                  className="font-mono text-xs text-gray-500 uppercase tracking-wider"
                >
                  {exp.period}
                </time>
              </div>

              <div className="border-t border-paper/20 pt-6 mt-auto">
                <ul
                  className="space-y-4 font-mono text-base text-gray-300"
                  role="list"
                >
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="text-accent mt-1 shrink-0"
                        aria-hidden="true"
                      >
                        &gt;&gt;
                      </span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-focus-within:opacity-100 transition-opacity"
                aria-hidden="true"
              />
            </article>
          ))}

          <div
            className="w-[20vw] min-h-[65vh] flex items-center justify-center border-l border-paper/30"
            role="presentation"
          >
            <div className="rotate-90 font-mono text-xs text-gray-500 tracking-widest uppercase">
              END_OF_LOGS
            </div>
          </div>
        </div>
      )}

      <a
        href="#skills"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-ink focus:rounded-md"
      >
        Skip to Skills Section
      </a>
    </section>
  );
};

export default Experience;
