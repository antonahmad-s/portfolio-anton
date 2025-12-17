'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import { ExternalLink, Tag } from 'lucide-react';
import { Project } from '@/types';
import { PROJECTS } from '@/lib/constants';

interface ProjectCardProps {
  project: Project;
  index: number;
}

type QuickToFunc = (value: number) => void;

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  // Properly typed GSAP quickTo refs
  const xTo = useRef<QuickToFunc | null>(null);
  const yTo = useRef<QuickToFunc | null>(null);
  const bgXTo = useRef<QuickToFunc | null>(null);
  const bgYTo = useRef<QuickToFunc | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (maskRef.current) {
        xTo.current = gsap.quickTo(maskRef.current, 'left', {
          duration: 0.3,
          ease: 'power2.out',
        });
        yTo.current = gsap.quickTo(maskRef.current, 'top', {
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (bgImageRef.current) {
        bgXTo.current = gsap.quickTo(bgImageRef.current, 'x', {
          duration: 0.8,
          ease: 'power3.out',
        });
        bgYTo.current = gsap.quickTo(bgImageRef.current, 'y', {
          duration: 0.8,
          ease: 'power3.out',
        });
      }
    }, containerRef);

    /* ========================================
       🔒 CRITICAL: CLEANUP FUNCTION
       ======================================== */

    return () => {
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Kill GSAP context (removes quickTo functions)
      ctx.revert();

      // Clear refs
      xTo.current = null;
      yTo.current = null;
      bgXTo.current = null;
      bgYTo.current = null;
    };
  }, []);

  /* ========================================
     THROTTLED MOUSE MOVE - PERFORMANCE FIX
     ======================================== */

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) return; // Throttle to 60fps max

    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update mask position
      if (xTo.current && yTo.current) {
        xTo.current(x);
        yTo.current(y);
      }

      // Parallax background
      if (bgXTo.current && bgYTo.current) {
        const xPercent = (x / rect.width - 0.5) * 2;
        const yPercent = (y / rect.height - 0.5) * 2;
        const intensity =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--parallax-intensity'
            )
          ) || -15;
        bgXTo.current(xPercent * intensity);
        bgYTo.current(yPercent * intensity);
      }

      rafRef.current = null;
    });
  }, []);

  /* ========================================
     KEYBOARD INTERACTION
     ======================================== */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(project.link, '_blank', 'noopener,noreferrer');
      }
    },
    [project.link]
  );

  return (
    <article
      ref={containerRef}
      className="relative w-full border-b border-ink/10 group overflow-hidden flex flex-col justify-between focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-paper transition-all"
      style={{ minHeight: 'clamp(70vh, 60vh, 80vh)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      tabIndex={0}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      onKeyDown={handleKeyDown}
    >
      {/* Main Content Layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 md:p-12">
        {/* Header */}
        <header className="flex justify-between items-start gap-4">
          <div className="font-mono text-xs bg-ink text-paper px-2 py-1 inline-block uppercase tracking-wider">
            CASE_FILE: {project.id}
          </div>
          <div
            className={`
              font-mono text-xs font-bold px-2 py-1 border-2 uppercase tracking-wider
              ${
                project.status === 'VERIFIED'
                  ? 'text-success border-success'
                  : 'text-accent border-accent'
              }
            `}
            role="status"
            aria-label={`Project status: ${project.status}`}
          >
            {project.status}
          </div>
        </header>

        {/* Project Title - FIXED GLITCH ANIMATION */}
        <div className="my-8 md:my-0">
          <h2
            id={`project-title-${project.id}`}
            className={`
              text-4xl md:text-7xl font-black uppercase tracking-tighter
              text-ink transition-all duration-300
              ${isHovered ? 'opacity-100' : 'opacity-30'}
            `}
            style={{
              // Removed infinite glitch animation for accessibility
              textShadow: isHovered
                ? '2px 2px var(--color-accent), -2px -2px var(--color-accent-secondary)'
                : 'none',
            }}
          >
            {project.title}
          </h2>
        </div>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* Project Details */}
          <div className="max-w-md">
            <p className="font-mono text-sm text-muted mb-4 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack */}
            <div
              className="flex flex-wrap gap-2"
              role="list"
              aria-label="Technologies used"
            >
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  role="listitem"
                  className="inline-flex items-center gap-1 text-[10px] font-mono border border-ink/20 text-muted px-2 py-1 uppercase tracking-wide hover:bg-accent/10 hover:border-accent transition-colors"
                >
                  <Tag size={10} />
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-3 bg-transparent hover:bg-ink text-ink hover:text-accent border-2 border-ink px-6 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper"
            aria-label={`View project details for ${project.title} (opens in new tab)`}
          >
            <span className="font-mono text-xs font-bold uppercase tracking-wider">
              ACCESS_NODE
            </span>
            <ExternalLink
              size={16}
              className="transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
            />
          </a>
        </footer>
      </div>

      {/* Background Image - OPTIMIZED WITH NEXT/IMAGE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={bgImageRef}
          className="absolute inset-0 opacity-5 grayscale contrast-125 scale-110 will-change-transform"
        >
          <Image
            src={project.imageUrl}
            alt="" // Decorative image, described by project title
            fill
            quality={50} // Low quality for background
            className="object-cover"
            sizes="100vw"
            priority={index === 0} // Prioritize first project
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>

      {/* Flashlight Mask (Desktop Only) */}
      <div
        ref={maskRef}
        className={`
          absolute rounded-full pointer-events-none z-20
          top-0 left-0 -translate-x-1/2 -translate-y-1/2
          hidden md:block
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: 'clamp(250px, 30vw, 400px)',
          height: 'clamp(250px, 30vw, 400px)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden border-4 border-accent shadow-glow">
          <Image
            src={project.imageUrl}
            alt=""
            fill
            quality={85}
            className="object-cover"
            sizes="350px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink/80 to-transparent">
            <span className="bg-accent text-ink px-4 py-2 text-xs font-mono font-bold uppercase shadow-brutal-sm">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Overlay - Centered */}
      <div
        className={`
          md:hidden absolute inset-0 z-20 flex items-center justify-center pointer-events-none
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        aria-hidden="true"
      >
        {/* Circular Image with Button Overlay */}
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-accent shadow-glow">
          <Image
            src={project.imageUrl}
            alt=""
            width={256}
            height={256}
            quality={85}
            className="object-cover w-full h-full"
          />
          {/* Button Overlay - Centered on Image */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink/80 to-transparent">
            <span className="bg-accent text-ink px-4 py-2 text-xs font-mono font-bold uppercase shadow-brutal-sm">
              View Details
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ========================================
   PROJECT LIST COMPONENT
   ======================================== */

const ProjectList: React.FC = () => {
  return (
    <section
      id="portfolio"
      className="bg-paper relative z-10 py-12"
      aria-labelledby="portfolio-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="px-6 md:px-12 mb-12 flex flex-col md:flex-row items-start md:items-baseline justify-between border-b border-ink/20 pb-4 gap-4">
          <div>
            <h2
              id="portfolio-heading"
              className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight text-ink"
            >
              Portfolio
              <br />
              <span className="text-accent">Projects</span>
            </h2>
          </div>

          <div className="text-left md:text-right">
            <code className="font-mono text-sm block text-ink">
              SELECT * FROM PROJECTS
            </code>
            <code className="font-mono text-xs text-muted">
              WHERE TYPE IN (&apos;QA&apos;, &apos;DEV&apos;)
            </code>
          </div>
        </header>

        {/* Projects Grid */}
        <div
          className="flex flex-col border-t border-ink/20"
          role="list"
          aria-label="Project portfolio list"
        >
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Project Count */}
        <div className="px-6 md:px-12 mt-8 pt-8 border-t border-ink/10">
          <div className="flex items-center justify-between font-mono text-xs text-muted">
            <span>TOTAL_PROJECTS: {PROJECTS.length}</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              DATABASE_ONLINE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
