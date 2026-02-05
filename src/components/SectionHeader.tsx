'use client';

interface SectionHeaderProps {
  title: string;
  badge?: string;
  count: number;
}

export default function SectionHeader({ title, badge, count }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
            {badge}
          </span>
        )}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <span className="text-zinc-500 text-sm tabular-nums">{count}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  );
}
