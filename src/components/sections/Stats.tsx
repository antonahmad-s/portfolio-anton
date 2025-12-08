'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-paper">
      <div className="max-w-[100rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {/* Stat 1 */}
          <div className="stat-item border-l-2 border-ink pl-6 relative group">
            <div className="font-mono text-xs text-ink/50 mb-2 group-hover:bg-accent group-hover:text-ink w-max transition-colors">
              EXPERIENCE_RUNTIME
            </div>
            <div className="text-6xl md:text-8xl font-serif font-normal">
              04<span className="text-4xl align-top">+</span>
            </div>
            <div className="font-mono text-sm mt-2">YEARS ACTIVE</div>
            <p className="mt-4 text-sm opacity-70 max-w-xs">
              Continuous delivery of high-quality software in fast-paced
              environments.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="stat-item border-l-2 border-ink pl-6 relative group">
            <div className="font-mono text-xs text-ink/50 mb-2 group-hover:bg-accent group-hover:text-ink w-max transition-colors">
              DOMAINS_MAPPED
            </div>
            <div className="text-6xl md:text-8xl font-serif font-normal">
              02
            </div>
            <div className="font-mono text-sm mt-2">CORE INDUSTRIES</div>
            <p className="mt-4 text-sm opacity-70 max-w-xs">
              Specialized testing for Financial Services and Information
              Technology sectors.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="stat-item border-l-2 border-ink pl-6 relative group">
            <div className="font-mono text-xs text-ink/50 mb-2 group-hover:bg-accent group-hover:text-ink w-max transition-colors">
              TEST_VELOCITY
            </div>
            <div className="text-6xl md:text-8xl font-serif font-normal">
              150<span className="text-4xl align-top">+</span>
            </div>
            <div className="font-mono text-sm mt-2">CASES / CYCLE</div>
            <p className="mt-4 text-sm opacity-70 max-w-xs">
              Rigorous execution of functional, regression, and UAT scenarios
              per sprint.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
