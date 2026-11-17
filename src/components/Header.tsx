'use client';

import { useEffect, useRef, useState } from 'react';
import { DATA_URL, GITHUB_URL } from '@/constants';
import { LogoMark, ArrowUpRightIcon, GitHubIcon } from './icons';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const root = document.documentElement;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 12);

      // 모바일에서만 아래로 스크롤하면 숨긴다 (CSS가 1024px 미만에서만 적용)
      const delta = currentY - lastScrollY.current;
      if (currentY < 80) {
        root.dataset.headerHidden = 'false';
      } else if (delta > 6) {
        root.dataset.headerHidden = 'true';
      } else if (delta < -6) {
        root.dataset.headerHidden = 'false';
      }
      lastScrollY.current = currentY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50" data-scrolled={scrolled}>
      <div className="site-header-bg absolute inset-0 border-b border-line bg-canvas/75 backdrop-blur-xl backdrop-saturate-150" />
      <div className="relative mx-auto flex h-16 max-w-[1400px] items-center px-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5" aria-label="DevShoes 처음으로">
          <LogoMark className="h-8 w-8 transition-transform duration-300 ease-spring group-hover:rotate-[-8deg]" />
          <span className="text-[16px] font-bold tracking-[-0.03em] text-fg">DevShoes</span>
        </a>

        <nav className="ml-auto flex items-center gap-1.5" aria-label="외부 링크">
          <a
            href={DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium text-fg-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
          >
            <span>원본 목록</span>
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub 저장소"
            className="grid h-10 w-10 place-items-center rounded-full text-fg-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
          >
            <GitHubIcon className="h-[18px] w-[18px]" />
          </a>
        </nav>
      </div>
    </header>
  );
}
