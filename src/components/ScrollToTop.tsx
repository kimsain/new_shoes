'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './icons';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 800);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="맨 위로"
      tabIndex={visible ? 0 : -1}
      className={`group fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-line-strong bg-raised/80 text-fg-2 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl transition-[opacity,transform,color] duration-200 ease-out hover:text-fg sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* 스크롤 진행 링 (scroll-driven animation 지원 브라우저) */}
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          className="progress-ring"
          cx="24"
          cy="24"
          r="22.5"
          fill="none"
          stroke="var(--color-volt)"
          strokeWidth="1.5"
          pathLength={100}
        />
      </svg>
      <ArrowUpIcon className="h-[18px] w-[18px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
    </button>
  );
}
