'use client';

import React from 'react';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechStackProps {
  technologies: readonly string[];
}

export const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  return (
    <div
      className="relative p-5 bg-gradient-to-br from-ink/5 via-paper to-accent/10 border border-ink/10 rounded-sm overflow-hidden"
      role="region"
      aria-label="Technology stack"
    >
      {/* Decorative Elements */}
      <div
        className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-ink/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 20px, currentColor 20px, currentColor 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, currentColor 20px, currentColor 21px)',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-4 bg-accent/20 border border-accent/40 flex items-center justify-center">
          <Code2 size={10} className="text-accent" />
        </div>
        <span className="font-mono text-[9px] text-ink/60 uppercase tracking-[0.2em] font-bold">
          Stack_Exploration
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-ink/10 to-transparent" />
      </div>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {technologies.map((tech) => (
          <motion.span
            key={tech}
            className="group relative px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wide border border-ink text-ink bg-paper cursor-default"
            whileHover={{
              backgroundColor: 'var(--color-accent)',
              boxShadow: '2px 2px 0px var(--color-ink-light)',
              y: -2,
              x: -2,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {tech}
          </motion.span>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
        <div
          className="flex items-center gap-2 font-mono text-[10px] text-ink/60"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 bg-success rounded-full" />
            <motion.div
              className="absolute w-2 h-2 bg-success rounded-full opacity-75"
              animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="tracking-wide">
            LEARNING_MODE:{' '}
            <span className="text-success font-bold">ACTIVE</span>
          </span>
        </div>
        <div className="font-mono text-[8px] text-ink/30 uppercase tracking-wider">
          v2.0
        </div>
      </div>
    </div>
  );
};
