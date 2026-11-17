'use client';

import { useState, useEffect, useCallback } from 'react';
import { SEARCH_DEBOUNCE_MS } from '@/constants';

interface UseSearchReturn {
  searchInput: string;
  searchQuery: string;
  isSearching: boolean;
  setSearchInput: (value: string) => void;
  clearSearch: () => void;
}

/**
 * 입력값(searchInput)을 SEARCH_DEBOUNCE_MS 동안 멈추면 검색어(searchQuery)로 확정한다.
 * 상태는 두 개뿐이다: 둘이 같으면 idle, 다르면 debouncing. isSearching은 따로 저장하지 않고 이 차이에서 계산한다.
 */
export function useSearch(): UseSearchReturn {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchInput !== searchQuery;

  useEffect(() => {
    if (!isSearching) return;
    const timer = setTimeout(() => setSearchQuery(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [isSearching, searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
  }, []);

  return {
    searchInput,
    searchQuery,
    isSearching,
    setSearchInput,
    clearSearch,
  };
}
