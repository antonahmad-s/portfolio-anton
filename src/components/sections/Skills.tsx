'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for skill boxes
      gsap.from('.skill-box', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // Staggered reveal for skill tags
      gsap.from('.skill-tag', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-paper relative z-10"
    >
      <div className="max-w-400 mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4">
          Instrumentation
          <br />
          <span className="text-accent">Inventory</span>
        </h2>
        <div className="w-full h-[2px] bg-linear-to-r from-accent via-accent/50 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-400 mx-auto">
        {/* Automation Box - Glassmorphism */}
        <motion.div
          className="skill-box glass-panel p-8 relative hover-glow"
          whileHover={{
            y: -8,
            boxShadow: '0 20px 50px rgba(0, 255, 178, 0.2)',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-0 right-0 bg-accent text-paper px-4 py-1 font-mono text-xs font-bold rounded-bl-lg">
            AUTOMATION
          </div>
          <h3 className="font-mono text-xl mb-8 text-muted">
            {'/// SCRIPT_EXECUTION'}
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              'Katalon Studio',
              'Selenium Webdriver',
              'Java',
              'Cucumber BDD',
              'Groovy',
            ].map((skill) => (
              <motion.div
                key={skill}
                className="skill-tag group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="inline-block glass-panel-sm px-4 py-2 font-mono text-sm font-bold text-ink hover:bg-accent hover:text-paper transition-colors cursor-default">
                  {skill}
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-accent text-paper text-[10px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded">
                  STATUS: OPERATIONAL
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Manual Box - Glassmorphism */}
        <motion.div
          className="skill-box glass-panel p-8 relative hover-glow"
          whileHover={{
            y: -8,
            boxShadow: '0 20px 50px rgba(255, 0, 122, 0.15)',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-0 right-0 bg-accent-secondary text-paper px-4 py-1 font-mono text-xs font-bold rounded-bl-lg">
            MANUAL &amp; TOOLS
          </div>
          <h3 className="font-mono text-xl mb-8 text-muted">
            {'/// ANALOG_CONTROLS'}
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              'Postman (API)',
              'Toad Oracle (DB)',
              'Jira',
              'Silk Central',
              'Regression Testing',
              'UAT',
            ].map((skill) => (
              <motion.div
                key={skill}
                className="skill-tag group relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="inline-block glass-panel-sm px-4 py-2 font-mono text-sm font-bold text-ink hover:bg-accent-secondary hover:text-paper transition-colors cursor-default">
                  {skill}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
