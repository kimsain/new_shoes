'use client';

import { TEXT, BG, BORDER, BUTTON } from '@/styles/tokens';

interface EmptyStateProps {
  onClearFilters?: () => void;
  hasActiveFilters: boolean;
}

export default function EmptyState({ onClearFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-24 animate-fade-in">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border ${BORDER.subtle}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className={`w-12 h-12 ${TEXT.muted}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <h3 className={`text-xl font-semibold ${TEXT.primary} mb-2`}>검색 결과가 없습니다</h3>
      <p className={`${TEXT.tertiary} mb-2 max-w-sm mx-auto`}>
        조건에 맞는 신발을 찾을 수 없어요
      </p>
      <p className={`${TEXT.muted} text-sm mb-8`}>
        다른 키워드로 검색하거나 필터를 조정해보세요
      </p>
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className={`px-6 py-3 min-h-[48px] rounded-xl ${BUTTON.primary.bg} ${BUTTON.primary.text} font-medium ${BUTTON.primary.bgHover} active:scale-[0.98] transition-all duration-300 ${BUTTON.primary.shadow} ${BUTTON.primary.shadowHover}`}
        >
          필터 초기화하기
        </button>
      )}
    </div>
  );
}
