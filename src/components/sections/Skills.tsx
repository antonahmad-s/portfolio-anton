'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, Info } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ========================================
   TYPE DEFINITIONS
   ======================================== */

interface Skill {
  name: string;
  icon?: React.ComponentType<{ size?: number }>;
  proficiency: 'expert' | 'advanced' | 'intermediate';
  description?: string;
}

interface SkillCategory {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: 'accent' | 'accent-secondary';
  skills: Skill[];
}

/* ========================================
   SKILLS DATA
   ======================================== */

const skillsData: SkillCategory[] = [
  {
    id: 'automation',
    title: 'AUTOMATION',
    subtitle: '/// SCRIPT_EXECUTION',
    badge: 'CORE',
    badgeColor: 'accent',
    skills: [
      {
        name: 'Katalon Studio',
        proficiency: 'expert',
        description: '4+ years building enterprise test frameworks',
      },
      {
        name: 'Selenium WebDriver',
        proficiency: 'expert',
        description: 'Custom framework development',
      },
      {
        name: 'Java',
        proficiency: 'advanced',
        description: 'OOP principles for test automation',
      },
      {
        name: 'Cucumber BDD',
        proficiency: 'advanced',
        description: 'Behavior-driven test scenarios',
      },
      {
        name: 'Groovy',
        proficiency: 'intermediate',
        description: 'Katalon custom keywords',
      },
    ],
  },
  {
    id: 'manual',
    title: 'MANUAL & TOOLS',
    subtitle: '/// ANALOG_CONTROLS',
    badge: 'ESSENTIAL',
    badgeColor: 'accent',
    skills: [
      {
        name: 'Postman API',
        proficiency: 'expert',
        description: 'RESTful API testing & automation',
      },
      {
        name: 'Toad Oracle DB',
        proficiency: 'advanced',
        description: 'Database validation & queries',
      },
      {
        name: 'Jira',
        proficiency: 'expert',
        description: 'Agile project management',
      },
      {
        name: 'Silk Central',
        proficiency: 'advanced',
        description: 'Test management platform',
      },
      {
        name: 'Regression Testing',
        proficiency: 'expert',
        description: 'End-to-end system validation',
      },
      {
        name: 'UAT',
        proficiency: 'expert',
        description: 'User acceptance coordination',
      },
    ],
  },
  {
    id: 'development',
    title: 'WEB DEVELOPMENT',
    subtitle: '/// NEW_PROTOCOLS',
    badge: 'LEARNING',
    badgeColor: 'accent',
    skills: [
      { name: 'Next.js 15', proficiency: 'advanced' },
      { name: 'React 19', proficiency: 'advanced' },
      { name: 'TypeScript', proficiency: 'advanced' },
      { name: 'Tailwind CSS v4', proficiency: 'expert' },
      { name: 'GSAP', proficiency: 'advanced' },
      { name: 'Hono', proficiency: 'intermediate' },
      { name: 'GenAI Integration', proficiency: 'intermediate' },
    ],
  },
];

