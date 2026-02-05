'use client';

import { FilterColor } from '@/types/filters';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: FilterColor;
}

// Tailwind JIT를 위해 전체 클래스명 명시
const COLOR_STYLES: Record<FilterColor, { active: string; inactive: string }> = {
  emerald: {
    active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  sky: {
    active: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  violet: {
    active: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  amber: {
    active: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  red: {
    active: 'bg-red-500/15 text-red-400 border-red-500/30',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  zinc: {
    active: 'bg-white/[0.08] text-white border-white/[0.12]',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
  indigo: {
    active: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]',
    inactive: 'bg-white/[0.02] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white hover:border-white/[0.1]',
  },
};

export default function FilterChip({ label, active, onClick, color }: FilterChipProps) {
  const styles = COLOR_STYLES[color] || COLOR_STYLES.indigo;

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-all duration-200 ${
        active ? styles.active : styles.inactive
      }`}
    >
      {label}
    </button>
  );
}
