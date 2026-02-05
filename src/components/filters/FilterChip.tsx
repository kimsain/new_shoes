'use client';

import { FilterColor } from '@/types/filters';
import { BG, TEXT } from '@/styles/tokens';

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
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
  sky: {
    active: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
  violet: {
    active: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
  amber: {
    active: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
  red: {
    active: 'bg-red-500/15 text-red-400 border-red-500/30',
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
  zinc: {
    active: 'bg-zinc-700 text-white border-zinc-600',
    inactive: `${BG.interactive.default} ${TEXT.tertiary} border-transparent hover:bg-white/[0.06] hover:text-white`,
  },
};

export default function FilterChip({ label, active, onClick, color }: FilterChipProps) {
  const styles = COLOR_STYLES[color];

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-all duration-200 btn-press ${
        active ? styles.active : styles.inactive
      }`}
    >
      {label}
    </button>
  );
}
