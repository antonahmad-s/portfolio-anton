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
   SKILLS DATA - ADDED DESCRIPTIONS
   ======================================== */

const skillsData: SkillCategory[] = [
  {
    id: 'automation',
    title: 'TESTING & AUTOMATION',
    subtitle: '/// SCRIPT_EXECUTION',
    badge: 'CORE',
    badgeColor: 'accent',
    skills: [
      {
        name: 'Manual Testing (UI/API)',
        proficiency: 'expert',
        description:
          '5+ years experience in functional, regression, and exploratory testing',
      },
      {
        name: 'Selenium',
        proficiency: 'advanced',
        description:
          'Advanced WebDriver automation with Page Object Model pattern',
      },
      {
        name: 'Katalon Studio',
        proficiency: 'advanced',
        description:
          'Full-stack test automation framework with custom scripting',
      },
      {
        name: 'Playwright',
        proficiency: 'intermediate',
        description: 'Modern E2E testing with cross-browser support',
      },
      {
        name: 'Postman (API Testing)',
        proficiency: 'expert',
        description:
          'RESTful API validation, collections, and automated test suites',
      },
      {
        name: 'Cucumber (BDD)',
        proficiency: 'advanced',
        description: 'Behavior-driven testing with Gherkin syntax',
      },
      {
        name: 'JIRA',
        proficiency: 'expert',
        description:
          'Defect tracking, sprint planning, and test case management',
      },
      {
        name: 'TestRail',
        proficiency: 'expert',
        description: 'Test case repository and test execution reporting',
      },
      {
        name: 'Bugzilla',
        proficiency: 'expert',
        description: 'Bug tracking and issue management',
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
      {
        name: 'HTML5',
        proficiency: 'advanced',
        description: 'Semantic markup and accessibility best practices',
      },
      {
        name: 'CSS3',
        proficiency: 'advanced',
        description: 'Flexbox, Grid, animations, and modern CSS features',
      },
      {
        name: 'JavaScript (ES6+)',
        proficiency: 'intermediate',
        description:
          'Modern JS with async/await, modules, and functional programming',
      },
      {
        name: 'React.js',
        proficiency: 'intermediate',
        description: 'Component architecture with hooks and context API',
      },
      {
        name: 'Next.js',
        proficiency: 'intermediate',
        description: 'Server-side rendering and static site generation',
      },
      {
        name: 'Node.js',
        proficiency: 'intermediate',
        description: 'Backend API development and server scripting',
      },
      {
        name: 'Responsive Design',
        proficiency: 'advanced',
        description: 'Mobile-first design with cross-device compatibility',
      },
    ],
  },
  {
    id: 'tools',
    title: 'TOOLS & DATABASE',
    subtitle: '/// INFRASTRUCTURE',
    badge: 'ESSENTIAL',
    badgeColor: 'accent',
    skills: [
      {
        name: 'Git/GitHub',
        proficiency: 'advanced',
        description: 'Version control, branching strategies, and code reviews',
      },
      {
        name: 'SQL (Oracle/MySQL/Postgre)',
        proficiency: 'advanced',
        description: 'Query optimization and database design',
      },
      {
        name: 'CI/CD Concepts',
        proficiency: 'intermediate',
        description: 'Automated build, test, and deployment pipelines',
      },
      {
        name: 'Agile Scrum',
        proficiency: 'expert',
        description:
          'Sprint ceremonies, story pointing, and iterative delivery',
      },
      {
        name: 'Waterfall',
        proficiency: 'expert',
        description: 'Traditional sequential project management',
      },
      {
        name: 'SDLC',
        proficiency: 'expert',
        description: 'Full software development lifecycle management',
      },
      {
        name: 'STLC',
        proficiency: 'expert',
        description: 'Complete software testing lifecycle processes',
      },
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
      const boxesTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const animDistance = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--animation-distance-md'
            )
          );
          gsap.from('.skill-box', {
            y: animDistance,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            clearProps: 'all',
          });
        },
      });

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
        return 'bg-[color:var(--color-proficiency-expert)]';
      case 'advanced':
        return 'bg-[color:var(--color-proficiency-advanced)]';
      case 'intermediate':
        return 'bg-[color:var(--color-proficiency-intermediate)]';
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
     CLICK HANDLER WITH LOGGING
     ======================================== */

  const handleSkillClick = (skillName: string) => {
    setActiveTooltip((prev) => (prev === skillName ? null : skillName));
  };

  /* ========================================
     RENDER
     ======================================== */

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen py-6 px-6 md:px-12 pb-12 bg-paper relative z-10 flex flex-col justify-start"
      aria-labelledby="skills-heading"
    >
      {/* Section Header - Left Aligned */}
      <div className="w-full mb-6">
        <h2
          id="skills-heading"
          className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold uppercase mb-2 text-ink"
        >
          Instrumentation
          <br />
          <span className="text-accent">Inventory</span>
        </h2>
        <div
          className="w-full bg-gradient-to-r from-accent via-accent/50 to-transparent"
          style={{
            maxWidth: 'var(--container-2xl)',
            height: 'var(--space-3xs)',
          }}
        />
      </div>

      {/* Skills Grid - Fixed Click Events */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {skillsData.map((category) => (
              <article
                key={category.id}
                className="skill-box glass-panel p-6 relative group hover:shadow-glow transition-all duration-500 hover:-translate-y-1 flex flex-col w-full"
                aria-labelledby={`category-${category.id}`}
              >
                {/* Badge */}
                <div
                  className={`
                    absolute top-0 right-0 
                    px-3 py-1 
                    font-mono text-xs font-bold 
                    rounded-bl-lg
                    ${
                      category.badgeColor === 'accent'
                        ? 'bg-accent text-black'
                        : 'bg-accent-secondary text-paper'
                    }
                  `}
                >
                  {category.badge}
                </div>

                {/* Category Header */}
                <h3
                  id={`category-${category.id}`}
                  className="font-mono text-lg md:text-xl mb-1 text-ink font-bold"
                >
                  {category.title}
                </h3>
                <p className="font-mono text-xs md:text-sm mb-4 text-muted">
                  {category.subtitle}
                </p>

                {/* Skills List - Fixed with pointer-events */}
                <div className="flex-1 min-h-0">
                  <div className="h-full overflow-visible pr-2">
                    <ul className="flex flex-wrap gap-2 pb-2" role="list">
                      {category.skills.map((skill) => {
                        const isActive = activeTooltip === skill.name;
                        return (
                          <li key={skill.name} className="skill-tag">
                            <button
                              type="button"
                              onClick={() => handleSkillClick(skill.name)}
                              className={`
                                relative flex flex-col items-start gap-1.5 
                                glass-panel-sm px-3 py-1.5 
                                font-mono text-xs font-bold text-ink 
                                transition-all duration-300 
                                cursor-pointer
                                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-paper
                                ${
                                  isActive
                                    ? 'bg-accent/10 ring-1 ring-accent z-20'
                                    : 'hover:scale-105 active:scale-95 hover:bg-white/50 z-10'
                                }
                              `}
                              aria-label={`${
                                skill.name
                              }, proficiency: ${getProficiencyLabel(
                                skill.proficiency
                              )}. Click to ${
                                isActive ? 'close' : 'view'
                              } details`}
                              aria-expanded={isActive}
                            >
                              {/* Header Line */}
                              <div className="flex items-center gap-2 w-full pointer-events-none">
                                <span
                                  className={`
                                    w-1.5 h-1.5 rounded-full shrink-0
                                    ${getProficiencyColor(skill.proficiency)}
                                    ${
                                      isActive
                                        ? 'animate-none shadow-[0_0_6px_currentColor]'
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
                                    size={10}
                                    className={`ml-auto shrink-0 transition-transform duration-300 ${
                                      isActive
                                        ? 'rotate-180 text-accent'
                                        : 'text-muted group-hover:text-accent'
                                    }`}
                                  />
                                )}
                              </div>

                              {/* Expanded Content */}
                              {skill.description && isActive && (
                                <div className="mt-1.5 pt-1.5 border-t border-ink/10 w-full text-left pointer-events-none">
                                  <span
                                    className="block font-bold text-accent mb-0.5 uppercase tracking-wider"
                                    style={{ fontSize: 'var(--text-2xs)' }}
                                  >
                                    {getProficiencyLabel(skill.proficiency)}
                                  </span>
                                  <p
                                    className="text-muted font-normal leading-relaxed"
                                    style={{ fontSize: 'var(--text-2xs)' }}
                                  >
                                    {skill.description}
                                  </p>
                                </div>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Category Summary */}
                <div className="mt-4 pt-4 border-t border-ink/10 flex items-center justify-between shrink-0">
                  <span
                    className="font-mono text-muted uppercase tracking-wider"
                    style={{ fontSize: 'var(--text-2xs)' }}
                  >
                    {category.skills.length} PROTOCOLS
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success" />
                    <span className="font-mono text-[10px] text-success uppercase">
                      OPERATIONAL
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full pt-4 border-t border-ink/10 mt-auto shrink-0">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[10px]">
          <span className="text-muted uppercase tracking-wider">
            PROFICIENCY_LEGEND:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-ink">EXPERT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-ink">ADVANCED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
            <span className="text-ink">LEARNING</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