/* ========================================
   SKILLS SECTION COMPONENT
   ======================================== */

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  /* ========================================
     GSAP ANIMATIONS - WITH CLEANUP
     ======================================== */

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Skill boxes stagger
      const boxesTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.from('.skill-box', {
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });

      // Skill tags stagger
      const tagsTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          gsap.from('.skill-tag', {
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: 'back.out(1.4)',
            clearProps: 'all',
          });
        },
      });

      scrollTriggersRef.current.push(boxesTrigger, tagsTrigger);
    }, sectionRef);

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
     PROFICIENCY INDICATOR
     ======================================== */

  const getProficiencyColor = (level: Skill['proficiency']) => {
    switch (level) {
      case 'expert':
        return 'bg-accent';
      case 'advanced':
        return 'bg-success';
      case 'intermediate':
        return 'bg-gray-400';
    }
  };

  const getProficiencyLabel = (level: Skill['proficiency']) => {
    switch (level) {
      case 'expert':
        return 'EXPERT';
      case 'advanced':
        return 'ADVANCED';
      case 'intermediate':
        return 'LEARNING';
    }
  };

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-24 px-6 md:px-12 bg-paper relative z-10"
      aria-labelledby="skills-heading"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2
          id="skills-heading"
          className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-ink"
        >
          Instrumentation
          <br />
          <span className="text-accent">Inventory</span>
        </h2>
        <div className="w-full h-[2px] bg-gradient-to-r from-accent via-accent/50 to-transparent" />
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-7xl mx-auto">
        {skillsData.map((category) => (
          <article
            key={category.id}
            className="skill-box glass-panel p-8 relative group hover:shadow-glow transition-all duration-500 hover:-translate-y-2"
            aria-labelledby={`category-${category.id}`}
          >
            {/* Badge */}
            <div
              className={`
                absolute top-0 right-0 
                px-4 py-1 
                font-mono text-xs font-bold 
                rounded-bl-lg
                ${
                  category.badgeColor === 'accent'
                    ? 'bg-accent text-ink'
                    : 'bg-accent-secondary text-paper'
                }
              `}
            >
              {category.badge}
            </div>

            {/* Category Header */}
            <h3
              id={`category-${category.id}`}
              className="font-mono text-xl mb-2 text-ink font-bold"
            >
              {category.title}
            </h3>
            <p className="font-mono text-sm mb-8 text-muted">
              {category.subtitle}
            </p>

            {/* Skills List */}
            <ul className="flex flex-wrap gap-3" role="list">
              {category.skills.map((skill) => {
                const isActive = activeTooltip === skill.name;
                return (
                  <li key={skill.name} className="skill-tag">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTooltip(isActive ? null : skill.name)
                      }
                      className={`
                        group relative flex flex-col items-start gap-2 
                        glass-panel-sm px-4 py-2 
                        font-mono text-sm font-bold text-ink 
                        transition-all duration-300 
                        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper
                        ${
                          isActive
                            ? 'bg-accent/10 ring-1 ring-accent scale-100 z-10'
                            : 'hover:scale-105 active:scale-95 hover:bg-white/50'
                        }
                      `}
                      aria-label={`${
                        skill.name
                      }, proficiency: ${getProficiencyLabel(
                        skill.proficiency
                      )}`}
                      aria-expanded={isActive}
                    >
                      {/* Header Line */}
                      <div className="flex items-center gap-2 w-full">
                        <span
                          className={`
                            w-2 h-2 rounded-full shrink-0
                            ${getProficiencyColor(skill.proficiency)}
                            ${
                              isActive
                                ? 'animate-none shadow-[0_0_8px_currentColor]'
                                : 'animate-pulse'
                            }
                          `}
                          aria-hidden="true"
                        />
                        <span className="group-hover:text-accent transition-colors">
                          {skill.name}
                        </span>
                        {skill.description && (
                          <Info
                            size={12}
                            className={`ml-auto shrink-0 transition-transform duration-300 ${
                              isActive
                                ? 'rotate-180 text-accent'
                                : 'text-muted group-hover:text-accent'
                            }`}
                          />
                        )}
                      </div>

                      {/* Expanded Content (Inline to prevent overlap) */}
                      {skill.description && isActive && (
                        <div className="mt-2 pt-2 border-t border-ink/10 w-full text-left">
                          <span className="block text-[10px] font-bold text-accent mb-1 uppercase tracking-wider">
                            {getProficiencyLabel(skill.proficiency)}
                          </span>
                          <p className="text-xs text-muted font-normal leading-relaxed">
                            {skill.description}
                          </p>
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Category Summary */}
            <div className="mt-6 pt-6 border-t border-ink/10 flex items-center justify-between">
              <span className="font-mono text-xs text-muted uppercase tracking-wider">
                {category.skills.length} PROTOCOLS
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-success" />
                <span className="font-mono text-xs text-success uppercase">
                  OPERATIONAL
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-ink/10">
        <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
          <span className="text-muted uppercase tracking-wider">
            PROFICIENCY_LEGEND:
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-ink">EXPERT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-ink">ADVANCED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <span className="text-ink">LEARNING</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
