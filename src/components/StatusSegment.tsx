'use client';

import type { CSSProperties } from 'react';
import { StatusFilter } from '@/types/filters';

export const STATUS_OPTIONS: { value: StatusFilter; label: string; dot?: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'valid', label: '유효', dot: 'bg-volt' },
  { value: 'expiring', label: '임박', dot: 'bg-hot' },
  { value: 'expired', label: '만료', dot: 'bg-fg-4' },
];

interface StatusSegmentProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
  className?: string;
}

/**
 * 상태 선택. 칸 너비가 같아서 선택 표시를 translateX만으로 옮긴다.
 */
export default function StatusSegment({ value, onChange, counts, className = '' }: StatusSegmentProps) {
  const index = Math.max(0, STATUS_OPTIONS.findIndex((option) => option.value === value));

  return (
    <div
      role="radiogroup"
      aria-label="인증 상태"
      className={`relative grid h-11 grid-cols-4 rounded-full bg-control p-1 ${className}`}
      style={{ '--index': index } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className="segment-indicator absolute inset-y-1 left-1 w-[calc((100%-8px)/4)] rounded-full bg-white/[0.11] shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
      />
      {STATUS_OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[14px] font-medium transition-colors duration-200 ${
              active ? 'text-fg' : 'text-fg-3 hover:text-fg-2'
            }`}
          >
            {option.dot && <span className={`h-1.5 w-1.5 rounded-full ${option.dot}`} aria-hidden="true" />}
            {option.label}
            <span className={`tabular-nums text-[12px] ${active ? 'text-fg-2' : 'text-fg-4'}`}>{counts[option.value]}</span>
          </button>
        );
      })}
    </div>
  );
}
