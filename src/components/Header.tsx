'use client';

import { useState, useEffect } from 'react';
import { ACCENT, BUTTON } from '@/styles/tokens';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
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

        {/* Center - Status */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-indigo-300">Synced</span>
          </div>
        </div>

        {/* Right - Links */}
        <div className="flex items-center gap-3">
          {/* Keyboard shortcut hint */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white/[0.06] rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-white/[0.06] rounded">K</kbd>
          </div>

          <a
            href="https://certcheck.worldathletics.org/FullList"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${BUTTON.secondary.bg} border ${BUTTON.secondary.border} text-sm text-zinc-400 ${BUTTON.secondary.hover} transition-all duration-300`}
          >
            <span className="hidden sm:inline">Source</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
