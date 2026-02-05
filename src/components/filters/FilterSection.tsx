'use client';

import { ReactNode } from 'react';
import { TEXT, ACCENT } from '@/styles/tokens';

interface FilterSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
}

export default function FilterSection({ title, count, children }: FilterSectionProps) {
  return (
    <div>
      <h4 className={`text-xs font-medium ${TEXT.muted} uppercase tracking-wider mb-3`}>
        {title}
        {count !== undefined && count > 0 && (
          <span className={`${ACCENT.solid.text} ml-1`}>({count})</span>
        )}
      </h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
