'use client';

import { useEffect, useRef } from 'react';
import { CloseIcon, SearchIcon } from './icons';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  isSearching: boolean;
  clearSearch: () => void;
}

export default function SearchBar({ searchInput, setSearchInput, isSearching, clearSearch }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" 키로 검색창에 바로 들어간다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (e.key === '/' && !isTyping && !document.querySelector('[role="dialog"]')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="group relative min-w-0 flex-1">
      <span className="pointer-events-none absolute left-4 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center text-fg-3 transition-colors duration-200 group-focus-within:text-fg">
        {isSearching ? (
          <span className="spinner h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent" />
        ) : (
          <SearchIcon className="h-4 w-4" />
        )}
      </span>

      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        placeholder="신발, 브랜드, 모델 검색"
        aria-label="신발 검색"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            clearSearch();
            e.currentTarget.blur();
          }
        }}
        className={`h-11 w-full rounded-full border border-transparent bg-control pl-11 ${searchInput ? 'pr-11' : 'pr-4 lg:pr-11'} text-[15px] text-fg placeholder:text-fg-3 outline-none transition-[border-color,background-color] duration-200 hover:bg-control-hover focus:border-line-strong focus:bg-control-hover [&::-webkit-search-cancel-button]:hidden`}
      />

      {searchInput ? (
        <button
          type="button"
          onClick={() => {
            clearSearch();
            inputRef.current?.focus();
          }}
          aria-label="검색어 지우기"
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-fg-3 transition-colors duration-150 hover:bg-white/10 hover:text-fg"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden h-6 min-w-6 -translate-y-1/2 place-items-center rounded-md border border-line-strong px-1.5 text-[12px] font-medium text-fg-3 lg:grid">
          /
        </kbd>
      )}
    </div>
  );
}
