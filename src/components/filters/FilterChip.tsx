'use client';

import { FilterColor } from '@/types/filters';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: FilterColor;
}

const COLOR_STYLES: Record<FilterColor, string> = {
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  sky: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  violet: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  zinc: 'bg-zinc-700 text-white border-zinc-600',
};

export default function FilterChip({ label, active, onClick, color }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-all duration-200 btn-press ${
        active
          ? COLOR_STYLES[color]
          : 'bg-white/[0.03] text-zinc-400 border-transparent hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
