'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useTheme } from 'next-themes';
import { Mail, Github, Linkedin } from 'lucide-react';
import { ThemeMode } from '@/types';
import { MENU_ITEMS } from '@/lib/constants';
import { useSystemClock } from '@/hooks/useSystemClock';

/* ========================================
   TYPE DEFINITIONS
   ======================================== */

interface NavbarProps {
  theme?: ThemeMode;
  toggleTheme?: () => void;
  scrollToSection?: (id: string) => void;
}

/* ========================================
   NAVBAR COMPONENT
   ======================================== */

const Navbar: React.FC<NavbarProps> = ({ scrollToSection }) => {
  // Hooks
  const time = useSystemClock();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  /* ========================================
     SCROLL PROGRESS - OPTIMIZED WITH RAF
     ======================================== */

  const updateScrollProgress = useCallback(() => {
    if (!progressBarRef.current) return;

    const totalScroll = document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercent = windowHeight > 0 ? totalScroll / windowHeight : 0;

    // Use transform instead of width for better performance
    progressBarRef.current.style.transform = `scaleX(${scrollPercent})`;
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        scrollRafRef.current = requestAnimationFrame(() => {
          updateScrollProgress();
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
  }, [updateScrollProgress]);

  /* ========================================
     MENU ANIMATION - FIXED MEMORY LEAK
     ======================================== */

  useEffect(() => {
    if (!menuRef.current) return;

    // Kill existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Create new timeline
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
        });

        tl.to(menuRef.current, {
          y: 0,
          duration: 0.8,
        })
          .from(
            '.menu-link-wrapper',
            {
              x: -50,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
            },
            '-=0.5'
          )
          .from(
            '.diagnostic-item',
            {
              x: 50,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
            },
            '-=0.5'
          );

        timelineRef.current = tl;
      } else {
        // Close animation
        const tl = gsap.timeline({
          defaults: { ease: 'expo.inOut' },
        });

        tl.to(menuRef.current, {
          y: '-100%',
          duration: 0.8,
        });

        timelineRef.current = tl;
      }
    }, menuRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isOpen]);

  /* ========================================
     EVENT HANDLERS
     ======================================== */

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(
    (id: string) => {
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
    },
    [scrollToSection]
  );

  const handleThemeToggle = useCallback(() => {
    setTheme?.(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleLinkClick(id);
      }
    },
    [handleLinkClick]
  );

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

  // Obfuscated email
  const email = mounted ? atob('YW50b25haG1hZEBleGFtcGxlLmNvbQ==') : '';

  /* ========================================
     RENDER
     ======================================== */

  if (!mounted) {
    // Prevent hydration mismatch
    return (
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 glass-panel border-b border-ink/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest">
              ANTON.SYS
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* ========================================
          FIXED NAVIGATION BAR
          ======================================== */}
      <nav
        className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-4 flex justify-between items-center glass-panel border-b border-ink/5 transition-colors duration-500"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-2 group"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          aria-label="Return to homepage"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isOpen ? 'bg-paper border border-ink' : 'bg-success animate-pulse'
            }`}
            aria-hidden="true"
          />
          <span className="font-mono text-xs font-bold tracking-widest text-ink group-hover:text-accent transition-colors">
            ANTON.SYS
          </span>
        </a>

        {/* Center Clock - Hidden on mobile */}
        <div
          className="hidden md:block font-mono text-xs text-muted tabular-nums"
          aria-label={`Current time: ${time}`}
        >
          JAKARTA_TIME :: {time}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="group font-mono text-xs font-bold uppercase text-ink hover:text-accent transition-colors flex items-center gap-2"
            aria-label={
              theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            }
            title={theme === 'light' ? 'Enable Night Mode' : 'Enable Day Mode'}
          >
            <span className="hidden md:inline">
              {theme === 'light' ? 'DAY_MODE' : 'NIGHT_MODE'}
            </span>

            {theme === 'light' ? (
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
            ) : (
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
            )}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="group flex items-center gap-2 text-ink hover:text-accent transition-colors"
            aria-label={
              isOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isOpen}
            aria-controls="main-menu"
          >
            <span className="font-mono text-xs font-bold uppercase">
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>

            {/* Animated Hamburger Icon */}
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[5px]' : ''
                }`}
              />
              <span
                className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[5px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Scroll Progress Bar - FIXED Z-INDEX */}
        <div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-ink/10 overflow-hidden"
          role="progressbar"
          aria-label="Page scroll progress"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            ref={progressBarRef}
            className="h-full bg-accent origin-left transform scale-x-0 glow-mint-soft"
          />
        </div>
      </nav>

      {/* ========================================
          FULLSCREEN MENU OVERLAY
          ======================================== */}
      <div
        ref={menuRef}
        id="main-menu"
        className="fixed inset-0 z-40 bg-paper flex flex-col md:flex-row -translate-y-full overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="menu-title"
      >
        {/* LEFT: Navigation */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start px-8 md:px-24 border-r border-ink/10 relative">
          <h2 id="menu-title" className="sr-only">
            Navigation Menu
          </h2>
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--text-ink) 1px, transparent 1px), linear-gradient(90deg, var(--text-ink) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>

          <ul className="flex flex-col gap-4 relative z-10 w-full">
            {MENU_ITEMS.map((item, index) => (
              <li
                key={item.id}
                className="menu-link-wrapper overflow-hidden border-b border-ink/10 pb-2 w-full"
              >
                <button
                  onClick={() => handleLinkClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Navigate to ${item.label} section`}
                  className="w-full text-left text-2xl md:text-5xl font-serif font-bold uppercase hover:text-accent hover:pl-8 focus:pl-8 focus:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper transition-all duration-300 flex items-baseline gap-6 group"
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

        {/* RIGHT: Diagnostics */}
        <div className="hidden md:flex w-1/2 h-full bg-ink text-paper flex-col justify-center p-24 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(var(--color-accent) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <div className="relative z-10 space-y-12">
            <div className="diagnostic-item">
              <h3 className="font-mono text-accent text-xs mb-4">
                {'/// CURRENT_SESSION'}
              </h3>
              <div className="text-4xl font-serif">
                <span className="block">UPTIME: {time}</span>
                <span className="block text-gray-500 text-2xl">
                  JAKARTA, ID
                </span>
              </div>
            </div>

            <div className="diagnostic-item">
              <h3 className="font-mono text-accent text-xs mb-4">
                {'/// CONNECTIVITY'}
              </h3>
              <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                <a
                  href={`mailto:${email}`}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Send email to ${email}`}
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink focus:bg-accent focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-colors flex items-center gap-2"
                >
                  <Mail size={16} aria-hidden="true" />
                  EMAIL_ENCRYPTED
                </a>
                <a
                  href="https://github.com/antonahmad-s"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View GitHub profile (opens in new tab)"
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink focus:bg-accent focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-colors flex items-center gap-2"
                >
                  <Github size={16} aria-hidden="true" />
                  GITHUB_REPO
                </a>
                <a
                  href="https://linkedin.com/in/antonahmad"
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View LinkedIn profile (opens in new tab)"
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink focus:bg-accent focus:text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-colors flex items-center gap-2"
                >
                  <Linkedin size={16} aria-hidden="true" />
                  LINKEDIN_SIGNAL
                </a>
              </div>
            </div>

            <div className="diagnostic-item mt-12 pt-12 border-t border-paper/20">
              <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest flex justify-between">
                <span>CPU: NORMAL</span>
                <span>RAM: 45%</span>
                <span>NET: SECURE</span>
              </div>
              <div className="w-full h-1 bg-paper/10 mt-2">
                <div className="w-[45%] h-full bg-accent animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
