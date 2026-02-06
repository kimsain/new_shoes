'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ACCENT, BUTTON } from '@/styles/tokens';
import { DATA_URL } from '@/constants';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const isMobile = useRef(false);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 10);

    // Only hide/show on mobile
    if (!isMobile.current) {
      setHidden(false);
      lastScrollY.current = currentY;
      return;
    }

    // Always show at top of page
    if (currentY < 50) {
      setHidden(false);
      lastScrollY.current = currentY;
      return;
    }

    const delta = currentY - lastScrollY.current;

    if (delta > 5) {
      // Scrolling down - hide
      setHidden(true);
    } else if (delta < -5) {
      // Scrolling up - show
      setHidden(false);
    }

    lastScrollY.current = currentY;
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth < 1024;
      // If switching to desktop, make sure header is visible
      if (!isMobile.current) {
        setHidden(false);
      }
    };

    checkMobile();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
      style={{
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center relative">
        {/* Logo - Left */}
        <a href="#" className="flex items-center gap-3 group">
          <div className={`relative w-9 h-9 rounded-xl ${ACCENT.gradient.bg} flex items-center justify-center shadow-lg ${ACCENT.glow.sm} group-hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] transition-all duration-300`}>
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-sm leading-tight tracking-tight">DevShoes</span>
            <span className="text-[10px] text-zinc-500 leading-tight">World Athletics</span>
          </div>
        </a>

        {/* Right - Links */}
        <div className="flex items-center gap-3 ml-auto">
          <a
            href={DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl ${BUTTON.secondary.bg} border ${BUTTON.secondary.border} text-sm text-zinc-400 ${BUTTON.secondary.hover} transition-all duration-300`}
          >
            <span className="hidden sm:inline">원본</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
