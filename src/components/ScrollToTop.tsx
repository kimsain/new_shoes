'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="맨 위로 스크롤"
      className={`fixed right-6 z-40 w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.08] text-zinc-400 flex items-center justify-center transition-all duration-300 hover:text-white hover:border-indigo-500/50 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:scale-110 active:scale-95 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
