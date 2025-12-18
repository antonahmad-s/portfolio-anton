'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Mail, Github, Linkedin } from 'lucide-react';
import { ThemeMode } from '@/types';
import { MENU_ITEMS, CONTACT } from '@/lib/constants';
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
   NAVBAR COMPONENT - HYDRATION SAFE
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
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);

  // Prevent hydration mismatch - Two-phase mounting
  useEffect(() => {
    setMounted(true);
    // Set hydrated flag after paint
    requestAnimationFrame(() => {
      setIsHydrated(true);
    });
  }, []);

  /* ========================================
     SCROLL PROGRESS - OPTIMIZED WITH RAF
     ======================================== */

  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted]);

  /* ========================================
     MENU ANIMATION - FIXED MEMORY LEAK
     ======================================== */

  useEffect(() => {
    if (!menuRef.current || !isHydrated) return;

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
  }, [isOpen, isHydrated]);

  /* ========================================
     EVENT HANDLERS
     ======================================== */

  const toggleMenu = () => setIsOpen((prev) => !prev);

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

  // Lock body scroll when menu open & Keyboard accessibility
  useEffect(() => {
    if (!mounted) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  // Obfuscated email for security - Only after hydration
  const email = isHydrated ? atob('YW50b25haG1hZHN1c2lsb0BnbWFpbC5jb20=') : '';

  /* ========================================
     SSR FALLBACK - Static Placeholder
     ======================================== */

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 w-full z-[70] px-6 md:px-12 py-4 bg-paper/95 backdrop-blur-md border-b border-ink/10 supports-[backdrop-filter]:bg-paper/80">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-ink">
              ANTON.A.SUSILO
            </span>
          </div>
          {/* Static clock placeholder to prevent hydration mismatch */}
          <div className="hidden md:block font-mono text-xs text-ink/60 tabular-nums">
            JAKARTA_TIME :: --:--:--
          </div>
          <div className="flex items-center gap-6">
            <button className="font-mono text-xs font-bold uppercase text-ink">
              <span className="hidden md:inline">DAY_MODE</span>
            </button>
            <button className="font-mono text-xs font-bold uppercase text-ink">
              MENU
            </button>
          </div>
        </div>
      </nav>
    );
  }

  /* ========================================
     CLIENT-SIDE RENDER - After Hydration
     ======================================== */

  return (
    <>
      {/* ========================================
          FIXED HUD BAR WITH GLASSMORPHISM
          ======================================== */}
      <nav
        className={`fixed top-0 left-0 w-full z-[70] px-6 md:px-12 py-4 flex justify-between items-center
          bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80
          border-b border-ink/10 transition-all duration-500 will-change-[opacity,backdrop-filter]
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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
            ANTON.A.SUSILO
          </span>
        </a>

        {/* Center Clock - Only show after hydration */}
        <div
          className="hidden md:block font-mono text-xs text-ink/60 tabular-nums"
          aria-label={`Current time: ${time}`}
          suppressHydrationWarning
        >
          JAKARTA_TIME :: {isHydrated ? time : '--:--:--'}
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="font-mono text-xs font-bold uppercase text-ink hover:text-accent transition-colors flex items-center gap-2 
              focus-visible:outline-none focus-visible:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
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
            className="group flex items-center gap-2 text-ink hover:text-accent transition-colors
              focus-visible:outline-none focus-visible:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm"
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isOpen}
            aria-controls="main-menu"
          >
            <span className="font-mono text-xs font-bold uppercase">
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <span
                className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              />
              <span
                className={`block w-full h-0.5 bg-current transition-transform duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Scroll Progress Bar */}
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
        className={`fixed inset-0 z-[80] 
          bg-paper/95 backdrop-blur-xl supports-[backdrop-filter]:bg-paper/85
          border-b border-ink/10 flex flex-col md:flex-row
          pointer-events-auto will-change-transform h-screen overflow-hidden ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
        aria-labelledby="menu-title"
      >
        {/* ========================================
            CLOSE BUTTON - FIXED VISIBILITY
            ======================================== */}
        <button
          onClick={toggleMenu}
          tabIndex={isOpen ? 0 : -1}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-[90] 
            font-mono text-xs font-bold uppercase 
            menu-close-btn
            flex items-center gap-2"
          aria-label="Close menu"
        >
          <span>CLOSE</span>
          <div className="w-6 h-6 relative">
            <span className="absolute inset-x-0 top-2 h-0.5 bg-current rotate-45" />
            <span className="absolute inset-x-0 top-2 h-0.5 bg-current -rotate-45" />
          </div>
        </button>

        {/* ========================================
            LEFT SIDE: Navigation (Follows Theme)
            ======================================== */}
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
              backgroundSize: 'var(--grid-pattern-sm) var(--grid-pattern-sm)',
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
                  className="w-full text-left text-2xl md:text-5xl font-serif font-bold uppercase text-ink 
                    hover:text-accent hover:pl-8 
                    focus-visible:text-accent focus-visible:pl-8 focus-visible:outline-none
                    transition-all duration-300 flex items-baseline gap-6 group"
                >
                  <span className="text-xs font-mono text-accent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ========================================
            RIGHT SIDE: INVERTED THEME (CSS Variables)
            ======================================== */}
        <div className="hidden md:flex w-1/2 h-screen panel-inverted flex-col justify-center px-12 py-8 relative overflow-hidden transition-colors duration-500">
          {/* Decorative Background - CSS Variable */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(var(--panel-dot-pattern) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />

          {/* Content Container - Optimized Spacing */}
          <div className="relative z-10 space-y-8 max-w-lg mx-auto w-full">
            {/* ========================================
                CURRENT SESSION
                ======================================== */}
            <div className="diagnostic-item">
              <h3 className="font-mono text-xs mb-3 tracking-wider panel-inverted-accent">
                {'/// CURRENT_SESSION'}
              </h3>
              <div className="space-y-1">
                <div
                  className="text-3xl font-serif font-bold"
                  suppressHydrationWarning
                >
                  UPTIME: {isHydrated ? time : '--:--:--'}
                </div>
                <div className="text-xl font-serif italic panel-inverted-muted">
                  JAKARTA, ID
                </div>
              </div>
            </div>

            {/* ========================================
                CONNECTIVITY
                ======================================== */}
            <div className="diagnostic-item">
              <h3 className="font-mono text-xs mb-3 tracking-wider panel-inverted-accent">
                {'/// CONNECTIVITY'}
              </h3>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <a
                  href={`mailto:${email}`}
                  tabIndex={isOpen ? 0 : -1}
                  aria-label={`Send email to ${email}`}
                  className="border panel-inverted-border p-3 panel-inverted-hover flex items-center justify-center gap-2"
                >
                  <Mail size={14} aria-hidden="true" />
                  <span className="uppercase">EMAIL</span>
                </a>
                <a
                  href={CONTACT.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View GitHub profile (opens in new tab)"
                  className="border panel-inverted-border p-3 panel-inverted-hover flex items-center justify-center gap-2"
                >
                  <Github size={14} aria-hidden="true" />
                  <span className="uppercase">GITHUB</span>
                </a>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={isOpen ? 0 : -1}
                  aria-label="View LinkedIn profile (opens in new tab)"
                  className="border panel-inverted-border p-3 panel-inverted-hover flex items-center justify-center gap-2 col-span-2"
                >
                  <Linkedin size={14} aria-hidden="true" />
                  <span className="uppercase">LINKEDIN</span>
                </a>
              </div>
            </div>

            {/* ========================================
                PORTFOLIO METRICS - COMPACT
                ======================================== */}
            <div className="diagnostic-item pt-8 border-t panel-inverted-border relative">
              {/* EST. 2020 Badge */}
              <div className="absolute -top-4 right-0 px-3 py-1 font-mono text-[10px] font-bold tracking-widest bg-accent text-black">
                EST. 2020
              </div>

              {/* Portfolio Impact Stats - Compact */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[9px] uppercase tracking-widest panel-inverted-muted">
                    Projects Delivered
                  </span>
                  <span className="text-2xl font-serif font-bold">25+</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[9px] uppercase tracking-widest panel-inverted-muted">
                    Years Experience
                  </span>
                  <span className="text-2xl font-serif font-bold">5</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[9px] uppercase tracking-widest panel-inverted-muted">
                    Client Satisfaction
                  </span>
                  <span className="text-2xl font-serif font-bold">100%</span>
                </div>
              </div>

              {/* Progress Bar Visual */}
              <div className="mt-6 w-full h-1 overflow-hidden panel-inverted-bar">
                <div className="w-full h-full animate-pulse panel-inverted-bar-fill" />
              </div>

              <div className="mt-4 font-mono text-[9px] uppercase tracking-widest text-right panel-inverted-muted">
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
