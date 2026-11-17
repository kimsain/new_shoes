'use client';

import { useState, useMemo, useCallback } from 'react';
import { Shoe } from '@/types/shoe';
import { StatusFilter, SortOption, CountedItem } from '@/types/filters';
import { PRIORITY_BRANDS } from '@/constants';
import { getRemainingDays } from '@/utils/date';

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

export function useFilters(shoes: Shoe[]): UseFiltersReturn {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Computed: counts
  const brandsWithCount = useMemo(() => {
    const brandMap = new Map<string, number>();
    shoes.forEach((shoe) => {
      const count = brandMap.get(shoe.manufacturerName) || 0;
      brandMap.set(shoe.manufacturerName, count + 1);
    });

    const entries = Array.from(brandMap.entries());
    entries.sort((a, b) => {
      const aIndex = PRIORITY_BRANDS.indexOf(a[0] as typeof PRIORITY_BRANDS[number]);
      const bIndex = PRIORITY_BRANDS.indexOf(b[0] as typeof PRIORITY_BRANDS[number]);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return b[1] - a[1];
    });

    return entries.map(([name, count]) => ({ name, count }));
  }, [shoes]);

  const disciplinesWithCount = useMemo(() => {
    const disciplineMap = new Map<string, number>();
    shoes.forEach((shoe) => {
      shoe.disciplines.forEach((d) => {
        const count = disciplineMap.get(d.name) || 0;
        disciplineMap.set(d.name, count + 1);
      });
    });
    return Array.from(disciplineMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [shoes]);

  const typesWithCount = useMemo(() => {
    const typeMap = new Map<string, number>();
    shoes.forEach((shoe) => {
      const count = typeMap.get(shoe.shoeType) || 0;
      typeMap.set(shoe.shoeType, count + 1);
    });
    return Array.from(typeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [shoes]);

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: shoes.length, valid: 0, expiring: 0, expired: 0 };
    shoes.forEach((shoe) => {
      counts[getStatusFilterOf(getRemainingDays(shoe.certificationEndDateExp))]++;
    });
    return counts;
  }, [shoes]);

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
    setSelectedBrands((prev) => {
      const newSet = new Set(prev);
      newSet.has(brand) ? newSet.delete(brand) : newSet.add(brand);
      return newSet;
    });
  }, []);

  const toggleDiscipline = useCallback((discipline: string) => {
    setSelectedDisciplines((prev) => {
      const newSet = new Set(prev);
      newSet.has(discipline) ? newSet.delete(discipline) : newSet.add(discipline);
      return newSet;
    });
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      newSet.has(type) ? newSet.delete(type) : newSet.add(type);
      return newSet;
    });
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

// 남은 일수로 상태 필터 구분 (만료: 0일 이하, 임박: 1~30일, 유효: 30일 초과 또는 기간 미정)
export function getStatusFilterOf(remainingDays: number | null): Exclude<StatusFilter, 'all'> {
  if (remainingDays === null) return 'valid';
  if (remainingDays <= 0) return 'expired';
  if (remainingDays <= 30) return 'expiring';
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
  }
): Shoe[] {
  const { selectedBrands, selectedDisciplines, selectedTypes, statusFilter, searchQuery, sortBy } = filters;

  let result = shoes.filter((shoe) => {
    const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(shoe.manufacturerName);
    const matchesDiscipline = selectedDisciplines.size === 0 ||
      shoe.disciplines.some(d => selectedDisciplines.has(d.name));
    const matchesType = selectedTypes.size === 0 || selectedTypes.has(shoe.shoeType);

    const matchesStatus =
      statusFilter === 'all' ||
      getStatusFilterOf(getRemainingDays(shoe.certificationEndDateExp)) === statusFilter;

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
