'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { User, Shield, Code2, TrendingUp, Download } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================
   ABOUT SECTION COMPONENT
   ======================================== */

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  /* ========================================
     DATA CONSTANTS
     ======================================== */

  const qaSkills = [
    { icon: Shield, label: 'Risk Mitigation', color: 'text-ink' },
    { icon: User, label: 'Pixel-Perfect Validation', color: 'text-ink' },
    { icon: TrendingUp, label: 'User-Centric Empathy', color: 'text-ink' },
    { icon: Code2, label: 'Process Optimization', color: 'text-ink' },
  ];

  const techStack = [
    { name: 'Next.js', featured: true },
    { name: 'React', featured: false },
    { name: 'TypeScript', featured: false },
    { name: 'Tailwind', featured: false },
    { name: 'Hono', featured: false },
    { name: 'GenAI', featured: false },
  ];

  /* ========================================
     ANIMATION SETUP - WITH CLEANUP
     ======================================== */

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Module cards animation
      const cardsTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.from('.module-card', {
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });

      // Divider lines animation
      const dividerTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.from('.divider-line', {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 1.5,
            ease: 'expo.out',
            clearProps: 'all',
          });
        },
      });

      scrollTriggersRef.current.push(cardsTrigger, dividerTrigger);
    }, containerRef);

    /* ========================================
       🔒 CRITICAL: CLEANUP FUNCTION
       ======================================== */

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
      ctx.revert();
    };
  }, []);

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      ref={containerRef}
      id="about"
      className="min-h-screen py-12 px-6 md:px-12 bg-paper relative z-10 overflow-hidden flex flex-col justify-center"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="mb-16 flex flex-col md:flex-row items-baseline justify-between border-b border-ink/20 pb-4">
          <h2
            id="about-heading"
            className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight text-ink"
          >
            System Identity
          </h2>
          <div className="font-mono text-sm mt-2 md:mt-0 flex items-center gap-4">
            {/* <span className="bg-ink text-paper px-2 py-1 font-bold">
              KERNEL_VERSION: 3.0
            </span> */}
            <span className="text-muted uppercase tracking-wider">
              HYBRID_ARCHITECT
            </span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Vertical Dividers */}
          <div
            className="divider-line absolute left-1/3 top-0 bottom-0 w-px bg-ink/10 hidden md:block -translate-x-1/2"
            aria-hidden="true"
          />
          <div
            className="divider-line absolute left-2/3 top-0 bottom-0 w-px bg-ink/10 hidden md:block -translate-x-1/2"
            aria-hidden="true"
          />

          {/* ========================================
              COLUMN 1: PERSONNEL PHOTO
              ======================================== */}

          <article className="module-card flex flex-col">
            <div
              className="font-mono text-xs text-ink border border-ink inline-block px-2 py-1 mb-6 w-max uppercase tracking-wider"
              aria-label="Section label"
            >
              PERSONNEL_ID
            </div>

            <figure className="grow relative overflow-hidden min-h-[280px] md:min-h-[320px] border-2 border-ink group bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                alt="Portrait of Anton Ahmad Susilo, Quality Assurance Architect"
                fill
                quality={85}
                priority={false}
                className={`
                  object-cover 
                  grayscale 
                  contrast-125 
                  group-hover:grayscale-0 
                  group-hover:contrast-100 
                  transition-all 
                  duration-700
                  ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                `}
                sizes="(max-width: 768px) 100vw, 33vw"
                onLoad={() => setImageLoaded(true)}
              />

              {/* Fallback while loading */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="w-12 h-12 border-4 border-ink border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Corner Markers */}
              <div
                className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-ink pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-ink pointer-events-none"
                aria-hidden="true"
              />

              {/* ID Badge */}
              <figcaption className="absolute bottom-6 left-6 bg-paper px-3 py-2 border-2 border-ink shadow-brutal-sm">
                <div className="font-bold font-serif text-lg leading-none text-ink">
                  ANTON A. SUSILO
                </div>
                <div className="font-mono text-[10px] text-muted mt-1 tracking-wide">
                  QA-Engineer / AI Web Developer
                </div>
              </figcaption>
            </figure>

            {/* Download CV Button */}
            <a
              href="/assets/cv/CV_Anton_Ahmad_Susilo.pdf"
              download
              className="
                mt-4 flex items-center justify-center gap-3
                px-6 py-3
                bg-ink text-paper
                font-mono text-sm font-bold uppercase tracking-wider
                border-2 border-ink
                hover:bg-accent hover:text-ink
                hover:shadow-[4px_4px_0px_var(--color-ink)]
                hover:-translate-y-1 hover:-translate-x-1
                transition-all duration-300
                group
              "
            >
              <Download size={16} className="group-hover:animate-bounce" />
              <span>Download CV</span>
            </a>
          </article>

          {/* ========================================
              COLUMN 2: QA CORE FOUNDATION
              ======================================== */}

          <article className="module-card">
            <div
              className="font-mono text-xs text-accent bg-ink inline-block px-2 py-1 mb-6 font-bold uppercase tracking-wider"
              aria-label="Section number"
            >
              01 // CORE_FOUNDATION
            </div>

            <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-6 text-ink">
              The Guardian of Stability.
            </h3>

            <p className="font-mono text-sm md:text-base text-muted leading-relaxed mb-8">
              Senior Quality Assurance Engineer with over five years of
              experience securing software reliability within the Fintech and
              E-commerce sectors. Proven ability to balance manual rigor with
              automation strategies (Selenium, Katalon), successfully reducing
              regression cycles by up to 40%.
            </p>

            {/* Skills List with Icons */}
            <ul
              className="space-y-4 border-t border-ink/10 pt-6"
              role="list"
              aria-label="Quality Assurance core competencies"
            >
              {qaSkills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <li
                    key={index}
                    className="flex items-center gap-3 font-mono text-sm text-ink hover:text-accent transition-colors group cursor-default"
                  >
                    <div
                      className={`
                      w-8 h-8 flex items-center justify-center 
                      border border-ink/20 
                      bg-paper shadow-sm
                      group-hover:border-accent 
                      group-hover:bg-accent/10
                      group-hover:shadow-[2px_2px_0px_var(--color-accent)]
                      transition-all duration-300
                      ${skill.color}
                    `}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="font-bold tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                      {skill.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* ========================================
              COLUMN 3: AI DEV EVOLUTION
              ======================================== */}

          <article className="module-card">
            <div
              className="font-mono text-xs text-ink border border-ink inline-block px-2 py-1 mb-6 uppercase tracking-wider font-bold"
              aria-label="Section number"
            >
              02 // NEW_EXPANSION
            </div>

            <h3 className="text-3xl md:text-4xl font-serif leading-tight mb-6 italic text-ink">
              Compiling the Future.
            </h3>

            <p className="font-mono text-sm md:text-base text-muted leading-relaxed mb-8">
              Currently expanding technical scope into Full-Stack Development,
              applying expertise in React.js and AI integration to build
              quality-first web applications. Focused on delivering bug-free
              user experiences through precise testing and technical
              adaptability.
            </p>

            <div
              className="relative p-6 bg-gradient-to-br from-ink/5 via-paper to-accent/10 border border-ink/10 rounded-sm overflow-hidden"
              role="region"
              aria-label="Technology stack"
            >
              {/* Animated corner accents */}
              <div
                className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ink/30"
                aria-hidden="true"
              />

              {/* Decorative grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                aria-hidden="true"
              >
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 20px, currentColor 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)',
                  }}
                />
              </div>

              {/* Header with icon */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-accent/20 border border-accent/40 flex items-center justify-center">
                  <Code2 size={12} className="text-accent" />
                </div>
                <span className="font-mono text-[10px] text-ink/60 uppercase tracking-[0.2em] font-bold">
                  Stack_Exploration
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-ink/10 to-transparent" />
              </div>

              {/* Tech badges with improved styling */}
              <div className="flex flex-wrap gap-2.5 relative z-10">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`
                      group relative px-4 py-2 
                      font-mono text-xs font-bold uppercase tracking-wide
                      border border-ink text-ink
                      bg-paper
                      hover:bg-accent hover:text-ink
                      hover:shadow-[2px_2px_0px_var(--color-ink)]
                      hover:-translate-y-0.5 hover:-translate-x-0.5
                      transition-all duration-200 cursor-default
                    `}
                  >
                    <span className="relative z-10">{tech.name}</span>
                  </span>
                ))}
              </div>

              {/* Status Indicator - now inside the card */}
              <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between">
                <div
                  className="flex items-center gap-2.5 font-mono text-[11px] text-ink/60"
                  role="status"
                  aria-live="polite"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-success rounded-full" />
                    <div className="absolute w-2.5 h-2.5 bg-success rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="tracking-wide">
                    LEARNING_MODE:{' '}
                    <span className="text-success font-bold">ACTIVE</span>
                  </span>
                </div>
                <div className="font-mono text-[9px] text-ink/30 uppercase tracking-wider">
                  v2.0
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default About;
