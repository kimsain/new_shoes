'use client';

import { SortOption } from '@/types/filters';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  placeholder?: string;
  compact?: boolean;
}

export default function SearchBar({
  searchInput,
  setSearchInput,
  isSearching,
  clearSearch,
  sortBy,
  setSortBy,
  placeholder = '신발명, 브랜드, 모델번호 검색...',
  compact = false,
}: SearchBarProps) {
  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3'}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        {isSearching ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4">
            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`w-full ${compact ? 'pl-9 pr-9' : 'pl-10 pr-10'} py-2.5 rounded-xl bg-white/[0.03] text-white placeholder-zinc-500 border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all duration-300 text-sm`}
        />
        {searchInput && (
          <button
            onClick={clearSearch}
            className={`absolute ${compact ? 'right-2 p-1' : 'right-2 p-1.5'} top-1/2 -translate-y-1/2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all`}
            aria-label="검색어 지우기"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Sort Select */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className={`${compact ? 'px-3' : 'px-4'} py-2.5 rounded-xl bg-white/[0.03] text-white border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 transition-all duration-300 text-sm cursor-pointer`}
      >
        <option value="newest">최신순</option>
        <option value="expiring">{compact ? '만료임박' : '만료임박순'}</option>
        <option value="alphabetical">이름순</option>
      </select>
    </div>
  );
}
