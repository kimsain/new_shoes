'use client';

import { useState, useMemo } from 'react';
import { Shoe } from '@/types/shoe';
import ShoeCard from './ShoeCard';
import ShoeModal from './ShoeModal';

// Priority brands - always shown first in this order
const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'];

// Status filter options
type StatusFilter = 'all' | 'valid' | 'expiring' | 'expired';

interface ShoeGridProps {
  shoes: Shoe[];
}

// Helper function to sort brands with priority
function sortBrandsWithPriority(brands: string[]): string[] {
  return [...brands].sort((a, b) => {
    const aIndex = PRIORITY_BRANDS.indexOf(a);
    const bIndex = PRIORITY_BRANDS.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
}

// Get remaining days from end date
function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function ShoeGrid({ shoes }: ShoeGridProps) {
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'expiring' | 'alphabetical'>('newest');

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // UI state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get 4 newest shoes
  const newestShoes = useMemo(() => {
    return [...shoes]
      .sort((a, b) => {
        const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
        const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
  }, [shoes]);

  // Extract all unique disciplines with count
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

  // Extract all unique shoe types with count
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

  // Get unique brands with count - sorted with priority brands first
  const brandsWithCount = useMemo(() => {
    const brandMap = new Map<string, number>();
    shoes.forEach((shoe) => {
      const count = brandMap.get(shoe.manufacturerName) || 0;
      brandMap.set(shoe.manufacturerName, count + 1);
    });

    const entries = Array.from(brandMap.entries());
    entries.sort((a, b) => {
      const aIndex = PRIORITY_BRANDS.indexOf(a[0]);
      const bIndex = PRIORITY_BRANDS.indexOf(b[0]);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return b[1] - a[1];
    });

    return entries.map(([name, count]) => ({ name, count }));
  }, [shoes]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.size > 0) count++;
    if (selectedDisciplines.size > 0) count++;
    if (selectedTypes.size > 0) count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [selectedBrands, selectedDisciplines, selectedTypes, statusFilter]);

  // Check if any filter is active
  const hasActiveFilters = activeFilterCount > 0 || searchQuery !== '';

  // Filter and sort shoes
  const filteredShoes = useMemo(() => {
    let result = shoes.filter((shoe) => {
      // Brand filter
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(shoe.manufacturerName);

      // Discipline filter
      const matchesDiscipline = selectedDisciplines.size === 0 ||
        shoe.disciplines.some(d => selectedDisciplines.has(d.name));

      // Type filter
      const matchesType = selectedTypes.size === 0 || selectedTypes.has(shoe.shoeType);

      // Status filter
      const remainingDays = getRemainingDays(shoe.certificationEndDateExp);
      let matchesStatus = true;
      if (statusFilter === 'expired') {
        matchesStatus = remainingDays !== null && remainingDays <= 0;
      } else if (statusFilter === 'expiring') {
        matchesStatus = remainingDays !== null && remainingDays > 0 && remainingDays <= 30;
      } else if (statusFilter === 'valid') {
        matchesStatus = remainingDays === null || remainingDays > 30;
      }

      // Search filter
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
      // newest
      result.sort((a, b) => {
        const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
        const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [shoes, selectedBrands, selectedDisciplines, selectedTypes, statusFilter, searchQuery, sortBy]);

  // Group by brand
  const groupedShoes = useMemo(() => {
    const grouped: Record<string, Shoe[]> = {};
    filteredShoes.forEach((shoe) => {
      if (!grouped[shoe.manufacturerName]) {
        grouped[shoe.manufacturerName] = [];
      }
      grouped[shoe.manufacturerName].push(shoe);
    });
    return grouped;
  }, [filteredShoes]);

  const sortedBrands = sortBrandsWithPriority(Object.keys(groupedShoes));

  // Toggle functions
  const toggleBrand = (brand: string) => {
    const newSet = new Set(selectedBrands);
    if (newSet.has(brand)) {
      newSet.delete(brand);
    } else {
      newSet.add(brand);
    }
    setSelectedBrands(newSet);
  };

  const toggleDiscipline = (discipline: string) => {
    const newSet = new Set(selectedDisciplines);
    if (newSet.has(discipline)) {
      newSet.delete(discipline);
    } else {
      newSet.add(discipline);
    }
    setSelectedDisciplines(newSet);
  };

  const toggleType = (type: string) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const clearAllFilters = () => {
    setSelectedBrands(new Set());
    setSelectedDisciplines(new Set());
    setSelectedTypes(new Set());
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <>
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 -mx-4 px-4 py-4 bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-gray-800/50 mb-8">
        <div className="flex flex-col gap-4">
          {/* Search and Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="신발명, 브랜드, 모델번호 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 text-white placeholder-gray-500 border border-gray-800 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Toggle & Sort */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                  showAdvancedFilters || activeFilterCount > 0
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-gray-900 border-gray-800 text-white hover:border-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">필터</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-green-500 text-white text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'expiring' | 'alphabetical')}
                className="px-4 py-2.5 rounded-xl bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-green-500/50 transition-all min-w-[120px]"
              >
                <option value="newest">최신순</option>
                <option value="expiring">만료임박순</option>
                <option value="alphabetical">이름순</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Status Filter */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">상태</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: '전체', color: 'gray' },
                    { value: 'valid', label: '유효', color: 'green' },
                    { value: 'expiring', label: '만료임박 (30일)', color: 'amber' },
                    { value: 'expired', label: '만료됨', color: 'red' },
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => setStatusFilter(value as StatusFilter)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === value
                          ? color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                          : color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                          : 'bg-gray-700 text-white border border-gray-600'
                          : 'bg-gray-800 text-gray-400 border border-transparent hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  브랜드 {selectedBrands.size > 0 && <span className="text-green-400">({selectedBrands.size})</span>}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {brandsWithCount.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => toggleBrand(name)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedBrands.has(name)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {name}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discipline Filter */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  종목 {selectedDisciplines.size > 0 && <span className="text-green-400">({selectedDisciplines.size})</span>}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {disciplinesWithCount.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => toggleDiscipline(name)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedDisciplines.has(name)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {name}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  신발 유형 {selectedTypes.size > 0 && <span className="text-green-400">({selectedTypes.size})</span>}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {typesWithCount.map(({ name, count }) => (
                    <button
                      key={name}
                      onClick={() => toggleType(name)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedTypes.has(name)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {name}
                      <span className="ml-1 opacity-60">({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <div className="pt-2 border-t border-gray-800">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    모든 필터 초기화
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Summary (when panel is closed) */}
          {!showAdvancedFilters && hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">활성 필터:</span>
              {selectedBrands.size > 0 && (
                <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                  브랜드: {selectedBrands.size}개
                </span>
              )}
              {selectedDisciplines.size > 0 && (
                <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs">
                  종목: {selectedDisciplines.size}개
                </span>
              )}
              {selectedTypes.size > 0 && (
                <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs">
                  유형: {selectedTypes.size}개
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className={`px-2 py-1 rounded-lg text-xs ${
                  statusFilter === 'valid' ? 'bg-green-500/20 text-green-400'
                  : statusFilter === 'expiring' ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                  {statusFilter === 'valid' ? '유효' : statusFilter === 'expiring' ? '만료임박' : '만료됨'}
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                초기화
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6 text-sm">
        <p className="text-gray-400">
          <span className="text-white font-medium">{filteredShoes.length}</span>개 제품
          {filteredShoes.length !== shoes.length && (
            <span className="text-gray-500 ml-1">(전체 {shoes.length}개)</span>
          )}
        </p>
      </div>

      {/* Newest Section - Only show when no filters applied */}
      {!hasActiveFilters && (
        <section className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-semibold">NEW</span>
              <h2 className="text-xl font-bold text-white">Newest</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-sm">
              {newestShoes.length}
            </span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newestShoes.map((shoe) => (
              <ShoeCard
                key={`newest-${shoe.productApplicationuuid}`}
                shoe={shoe}
                onClick={() => setSelectedShoe(shoe)}
                isNew
              />
            ))}
          </div>
        </section>
      )}

      {/* Shoe Grid grouped by brand */}
      {sortedBrands.map((brand) => (
        <section key={brand} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-white">{brand}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-sm">
              {groupedShoes[brand].length}
            </span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groupedShoes[brand].map((shoe) => (
              <ShoeCard
                key={shoe.productApplicationuuid}
                shoe={shoe}
                onClick={() => setSelectedShoe(shoe)}
              />
            ))}
          </div>
        </section>
      ))}

      {filteredShoes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg text-white mb-2">검색 결과가 없습니다</p>
          <p className="text-gray-500 text-sm mb-4">다른 검색어나 필터를 시도해보세요</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all text-sm font-medium"
            >
              필터 초기화
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedShoe && (
        <ShoeModal shoe={selectedShoe} onClose={() => setSelectedShoe(null)} />
      )}
    </>
  );
}
