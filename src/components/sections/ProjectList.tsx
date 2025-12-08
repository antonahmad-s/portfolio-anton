'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Project } from '@/types';
import { PROJECTS } from '@/lib/constants';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xTo = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const yTo = useRef<any>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bgXTo = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bgYTo = useRef<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (maskRef.current) {
        xTo.current = gsap.quickTo(maskRef.current, 'left', {
          duration: 0.2,
          ease: 'power3',
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

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (xTo.current && yTo.current) {
        xTo.current(x);
        yTo.current(y);
      }

      if (bgXTo.current && bgYTo.current) {
        const xPercent = (x / rect.width - 0.5) * 2;
        const yPercent = (y / rect.height - 0.5) * 2;
        bgXTo.current(xPercent * -20);
        bgYTo.current(yPercent * -20);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[60vh] border-b border-ink/20 group overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Layer 1: Wireframe State */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="font-mono text-xs mb-2 bg-ink text-paper px-2 py-1 inline-block">
            CASE_FILE: {project.id}
          </div>
          <div
            className={`font-mono text-xs font-bold px-2 py-1 border border-ink transition-colors duration-300 ${
              project.status === 'VERIFIED'
                ? 'text-success border-success'
                : 'text-accent border-accent'
            }`}
          >
            STATUS: {project.status}
          </div>
        </div>

        <div className="my-8 md:my-0 pointer-events-none text-ink relative">
          <h2
            className="text-4xl md:text-7xl font-black uppercase tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity duration-300 mix-blend-difference"
            data-text={project.title}
            style={{
              animation: isHovered
                ? 'glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite'
                : 'none',
              textShadow: isHovered
                ? '2px 2px var(--color-accent), -2px -2px var(--glitch-c)'
                : 'none',
            }}
          >
            {project.title}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pointer-events-auto">
          <div className="max-w-md">
            <p className="font-mono text-sm text-muted mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono border border-grid text-dim px-2 py-0.5 uppercase tracking-wide"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn flex items-center gap-4 bg-transparent hover:bg-ink text-ink hover:text-accent border-2 border-ink px-6 py-3 transition-all duration-300"
            aria-label={`View project details for ${project.title}`}
          >
            <span className="font-mono text-xs font-bold">ACCESS_NODE</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Background Image with Parallax */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 opacity-5 grayscale contrast-150 pointer-events-none scale-110 transition-transform duration-75 ease-out"
        style={{
          backgroundImage: `url(${project.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>

      {/* Layer 2: Flashlight Mask (Desktop Only) */}
      <div
        ref={maskRef}
        className="absolute w-[350px] h-[350px] rounded-full pointer-events-none z-20 bg-ink top-0 left-0 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden border-2 border-accent bg-ink">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${project.imageUrl})` }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="bg-accent text-ink px-3 py-1 text-xs font-mono font-bold uppercase shadow-lg">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Fallback */}
      <div
        className={`md:hidden absolute inset-0 bg-ink/90 flex flex-col justify-center items-center px-6 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } pointer-events-none`}
      >
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-accent mb-2">
            {project.title}
          </h2>
          <div className="mt-4">
            <span className="text-paper font-mono text-xs border border-paper px-3 py-1">
              TAP TO VIEW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectList: React.FC = () => {
  return (
    <section className="bg-paper relative z-10 py-24">
      <div className="max-w-400 mx-auto">
        <div className="px-6 md:px-12 mb-12 flex items-baseline justify-between border-b border-ink pb-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight">
              Portfolio
              <br />
              Projects
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="font-mono text-sm block">
              SELECT * FROM PROJECTS
            </span>
            <span className="font-mono text-xs text-dim">
              WHERE TYPE IN (&apos;QA&apos;, &apos;DEV&apos;)
            </span>
          </div>
        </div>

        <div className="flex flex-col border-t border-ink/20">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
