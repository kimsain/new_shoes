'use client';

type BadgeColor = 'emerald' | 'sky' | 'violet' | 'amber' | 'red';

interface ActiveFilterBadgeProps {
  label: string;
  color: BadgeColor;
}

const COLOR_STYLES: Record<BadgeColor, string> = {
  emerald: 'bg-emerald-500/15 text-emerald-400',
  sky: 'bg-sky-500/15 text-sky-400',
  violet: 'bg-violet-500/15 text-violet-400',
  amber: 'bg-amber-500/15 text-amber-400',
  red: 'bg-red-500/15 text-red-400',
};

export default function ActiveFilterBadge({ label, color }: ActiveFilterBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${COLOR_STYLES[color]}`}>
      {label}
    </span>
  );
}
