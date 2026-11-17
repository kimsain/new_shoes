'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CountedItem } from '@/types/filters';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface BrandRailProps {
  brands: CountedItem[];
  selected: Set<string>;
  total: number;
  onToggle: (brand: string) => void;
  onClear: () => void;
}

/**
 * 가로로 넘기는 브랜드 칩. 넘칠 때만 양쪽 화살표를 보여준다(마우스 환경).
 */
export default function BrandRail({ brands, selected, total, onToggle, onClear }: BrandRailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges]);

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  const allActive = selected.size === 0;

  return (
    <div className="group/rail relative">
      <div
        ref={scrollRef}
        onScroll={updateEdges}
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6"
        style={{
          maskImage: `linear-gradient(to right, ${edges.start ? 'black' : 'transparent'}, black 48px, black calc(100% - 48px), ${
            edges.end ? 'black' : 'transparent'
          })`,
        }}
        role="group"
        aria-label="브랜드"
      >
        <Chip label="전체" count={total} active={allActive} onClick={onClear} />
        {brands.map(({ name, count }) => (
          <Chip key={name} label={name} count={count} active={selected.has(name)} onClick={() => onToggle(name)} />
        ))}
      </div>

      <RailButton side="left" hidden={edges.start} onClick={() => scrollBy(-1)} />
      <RailButton side="right" hidden={edges.end} onClick={() => scrollBy(1)} />
    </div>
  );
}

function Chip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.96] ${
        active
          ? 'border-fg bg-fg text-canvas'
          : 'border-line-strong text-fg-2 hover:border-white/25 hover:text-fg'
      }`}
    >
      <span className="max-w-[180px] truncate">{label}</span>
      <span className={`tabular-nums text-[12px] ${active ? 'text-canvas/60' : 'text-fg-4'}`}>{count}</span>
    </button>
  );
}

function RailButton({ side, hidden, onClick }: { side: 'left' | 'right'; hidden: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={onClick}
      className={`absolute top-1/2 hidden h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-raised text-fg-2 shadow-lg transition-opacity duration-200 hover:text-fg [@media(hover:hover)]:grid ${
        side === 'left' ? '-left-2' : '-right-2'
      } ${hidden ? 'pointer-events-none opacity-0' : 'opacity-0 group-hover/rail:opacity-100'}`}
    >
      {side === 'left' ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
    </button>
  );
}
