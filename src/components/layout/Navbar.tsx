'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ThemeMode } from '@/types';
import { MENU_ITEMS } from '@/lib/constants';
import { useSystemClock } from '@/hooks/useSystemClock';

interface NavbarProps {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const time = useSystemClock();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;

      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${scroll})`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(menuRef.current, {
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
        });

        gsap.from('.menu-link-wrapper', {
          x: -50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.out',
        });

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

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed HUD Bar - Glassmorphism */}
      <nav className="fixed top-0 left-0 w-full z-100 px-6 md:px-12 py-4 flex justify-between items-center glass-panel border-b border-ink/5 transition-colors duration-500">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isOpen ? 'bg-paper border border-ink' : 'bg-success animate-pulse'
            }`}
          ></div>
          <span className="font-mono text-xs font-bold tracking-widest text-ink">
            ANTON.SYS
          </span>
        </div>

        {/* Center Clock */}
        <div className="hidden md:block font-mono text-xs text-ink/60">
          JAKARTA_TIME :: {time}
        </div>

        <div className="flex items-center gap-6">
          {/* Theme Toggle */}
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
          >
            <span className="font-mono text-xs font-bold uppercase">
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>
            <div className="w-6 h-6 flex flex-col justify-center gap-1">
              <span
                className={`block w-full h-[2px] bg-current transition-transform ${
                  isOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              ></span>
              <span
                className={`block w-full h-[2px] bg-current transition-transform ${
                  isOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Scroll Progress Bar with Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-ink/10">
          <div
            ref={progressBarRef}
            className="h-full bg-accent origin-left transform scale-x-0"
            style={{ boxShadow: '0 0 10px var(--glow-mint)' }}
          ></div>
        </div>
      </nav>

      {/* Split-Screen Menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-90 bg-paper flex flex-col md:flex-row -translate-y-full overflow-hidden"
      >
        {/* LEFT: Navigation */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-start px-8 md:px-24 border-r border-ink/10 relative">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(var(--text-ink) 1px, transparent 1px), linear-gradient(90deg, var(--text-ink) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          ></div>

          <ul className="flex flex-col gap-4 relative z-10 w-full">
            {MENU_ITEMS.map((item) => (
              <li
                key={item.id}
                className="menu-link-wrapper overflow-hidden border-b border-ink/10 pb-2 w-full"
              >
                <button
                  onClick={() => handleLinkClick(item.id)}
                  className="w-full text-left text-2xl md:text-5xl font-serif font-bold uppercase hover:text-accent hover:pl-8 transition-all duration-300 flex items-baseline gap-6 group"
                >
                  <span className="text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    0{item.index}
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
                  href="mailto:email@example.com"
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink transition-colors"
                >
                  EMAIL_ENCRYPTED
                </a>
                <a
                  href="https://github.com/antonahmad-s"
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink transition-colors"
                >
                  GITHUB_REPO
                </a>
                <a
                  href="#"
                  className="border border-paper/20 p-4 hover:bg-accent hover:text-ink transition-colors"
                >
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
