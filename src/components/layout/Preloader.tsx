'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const WORDS = [
  'SELENIUM',
  'GHERKIN',
  'ASSERT',
  'TIMEOUT',
  'KATALON',
  'POSTMAN',
  'JAVA',
  'ORACLE',
  'DEBUG',
  'TRACE',
  'DEPLOY',
  'PIPELINE',
  'SCRUM',
  'JIRA',
];

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
        gsap.set(words, {
          x: () => Math.random() * window.innerWidth - window.innerWidth / 2,
          y: () => Math.random() * window.innerHeight - window.innerHeight / 2,
          rotation: () => Math.random() * 90 - 45,
          opacity: 0,
          scale: 0.5,
        });

        tl.to(words, {
          opacity: 1,
          duration: 0.5,
          stagger: { amount: 0.5, from: 'random' },
        }).to(
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
      className="fixed inset-0 z-[100] bg-paper flex items-center justify-center overflow-hidden cursor-wait"
    >
      <div className="absolute top-4 left-4 font-mono text-xs text-ink/50">
        STATUS: CALIBRATING_BLUEPRINT
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-xs text-ink">
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
      ></div>

      <div
        ref={textContainerRef}
        className="grid grid-cols-4 md:grid-cols-7 gap-4 md:gap-8 w-full max-w-4xl px-4"
      >
        {WORDS.map((word, i) => (
          <div
            key={i}
            className="font-mono text-sm md:text-base font-bold text-gray-400 text-center border border-transparent"
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Preloader;
