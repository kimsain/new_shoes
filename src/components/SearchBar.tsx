'use client';

import { useState, useRef, useEffect } from 'react';
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

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'expiring', label: 'Expiring' },
  { value: 'alphabetical', label: 'A-Z' },
];

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const currentLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Sort';

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

      {/* Custom Sort Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 ${compact ? 'px-3 pr-8' : 'px-4 pr-10'} py-3 rounded-2xl bg-white/[0.02] text-white border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] focus:outline-none focus:border-indigo-500/50 transition-all duration-200 text-sm cursor-pointer`}
        >
          <span>{currentLabel}</span>
        </button>

        {/* Dropdown Arrow */}
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-36 py-1 rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/[0.08] shadow-xl shadow-black/50 z-50 animate-fade-in">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSortBy(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center justify-between ${
                  sortBy === option.value
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
