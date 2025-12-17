'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Code2, TrendingUp } from 'lucide-react';
import { AboutPhoto } from './AboutPhoto';
import { AboutCard } from './AboutCard';
import { TechStack } from './TechStack';

/* ========================================
   ANIMATION VARIANTS - REUSABLE
   ======================================== */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const dividerVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: 'easeOut' },
  },
};

/* ========================================
   DATA CONSTANTS - EXTRACTED FOR TESTABILITY
   ======================================== */
const QA_SKILLS = [
  { icon: Shield, label: 'Risk Mitigation', color: 'text-ink' },
  { icon: User, label: 'Pixel-Perfect Validation', color: 'text-ink' },
  { icon: TrendingUp, label: 'User-Centric Empathy', color: 'text-ink' },
  { icon: Code2, label: 'Process Optimization', color: 'text-ink' },
] as const;

const TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind',
  'Hono',
  'GenAI',
] as const;

/* ========================================
   SKILLS LIST SUB-COMPONENT
   ======================================== */
const SkillsList: React.FC<{ skills: typeof QA_SKILLS }> = ({ skills }) => (
  <ul
    className="space-y-3 border-t border-ink/10 pt-4"
    role="list"
    aria-label="Quality Assurance core competencies"
  >
    {skills.map((skill) => {
      const Icon = skill.icon;
      return (
        <motion.li
          key={skill.label}
          className="flex items-center gap-2.5 font-mono text-xs text-ink group cursor-default"
          whileHover={{ x: 4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.div
            className={`
              flex items-center justify-center 
              border border-ink/20 
              bg-paper shadow-sm
              transition-all duration-300
              ${skill.color}
            `}
            style={{
              width: 'var(--space-2xl)',
              height: 'var(--space-2xl)',
            }}
            whileHover={{
              borderColor: 'var(--color-accent)',
              backgroundColor:
                'color-mix(in oklch, var(--color-accent) 10%, transparent)',
              boxShadow: '2px 2px 0px var(--color-accent)',
            }}
          >
            <Icon size={14} />
          </motion.div>
          <span className="font-bold tracking-tight">{skill.label}</span>
        </motion.li>
      );
    })}
  </ul>
);

/* ========================================
   MAIN ABOUT COMPONENT
   ======================================== */
export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="min-h-screen py-8 px-6 md:px-12 pb-16 bg-paper relative z-10 overflow-hidden flex flex-col justify-center"
      aria-labelledby="about-heading"
    >
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
        {/* Section Header */}
        <header className="mb-6 flex flex-col md:flex-row items-baseline justify-between border-b border-ink/20 pb-3">
          <h2
            id="about-heading"
            className="text-3xl md:text-4xl font-serif font-bold uppercase tracking-tight text-ink"
          >
            System <span className="text-accent">Identity</span>
          </h2>
        </header>

        {/* Animated Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative flex-1 min-h-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Vertical Dividers */}
          <motion.div
            className="absolute left-1/3 top-0 bottom-0 w-px bg-ink/10 hidden md:block -translate-x-1/2 origin-top"
            variants={dividerVariants}
            aria-hidden="true"
          />
          <motion.div
            className="absolute left-2/3 top-0 bottom-0 w-px bg-ink/10 hidden md:block -translate-x-1/2 origin-top"
            variants={dividerVariants}
            aria-hidden="true"
          />

          {/* Column 1: Photo */}
          <motion.div variants={cardVariants}>
            <AboutPhoto />
          </motion.div>

          {/* Column 2: QA Foundation */}
          <motion.div variants={cardVariants}>
            <AboutCard
              label="CORE_FOUNDATION"
              number="01"
              title="The Guardian of Stability."
              description="Senior Quality Assurance Engineer with over five years of experience securing software reliability within the Fintech and E-commerce sectors. Proven ability to balance manual rigor with automation strategies (Selenium, Katalon), successfully reducing regression cycles by up to 40%."
            >
              <SkillsList skills={QA_SKILLS} />
            </AboutCard>
          </motion.div>

          {/* Column 3: AI Dev Evolution */}
          <motion.div variants={cardVariants}>
            <AboutCard
              label="NEW_EXPANSION"
              number="02"
              title="Compiling the Future."
              titleItalic
              description="Currently expanding technical scope into Full-Stack Development, applying expertise in React.js and AI integration to build quality-first web applications. Focused on delivering bug-free user experiences through precise testing and technical adaptability."
            >
              <TechStack technologies={TECH_STACK} />
            </AboutCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
