'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================
   TYPE DEFINITIONS
   ======================================== */

interface Stat {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  unit: string;
  description: string;
  color: 'accent' | 'success' | 'accent-secondary';
}

/* ========================================
   STATS DATA
   ======================================== */

const statsData: Stat[] = [
  {
    id: 'experience',
    icon: Calendar,
    label: 'EXPERIENCE_RUNTIME',
    value: 4,
    suffix: '+',
    unit: 'YEARS ACTIVE',
    description:
      'Continuous delivery of high-quality software in fast-paced environments.',
    color: 'accent',
  },
  {
    id: 'domains',
    icon: TrendingUp,
    label: 'DOMAINS_MAPPED',
    value: 2,
    unit: 'CORE INDUSTRIES',
    description:
      'Specialized testing for Financial Services and Information Technology sectors.',
    color: 'success',
  },
  {
    id: 'velocity',
    icon: Zap,
    label: 'TEST_VELOCITY',
    value: 150,
    suffix: '+',
    unit: 'CASES / CYCLE',
    description:
      'Rigorous execution of functional, regression, and UAT scenarios per sprint.',
    color: 'accent-secondary',
  },
];

/* ========================================
   ANIMATED COUNTER COMPONENT
   ======================================== */

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  suffix = '',
  duration = 2,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef({ value: 0 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    gsap.to(countRef.current, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.floor(countRef.current.value));
      },
    });
  }, [end, duration]);

  return (
    <span className={className}>
      {count}
      {suffix && <span className="text-4xl align-top">{suffix}</span>}
    </span>
  );
};

/* ========================================
   STATS SECTION COMPONENT
   ======================================== */

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const [hasInView, setHasInView] = useState(false);

  /* ========================================
     GSAP ANIMATIONS - WITH CLEANUP
     ======================================== */

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Create ScrollTrigger for entrance animation
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          setHasInView(true);

          // Stagger animation for stat items
          gsap.from('.stat-item', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });
    }, sectionRef);

    /* ========================================
       🔒 CRITICAL: CLEANUP FUNCTION
       ======================================== */

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      ctx.revert();
    };
  }, []);

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="py-24 px-6 md:px-12 bg-paper relative overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          color: 'var(--text-ink)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header (Screen Reader Only) */}
        <h2 id="stats-heading" className="sr-only">
          Professional Statistics and Achievements
        </h2>

        {/* Stats Grid */}
        <ul
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          role="list"
          aria-label="Professional statistics"
        >
          {statsData.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <li
                key={stat.id}
                className="stat-item border-l-4 border-ink/20 hover:border-accent pl-6 md:pl-8 py-4 relative group transition-all duration-500"
                role="listitem"
              >
                {/* Icon & Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 border-2 border-ink/20 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                    <Icon
                      size={16}
                      className="text-ink group-hover:text-accent transition-colors"
                    />
                  </div>
                  <div
                    className="font-mono text-xs text-muted uppercase tracking-wider group-hover:text-accent transition-colors"
                    aria-hidden="true"
                  >
                    {stat.label}
                  </div>
                </div>

                {/* Animated Number */}
                <div
                  className="text-6xl md:text-8xl font-serif font-normal text-ink mb-2"
                  aria-label={`${stat.value}${stat.suffix || ''} ${stat.unit}`}
                >
                  {hasInView ? (
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={1.5 + index * 0.2}
                    />
                  ) : (
                    <>
                      0
                      {stat.suffix && (
                        <span className="text-4xl align-top">
                          {stat.suffix}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Unit Label */}
                <div className="flex items-center gap-2 font-mono text-sm text-ink font-bold uppercase tracking-wider mb-4">
                  <CheckCircle2 size={14} className="text-success" />
                  {stat.unit}
                </div>

                {/* Description */}
                <p className="text-sm text-muted leading-relaxed max-w-xs">
                  {stat.description}
                </p>

                {/* Hover Indicator */}
                <div
                  className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-7 md:-translate-x-9"
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>

        {/* Summary Footer */}
        <div className="mt-16 pt-8 border-t border-ink/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="font-mono text-xs text-muted uppercase tracking-wider">
            <span className="text-accent font-bold">METRICS_SUMMARY:</span>{' '}
            Real-time system diagnostics
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-success">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="uppercase tracking-wider">
              ALL_SYSTEMS_OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
