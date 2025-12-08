'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionDivider: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(lineRef.current, {
        scaleX: 1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[2px] relative overflow-visible z-20 my-12 md:my-0"
    >
      {/* Animated Line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 w-full h-full bg-accent origin-left scale-x-0 shadow-accent-glow"
      ></div>

      {/* Start Marker */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 border border-accent bg-paper rotate-45 transform -translate-x-1/2"></div>

      {/* End Marker */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 border border-accent bg-paper rotate-45 transform translate-x-1/2"></div>
    </div>
  );
};

export default SectionDivider;
