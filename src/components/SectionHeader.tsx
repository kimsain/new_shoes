'use client';

import { TEXT, BADGE, UTILS } from '@/styles/tokens';

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
          <span className={`px-2 py-0.5 rounded ${BADGE.section.bg} ${BADGE.section.text} border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wide`}>
            {badge}
          </span>
        )}
        <h2 className={`text-lg font-semibold ${TEXT.primary}`}>{title}</h2>
      </div>
      <span className={`${TEXT.muted} text-sm tabular-nums`}>{count}</span>
      <div className={`flex-1 h-px ${UTILS.divider}`} />
    </div>
  );
}
