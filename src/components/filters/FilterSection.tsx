'use client';

import { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
}

export default function FilterSection({ title, count, children }: FilterSectionProps) {
  return (
    <div>
      <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-[0.05em] mb-3">
        {title}
        {count !== undefined && count > 0 && (
          <span className="text-indigo-400 ml-1">({count})</span>
        )}
      </h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
