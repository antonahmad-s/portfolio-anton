'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const WORDS = [
  'SELENIUM',
  'GHERKIN',
  'PLAYWRIGHT',
  'BUG',
  'AI',
  'TIMEOUT',
  'KATALON',
  'POSTMAN',
  'GEMINI',
  'ANTIGRAVITY',
  'CHATGPT',
  'PERPLEXITY',
  'CLAUDE',
  'JAVA',
  'ORACLE',
  'DEBUG',
  'TRACE',
  'DEPLOY',
  'PIPELINE',
  'SCRUM',
  'JIRA',
] as const;

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power4.inOut',
            onComplete: onComplete,
          });
        },
      });

      const words = textContainerRef.current?.children;
      if (words) {
        // Initial chaotic state
        gsap.set(words, {
          x: () => Math.random() * window.innerWidth - window.innerWidth / 2,
          y: () => Math.random() * window.innerHeight - window.innerHeight / 2,
          rotation: () => Math.random() * 90 - 45,
          opacity: 0,
          scale: 0.5,
        });

        // Fade in
        tl.to(words, {
          opacity: 1,
          duration: 0.5,
          stagger: { amount: 0.5, from: 'random' },
        });

        // Converge to grid
        tl.to(
          words,
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.05,
          },
          '+=0.2'
        );

        // Progress counter
        tl.to(
          {},
          {
            duration: 1,
            onUpdate: function () {
              setProgress(Math.round(this.progress() * 100));
            },
          },
          '<'
        );

        // Color transition
        tl.to(words, {
          color: 'var(--color-preloader-text)',
          duration: 0.1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden cursor-wait"
      style={{ backgroundColor: 'var(--bg-paper)' }}
    >
      {/* Progress Counter - Fixed position */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs"
        style={{ color: 'var(--text-ink)' }}
      >
        LOAD_CAPACITY: {progress}%
      </div>

      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Words Grid - Responsive & Centered */}
      <div className="w-full max-w-6xl px-6 flex items-center justify-center">
        <div
          ref={textContainerRef}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 md:gap-6 lg:gap-8 w-full"
          role="status"
          aria-live="polite"
          aria-label="Loading application"
        >
          {WORDS.map((word, i) => (
            <div
              key={`${word}-${i}`}
              className="font-mono text-xs sm:text-sm md:text-base font-bold text-center flex items-center justify-center min-h-[2rem]"
              style={{ color: 'var(--text-muted)' }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
