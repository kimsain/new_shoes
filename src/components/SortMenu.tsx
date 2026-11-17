'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { SortOption } from '@/types/filters';
import { CheckIcon, ChevronDownIcon, SortIcon } from './icons';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: '최신순' },
  { value: 'expiring', label: '만료 임박순' },
  { value: 'alphabetical', label: '이름순' },
];

interface SortMenuProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  /** 모바일에서는 아이콘만 보여준다 */
  compact?: boolean;
}

export default function SortMenu({ value, onChange, compact = false }: SortMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();
  const currentIndex = SORT_OPTIONS.findIndex((option) => option.value === value);
  const currentLabel = SORT_OPTIONS[currentIndex]?.label ?? '정렬';

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>('[aria-haspopup]')?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    itemRefs.current[Math.max(0, currentIndex)]?.focus();

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentIndex]);

  const moveFocus = (from: number, delta: number) => {
    const next = (from + delta + SORT_OPTIONS.length) % SORT_OPTIONS.length;
    itemRefs.current[next]?.focus();
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={compact ? `정렬: ${currentLabel}` : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-11 items-center gap-2 rounded-full bg-control text-[14px] font-medium text-fg transition-colors duration-200 hover:bg-control-hover ${
          compact ? 'w-11 justify-center' : 'pl-4 pr-3.5'
        } ${open ? 'bg-control-hover' : ''}`}
      >
        {compact ? (
          <SortIcon className="h-[18px] w-[18px]" />
        ) : (
          <>
            <span className="whitespace-nowrap">{currentLabel}</span>
            <ChevronDownIcon
              className={`h-4 w-4 text-fg-3 transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="정렬"
          className="menu-in absolute right-0 top-[calc(100%+8px)] z-50 w-44 rounded-2xl border border-line-strong bg-raised/95 p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl"
        >
          {SORT_OPTIONS.map((option, i) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    moveFocus(i, 1);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    moveFocus(i, -1);
                  } else if (e.key === 'Tab') {
                    setOpen(false);
                  }
                }}
                className={`flex h-10 w-full items-center justify-between rounded-xl px-3 text-left text-[14px] outline-none transition-colors duration-100 focus-visible:bg-white/[0.08] ${
                  active ? 'font-semibold text-fg' : 'text-fg-2 hover:bg-white/[0.06] hover:text-fg'
                }`}
              >
                {option.label}
                {active && <CheckIcon className="h-4 w-4 text-volt" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
