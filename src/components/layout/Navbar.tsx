'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, Github, Linkedin } from 'lucide-react';
import { ThemeMode } from '@/types';
import { MENU_ITEMS } from '@/lib/constants';
import { useSystemClock } from '@/hooks/useSystemClock';

/* ========================================
   TYPE DEFINITIONS
   ======================================== */

interface NavbarProps {
  theme: ThemeMode;
  toggleTheme: () => void;
  scrollToSection?: (id: string) => void;
}

/* ========================================
   NAVBAR COMPONENT - PRODUCTION READY
   ======================================== */

const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  scrollToSection,
}) => {
  // Hooks
  const time = useSystemClock();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ========================================
     SCROLL PROGRESS - OPTIMIZED WITH RAF
     ======================================== */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        scrollRafRef.current = requestAnimationFrame(() => {
          const totalScroll = document.documentElement.scrollTop;
          const windowHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${scroll})`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  /* ========================================
     MENU ANIMATION - FIXED MEMORY LEAK
     ======================================== */

  useEffect(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Main Container Reveal
        gsap.to(menuRef.current, {
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
        });

        // Left Side Content Stagger
        gsap.from('.menu-link-wrapper', {
          x: -50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out',
        });

        // Right Side Content Stagger
        gsap.from('.diagnostic-item', {
          x: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: 'power2.out',
        });
      } else {
        gsap.to(menuRef.current, {
          y: '-100%',
          duration: 0.8,
          ease: 'expo.inOut',
        });
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isOpen]);

  /* ========================================
     EVENT HANDLERS
     ======================================== */

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (id: string) => {
    setIsOpen(false);

    // Use provided scrollToSection if available (Lenis integration)
    if (scrollToSection) {
      scrollToSection(id);
      return;
    }

    // Fallback to native scroll
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Lock body scroll when menu open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Obfuscated email for security
  const email = mounted ? atob('YW50b25haG1hZEBleGFtcGxlLmNvbQ==') : '';

  /* ========================================
     SSR FALLBACK
     ======================================== */

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 w-full z-[70] px-6 md:px-12 py-4 bg-paper border-b border-ink/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-ink">
              ANTON.SYS
            </span>
          </div>
        </div>
      </nav>
    );
  }

  /* ========================================
     RENDER
     ======================================== */

  return (
    <>
      {/* ========================================
          FIXED HUD BAR
          ======================================== */}
      <nav
        className="fixed top-0 left-0 w-full z-[70] px-6 md:px-12 py-4 flex justify-between items-center bg-paper border-b border-ink/10 transition-colors duration-500"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo / Name */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="flex items-center gap-2 group"
          aria-label="Return to homepage"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isOpen ? 'bg-ink' : 'bg-success animate-pulse'
            }`}
            aria-hidden="true"
          />
          <span className="font-mono text-xs font-bold tracking-widest text-ink group-hover:text-accent transition-colors">
            ANTON.SYS
          </span>
        </a>

        {/* Center Clock (Hidden on mobile) */}
        <div
          className="hidden md:block font-mono text-xs text-ink/60 tabular-nums"
          aria-label={`Current time: ${time}`}
        >
          JAKARTA_TIME :: {time}
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="font-mono text-xs font-bold uppercase text-ink hover:text-accent transition-colors flex items-center gap-2"
            title="Toggle System Theme"
            aria-label={
              theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'
            }
          >
            {theme === 'light' ? (
              <>
                <span className="hidden md:inline">DAY_MODE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              </>
            ) : (
              <>
                <span className="hidden md:inline">NIGHT_MODE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                  />
                </svg>
              </>
            )}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="group flex items-center gap-2 text-ink hover:text-accent transition-colors"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isOpen}
            aria-controls="main-menu"
          >
            <span className="font-mono text-xs font-bold uppercase">
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <span
                className={`block w-full h-[2px] bg-current transition-transform duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              />
              <span
                className={`block w-full h-[2px] bg-current transition-transform duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 w-full h-[2px] bg-ink/10 overflow-hidden"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            ref={progressBarRef}
            className="h-full bg-accent origin-left transform scale-x-0 transition-transform will-change-transform"
          />
        </div>
      </nav>

      {/* ========================================
          SPLIT-SCREEN OVERLAY MENU
          ======================================== */}
      <div
        ref={menuRef}
        id="main-menu"
        className="fixed inset-0 z-[60] bg-paper flex flex-col md:flex-row translate-y-[-100%] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="menu-title"
      >
        {/* LEFT SIDE: Navigation */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start px-8 md:px-24 border-r border-ink/10 relative overflow-y-auto">
          <h2 id="menu-title" className="sr-only">
            Navigation Menu
          </h2>

          {/* Decorative Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--text-ink) 1px, transparent 1px), linear-gradient(90deg, var(--text-ink) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />

          <ul className="flex flex-col gap-4 relative z-10 w-full">
            {MENU_ITEMS.map((item, index) => (
              <li
                key={item.id}
                className="menu-link-wrapper overflow-hidden border-b border-ink/10 pb-2 w-full"
              >
                <button
                  onClick={() => handleLinkClick(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleLinkClick(item.id);
                    }
                  }}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Navigate to ${item.label} section`}
                  className="w-full text-left text-2xl md:text-5xl font-serif font-bold uppercase text-ink hover:text-accent focus:text-accent hover:pl-8 focus:pl-8 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper transition-all duration-300 flex items-baseline gap-6 group"
                >
                  <span className="text-xs font-mono text-accent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE: System Diagnostics */}
        <div className="hidden md:flex w-1/2 h-full bg-ink text-paper flex-col justify-center p-24 relative overflow-y-auto">
          {/* Decorative Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(var(--color-accent) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-12">
            {/* Current Session */}
            <div className="diagnostic-item">
              <h3 className="font-mono text-accent text-xs mb-4 tracking-wider">
                {'/// CURRENT_SESSION'}
              </h3>
              <div className="space-y-2">
                <div className="text-4xl font-serif font-bold">
                  UPTIME: {time}
                </div>
                <div className="text-muted text-2xl font-serif italic">
                  JAKARTA, ID
                </div>
              </div>
            </div>

            {/* Connectivity */}
            <div className="diagnostic-item">
              <h3 className="font-mono text-accent text-xs mb-4 tracking-wider">
                {'/// CONNECTIVITY'}
              </h3>
              <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                <a
                  href={`mailto:${email}`}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Send email to ${email}`}
                  className="border border-paper/20 p-4 hover:bg-paper hover:text-ink focus:bg-paper focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail size={16} aria-hidden="true" />
                  <span className="uppercase">EMAIL_ENCRYPTED</span>
                </a>
                <a
                  href="https://github.com/antonahmad-s"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View GitHub profile (opens in new tab)"
                  className="border border-paper/20 p-4 hover:bg-paper hover:text-ink focus:bg-paper focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Github size={16} aria-hidden="true" />
                  <span className="uppercase">GITHUB_REPO</span>
                </a>
                <a
                  href="https://linkedin.com/in/antonahmad"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View LinkedIn profile (opens in new tab)"
                  className="border border-paper/20 p-4 hover:bg-paper hover:text-ink focus:bg-paper focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  <span className="uppercase">LINKEDIN_SIGNAL</span>
                </a>
              </div>
            </div>

            {/* System Status with EST Badge */}
            <div className="diagnostic-item mt-12 pt-12 border-t border-paper/20 relative">
              {/* EST. 2020 Badge */}
              <div className="absolute -top-6 right-0 bg-accent text-ink px-3 py-1 font-mono text-[10px] font-bold tracking-widest">
                EST. 2020
              </div>

              <div className="font-mono text-[10px] text-muted uppercase tracking-widest flex justify-between mb-2">
                <span>CPU: NORMAL</span>
                <span>RAM: 45%</span>
                <span>NET: SECURE</span>
              </div>
              <div className="w-full h-1 bg-paper/10 overflow-hidden">
                <div className="w-[45%] h-full bg-accent animate-pulse" />
              </div>

              <div className="mt-6 font-mono text-[10px] text-muted uppercase tracking-widest text-right">
                SYSTEM STATUS: OPTIMAL
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
