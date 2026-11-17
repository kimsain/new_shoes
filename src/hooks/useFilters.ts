'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shoe } from '@/types/shoe';
import { StatusFilter, SortOption, CountedItem } from '@/types/filters';
import { PRIORITY_BRANDS } from '@/constants';
import { getRemainingDays, THRESHOLDS } from '@/utils/date';

interface UseFiltersReturn {
  // State
  selectedBrands: Set<string>;
  selectedDisciplines: Set<string>;
  selectedTypes: Set<string>;
  statusFilter: StatusFilter;
  sortBy: SortOption;

  // Setters
  setSortBy: (sort: SortOption) => void;
  setStatusFilter: (status: StatusFilter) => void;

  // Toggles
  toggleBrand: (brand: string) => void;
  toggleDiscipline: (discipline: string) => void;
  toggleType: (type: string) => void;

  // Actions
  clearAllFilters: () => void;

  // Computed
  activeFilterCount: number;
  statusCounts: Record<StatusFilter, number>;
  brandsWithCount: CountedItem[];
  disciplinesWithCount: CountedItem[];
  typesWithCount: CountedItem[];
}

export function useFilters(shoes: Shoe[], now: number): UseFiltersReturn {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Computed: counts
  const brandsWithCount = useMemo(() => countBrands(shoes), [shoes]);
  const disciplinesWithCount = useMemo(() => countDisciplines(shoes), [shoes]);
  const typesWithCount = useMemo(() => countTypes(shoes), [shoes]);
  const statusCounts = useMemo(() => countStatuses(shoes, now), [shoes, now]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.size > 0) count++;
    if (selectedDisciplines.size > 0) count++;
    if (selectedTypes.size > 0) count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [selectedBrands, selectedDisciplines, selectedTypes, statusFilter]);

  // Toggles
  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) => toggleInSet(prev, brand));
  }, []);

  const toggleDiscipline = useCallback((discipline: string) => {
    setSelectedDisciplines((prev) => toggleInSet(prev, discipline));
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => toggleInSet(prev, type));
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedBrands(new Set());
    setSelectedDisciplines(new Set());
    setSelectedTypes(new Set());
    setStatusFilter('all');
  }, []);

  return {
    selectedBrands,
    selectedDisciplines,
    selectedTypes,
    statusFilter,
    sortBy,
    setSortBy,
    setStatusFilter,
    toggleBrand,
    toggleDiscipline,
    toggleType,
    clearAllFilters,
    activeFilterCount,
    statusCounts,
    brandsWithCount,
    disciplinesWithCount,
    typesWithCount,
  };
}

// 값이 있으면 빼고 없으면 넣은 새 Set
export function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function countBy(values: string[]): Map<string, number> {
  const map = new Map<string, number>();
  values.forEach((v) => map.set(v, (map.get(v) || 0) + 1));
  return map;
}

function byCountDesc(map: Map<string, number>): CountedItem[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

// 브랜드별 개수. PRIORITY_BRANDS가 그 순서대로 먼저, 나머지는 개수 많은 순
export function countBrands(shoes: Shoe[]): CountedItem[] {
  const entries = Array.from(countBy(shoes.map((s) => s.manufacturerName)).entries());
  entries.sort((a, b) => {
    const aIndex = PRIORITY_BRANDS.indexOf(a[0] as typeof PRIORITY_BRANDS[number]);
    const bIndex = PRIORITY_BRANDS.indexOf(b[0] as typeof PRIORITY_BRANDS[number]);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return b[1] - a[1];
  });
  return entries.map(([name, count]) => ({ name, count }));
}

export function countDisciplines(shoes: Shoe[]): CountedItem[] {
  return byCountDesc(countBy(shoes.flatMap((s) => s.disciplines.map((d) => d.name))));
}

export function countTypes(shoes: Shoe[]): CountedItem[] {
  return byCountDesc(countBy(shoes.map((s) => s.shoeType)));
}

export function countStatuses(shoes: Shoe[], now: number = Date.now()): Record<StatusFilter, number> {
  const counts: Record<StatusFilter, number> = { all: shoes.length, valid: 0, expiring: 0, expired: 0 };
  shoes.forEach((shoe) => {
    counts[getStatusFilterOf(getRemainingDays(shoe.certificationEndDateExp, now))]++;
  });
  return counts;
}

// 남은 일수로 상태 필터 구분 (만료: 0일 이하, 임박: 1~30일, 유효: 30일 초과 또는 기간 미정)
export function getStatusFilterOf(remainingDays: number | null): Exclude<StatusFilter, 'all'> {
  if (remainingDays === null) return 'valid';
  if (remainingDays <= THRESHOLDS.EXPIRED) return 'expired';
  if (remainingDays <= THRESHOLDS.URGENT) return 'expiring';
  return 'valid';
}

// Filter and sort shoes
export function filterAndSortShoes(
  shoes: Shoe[],
  filters: {
    selectedBrands: Set<string>;
    selectedDisciplines: Set<string>;
    selectedTypes: Set<string>;
    statusFilter: StatusFilter;
    searchQuery: string;
    sortBy: SortOption;
  },
  now: number = Date.now()
): Shoe[] {
  const { selectedBrands, selectedDisciplines, selectedTypes, statusFilter, searchQuery, sortBy } = filters;

  const result = shoes.filter((shoe) => {
    const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(shoe.manufacturerName);
    const matchesDiscipline = selectedDisciplines.size === 0 ||
      shoe.disciplines.some(d => selectedDisciplines.has(d.name));
    const matchesType = selectedTypes.size === 0 || selectedTypes.has(shoe.shoeType);

    const matchesStatus =
      statusFilter === 'all' ||
      getStatusFilterOf(getRemainingDays(shoe.certificationEndDateExp, now)) === statusFilter;

    const matchesSearch =
      searchQuery === '' ||
      shoe.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shoe.modelNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBrand && matchesDiscipline && matchesType && matchesStatus && matchesSearch;
  });

  // Sort
  if (sortBy === 'expiring') {
    result.sort((a, b) => {
      const dateA = a.certificationEndDateExp ? new Date(a.certificationEndDateExp).getTime() : Infinity;
      const dateB = b.certificationEndDateExp ? new Date(b.certificationEndDateExp).getTime() : Infinity;
      return dateA - dateB;
    });
  } else if (sortBy === 'alphabetical') {
    result.sort((a, b) => a.productName.localeCompare(b.productName));
  } else {
    result.sort((a, b) => {
      const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
      const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
      return dateB - dateA;
    });
  }

  return result;
}
