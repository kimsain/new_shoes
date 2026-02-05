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
  placeholder = 'Search shoes, brands, models...',
  compact = false,
}: SearchBarProps) {
  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3'}`}>
      {/* Search Input */}
      <div className="search-bar-container relative flex-1">
        {/* Search Icon / Loading */}
        {isSearching ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4">
            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
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
          className={`search-input w-full ${compact ? 'pl-10 pr-10' : 'pl-11 pr-10'} py-3 rounded-2xl bg-white/[0.02] text-white placeholder-zinc-500 border border-white/[0.06] focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all duration-200 text-sm`}
        />

        {/* Clear button */}
        {searchInput && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Sort Select */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className={`appearance-none ${compact ? 'px-3 pr-8' : 'px-4 pr-10'} py-3 rounded-2xl bg-white/[0.02] text-white border border-white/[0.06] focus:outline-none focus:border-indigo-500/50 transition-all duration-200 text-sm cursor-pointer [&>option]:bg-zinc-900 [&>option]:text-white`}
        >
          <option value="newest">Newest</option>
          <option value="expiring">Expiring</option>
          <option value="alphabetical">A-Z</option>
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
