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

export function useSearch(): UseSearchReturn {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchInput !== searchQuery) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  return {
    searchInput,
    searchQuery,
    isSearching,
    setSearchInput,
    clearSearch,
  };
}
