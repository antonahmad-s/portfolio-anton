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
    company: 'PT. ELEVENIA DIGITAL TEKNOLOGI SUKSES - EDTS',
    role: 'Quality Assurance Engineer',
    period: 'JUN 2025 - PRESENT',
    dateRange: '2025-06-01',
    responsibilities: [
      'Led End-to-End (E2E) testing for high-risk e-commerce modules, including the "Transaction Refund" system (Klik Indomaret), ensuring absolute financial accuracy and business logic compliance.',
      'Partnered with Product Managers and Developers to review Functional Designs (FD) early, identifying logic gaps pre-development and reducing design-phase defects by 15%.',
      'Managed User Acceptance Testing (UAT) phases, acting as the primary liaison between technical teams and end-users to ensure smooth production deployments.',
      'Developed test case for repetitive regression scenarios to accelerate future sprint cycles.',
    ],
  },
  {
    id: 'mii-2022',
    version: 'v2.0',
    status: 'completed',
    company: 'PT. Mitra Integrasi Informatika - FIFGROUP',
    role: 'Quality Assurance Engineer',
    period: 'MAY 2022 - MAY 2025',
    dateRange: '2022-05-01/2025-05-01',
    responsibilities: [
      'Managed the QA lifecycle for enterprise financial applications, executing comprehensive suites of 150+ test cases per release.',
      'Validated data integrity between mobile front-ends and backend systems using Postman for API testing, ensuring consistent data synchronization.',
      'Minimized defect leakage into production by enforcing strict Regression Testing protocols prior to major deployments.',
      'Accelerated bug-fix turnaround times by providing developers with high-precision bug reports, complete with logs, screenshots, and reproduction steps.',
      'Worked closely with end users in User Acceptance Testing (UAT) to ensure applications meet business requirements before deployment.',
    ],
  },
  {
    id: 'tnu-2020',
    version: 'v1.0',
    status: 'archived',
    company: 'PT. Tri Nindya Utama',
    role: 'Software Quality Assurance',
    period: 'NOV 2020 - APR 2022',
    dateRange: '2020-11-01/2022-04-30',
    responsibilities: [
      'Designed and executed manual test plans covering functional, integration, and system testing scopes.',
      'Authored user manuals and technical documentation to streamline end-user onboarding and support.',
      'Collaborated with developers during UAT to identify and resolve performance blockers.',
    ],
  },
  {
    id: 'uni-2017',
    version: 'v0.5',
    status: 'archived',
    company: 'Jakarta State University',
    role: 'Bachelor of Education - Informatics and Computer Engineering',
    period: '2017 - 2021',
    dateRange: '2017-01-01/2021-01-01',
    responsibilities: [
      'Graduated with Bachelor of Education degree in Informatics and Computer Engineering.',
      'Focus on Software Engineering and Educational Technology.',
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
          <div className="mt-4 font-mono text-xs text-ink/50 flex items-center gap-2">
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
                      : 'border border-ink/50 text-ink/70'
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

              <h4 className="text-lg text-ink/80 font-serif italic mb-4 flex items-center gap-2">
                <Briefcase size={16} aria-hidden="true" focusable={false} />
                {exp.role}
              </h4>

              <time
                dateTime={exp.dateRange}
                className="font-mono text-xs text-ink/70 block mb-6"
              >
                {exp.period}
              </time>

              <ul
                className="space-y-3 font-mono text-sm text-ink/90"
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
            <div className="font-mono text-xs text-ink/50 tracking-widest uppercase">
              END_OF_LOGS
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex gap-0 w-max items-start flex-1 pl-6 md:pl-12"
          role="list"
          aria-label="Career timeline"
        >
          {experienceData.map((exp, index) => (
            <article
              key={exp.id}
              id={`exp-${exp.id}`}
              className={`
                w-[85vw] md:w-[70vw] lg:w-[50vw] max-w-[800px] h-[65vh] flex flex-col justify-between
                pl-8 pr-12 md:pr-16 py-6 relative group transition-all duration-500
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
              <div className="flex flex-col h-full overflow-hidden">
                <div className="mb-4 shrink-0">
                  <div
                    className={`
                      inline-block px-2 py-0.5 font-mono text-[10px] md:text-xs font-bold mb-3
                      ${
                        exp.status === 'latest'
                          ? 'bg-accent text-ink'
                          : 'border border-ink/50 text-ink/70'
                      }
                    `}
                  >
                    {exp.version} {'// '}
                    {exp.status.toUpperCase()}
                  </div>

                  <h3
                    id={`exp-title-${exp.id}`}
                    className="text-2xl md:text-3xl font-serif leading-tight mb-1 break-words line-clamp-2"
                    title={exp.company}
                  >
                    {exp.company}
                  </h3>

                  <h4 className="text-lg md:text-xl text-ink/80 font-serif italic mb-3 flex items-center gap-2">
                    <Briefcase size={16} aria-hidden="true" focusable={false} />
                    {exp.role}
                  </h4>

                  <time
                    dateTime={exp.dateRange}
                    className="font-mono text-[10px] md:text-xs text-ink/70 uppercase tracking-wider block"
                  >
                    {exp.period}
                  </time>
                </div>

                <div className="border-t border-paper/20 pt-4 mt-auto overflow-y-auto pr-2 custom-scrollbar flex-1">
                  <ul
                    className="space-y-2 font-mono text-sm text-ink/90"
                    role="list"
                  >
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          className="text-accent mt-[3px] shrink-0 text-xs"
                          aria-hidden="true"
                        >
                          &gt;&gt;
                        </span>
                        <span className="leading-snug">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-focus-within:opacity-100 transition-opacity"
                aria-hidden="true"
              />
            </article>
          ))}

          <div
            className="w-[15vw] h-[65vh] flex items-center justify-center border-l border-paper/30"
            role="presentation"
          >
            <div className="rotate-90 font-mono text-xs text-ink/50 tracking-widest uppercase whitespace-nowrap">
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
