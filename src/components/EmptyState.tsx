'use client';

import { SearchIcon } from './icons';

interface EmptyStateProps {
  onClearFilters?: () => void;
  hasActiveFilters: boolean;
}

export default function EmptyState({ onClearFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="anim-fade mt-6 flex flex-col items-center rounded-card border border-dashed border-line-strong px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-control text-fg-3">
        <SearchIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-6 text-[20px] font-bold tracking-[-0.03em] text-fg">조건에 맞는 신발이 없습니다</h3>
      <p className="mt-2 text-[15px] text-fg-3">검색어를 바꾸거나 필터를 줄여 보세요.</p>
      {hasActiveFilters && onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-8 h-11 rounded-full bg-volt px-6 text-[15px] font-semibold text-volt-ink transition-transform duration-150 active:scale-[0.97]"
        >
          필터 모두 지우기
        </button>
      )}
    </div>
  );
}
