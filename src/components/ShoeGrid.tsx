'use client';

import { useState, useMemo } from 'react';
import * as React from 'react';
import { Shoe } from '@/types/shoe';
import ShoeCard from './ShoeCard';
import ShoeModal from './ShoeModal';

const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'];

type StatusFilter = 'all' | 'valid' | 'expiring' | 'expired';

interface ShoeGridProps {
  shoes: Shoe[];
}

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
  const [searchInput, setSearchInput] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'expiring' | 'alphabetical'>('newest');

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Desktop: inline filter panel
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  // Mobile: bottom sheet
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Lock body scroll when mobile filter is open
  React.useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  // Debounce search input with loading indicator
  React.useEffect(() => {
    if (searchInput !== searchQuery) {
      setIsSearching(true);
    }
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  const newestShoes = useMemo(() => {
    return [...shoes]
      .sort((a, b) => {
        const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
        const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 4);
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

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedBrands.size > 0) count++;
    if (selectedDisciplines.size > 0) count++;
    if (selectedTypes.size > 0) count++;
    if (statusFilter !== 'all') count++;
    return count;
  }, [selectedBrands, selectedDisciplines, selectedTypes, statusFilter]);

  const hasActiveFilters = activeFilterCount > 0 || searchQuery !== '';

  const filteredShoes = useMemo(() => {
    let result = shoes.filter((shoe) => {
      const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(shoe.manufacturerName);
      const matchesDiscipline = selectedDisciplines.size === 0 ||
        shoe.disciplines.some(d => selectedDisciplines.has(d.name));
      const matchesType = selectedTypes.size === 0 || selectedTypes.has(shoe.shoeType);

      const remainingDays = getRemainingDays(shoe.certificationEndDateExp);
      let matchesStatus = true;
      if (statusFilter === 'expired') {
        matchesStatus = remainingDays !== null && remainingDays <= 0;
      } else if (statusFilter === 'expiring') {
        matchesStatus = remainingDays !== null && remainingDays > 0 && remainingDays <= 30;
      } else if (statusFilter === 'valid') {
        matchesStatus = remainingDays === null || remainingDays > 30;
      }

      const matchesSearch =
        searchQuery === '' ||
        shoe.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shoe.modelNumber.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesBrand && matchesDiscipline && matchesType && matchesStatus && matchesSearch;
    });

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
  }, [shoes, selectedBrands, selectedDisciplines, selectedTypes, statusFilter, searchQuery, sortBy]);

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

  const toggleBrand = (brand: string) => {
    const newSet = new Set(selectedBrands);
    newSet.has(brand) ? newSet.delete(brand) : newSet.add(brand);
    setSelectedBrands(newSet);
  };

  const toggleDiscipline = (discipline: string) => {
    const newSet = new Set(selectedDisciplines);
    newSet.has(discipline) ? newSet.delete(discipline) : newSet.add(discipline);
    setSelectedDisciplines(newSet);
  };

  const toggleType = (type: string) => {
    const newSet = new Set(selectedTypes);
    newSet.has(type) ? newSet.delete(type) : newSet.add(type);
    setSelectedTypes(newSet);
  };

  const clearAllFilters = () => {
    setSelectedBrands(new Set());
    setSelectedDisciplines(new Set());
    setSelectedTypes(new Set());
    setStatusFilter('all');
    setSearchQuery('');
    setSearchInput('');
  };

  // Filter content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-5">
      {/* Status */}
      <FilterSection title="상태">
        {[
          { value: 'all', label: '전체' },
          { value: 'valid', label: '유효' },
          { value: 'expiring', label: '만료임박' },
          { value: 'expired', label: '만료됨' },
        ].map(({ value, label }) => (
          <FilterChip
            key={value}
            label={label}
            active={statusFilter === value}
            onClick={() => setStatusFilter(value as StatusFilter)}
            color={value === 'valid' ? 'emerald' : value === 'expiring' ? 'amber' : value === 'expired' ? 'red' : 'zinc'}
          />
        ))}
      </FilterSection>

      {/* Brands */}
      <FilterSection title="브랜드" count={selectedBrands.size}>
        {brandsWithCount.map(({ name, count }) => (
          <FilterChip
            key={name}
            label={`${name} (${count})`}
            active={selectedBrands.has(name)}
            onClick={() => toggleBrand(name)}
            color="emerald"
          />
        ))}
      </FilterSection>

      {/* Disciplines */}
      <FilterSection title="종목" count={selectedDisciplines.size}>
        {disciplinesWithCount.map(({ name, count }) => (
          <FilterChip
            key={name}
            label={`${name} (${count})`}
            active={selectedDisciplines.has(name)}
            onClick={() => toggleDiscipline(name)}
            color="sky"
          />
        ))}
      </FilterSection>

      {/* Types */}
      <FilterSection title="신발 유형" count={selectedTypes.size}>
        {typesWithCount.map(({ name, count }) => (
          <FilterChip
            key={name}
            label={`${name} (${count})`}
            active={selectedTypes.has(name)}
            onClick={() => toggleType(name)}
            color="violet"
          />
        ))}
      </FilterSection>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-white/[0.04]">
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 btn-press"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            모든 필터 초기화
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 glass mb-6">
        <div className="flex flex-col gap-3">
          {/* Search and Controls */}
          <div className="flex gap-2">
            {/* Search */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              <input
                type="text"
                placeholder="검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white/[0.03] text-white placeholder-zinc-500 border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all duration-300 text-sm"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setIsSearching(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  aria-label="검색어 지우기"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Button - Mobile: opens bottom sheet, Desktop: toggles inline */}
            <button
              onClick={() => {
                // Check if mobile (< md breakpoint = 768px)
                if (window.innerWidth < 768) {
                  setShowMobileFilters(true);
                } else {
                  setShowDesktopFilters(!showDesktopFilters);
                }
              }}
              className={`px-3 py-2.5 min-h-[44px] rounded-xl border transition-all duration-300 flex items-center gap-2 btn-press ${
                showDesktopFilters || activeFilterCount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline text-sm">필터</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'expiring' | 'alphabetical')}
              className="px-3 py-2.5 min-h-[44px] rounded-xl bg-white/[0.03] text-white border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 transition-all duration-300 text-sm cursor-pointer"
            >
              <option value="newest">최신순</option>
              <option value="expiring">만료임박</option>
              <option value="alphabetical">이름순</option>
            </select>
          </div>

          {/* Desktop: Inline Advanced Filters */}
          {showDesktopFilters && (
            <div className="hidden md:block animate-fade-in bg-black/20 rounded-2xl p-5 border border-white/[0.04]">
              <FilterContent />
            </div>
          )}

          {/* Active Filters Summary (when filters closed) */}
          {!showDesktopFilters && hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-600">활성:</span>
              {selectedBrands.size > 0 && <ActiveFilterBadge label={`브랜드 ${selectedBrands.size}`} color="emerald" />}
              {selectedDisciplines.size > 0 && <ActiveFilterBadge label={`종목 ${selectedDisciplines.size}`} color="sky" />}
              {selectedTypes.size > 0 && <ActiveFilterBadge label={`유형 ${selectedTypes.size}`} color="violet" />}
              {statusFilter !== 'all' && (
                <ActiveFilterBadge
                  label={statusFilter === 'valid' ? '유효' : statusFilter === 'expiring' ? '만료임박' : '만료됨'}
                  color={statusFilter === 'valid' ? 'emerald' : statusFilter === 'expiring' ? 'amber' : 'red'}
                />
              )}
              <button
                onClick={clearAllFilters}
                className="px-2 py-1 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
              >
                초기화
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-3xl border-t border-white/10 animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col">
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-zinc-600" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white">필터</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              <FilterContent />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/[0.06] bg-zinc-900/95 backdrop-blur-sm">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all"
              >
                {filteredShoes.length}개 결과 보기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500">
          <span className="text-white font-medium tabular-nums">{filteredShoes.length}</span>개 결과
          {filteredShoes.length !== shoes.length && (
            <span className="text-zinc-600 ml-1">/ 전체 {shoes.length}</span>
          )}
        </p>
      </div>

      {/* Newest Section */}
      {!hasActiveFilters && (
        <section className="mb-10">
          <SectionHeader title="Newest" badge="NEW" count={newestShoes.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
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

      {/* Brand Sections */}
      {sortedBrands.map((brand, idx) => (
        <section key={brand} className="mb-10">
          {idx > 0 && <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-10" />}
          <SectionHeader title={brand} count={groupedShoes[brand].length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
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

      {/* Empty State */}
      {filteredShoes.length === 0 && (
        <div className="text-center py-24 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-white/[0.04]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-zinc-800 border border-white/[0.06] flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">검색 결과가 없습니다</h3>
          <p className="text-zinc-400 mb-2 max-w-sm mx-auto">
            조건에 맞는 신발을 찾을 수 없어요
          </p>
          <p className="text-zinc-500 text-sm mb-8">
            다른 키워드로 검색하거나 필터를 조정해보세요
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 min-h-[48px] rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              필터 초기화하기
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

function FilterSection({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
        {title}
        {count !== undefined && count > 0 && <span className="text-emerald-400 ml-1">({count})</span>}
      </h4>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: 'emerald' | 'sky' | 'violet' | 'amber' | 'red' | 'zinc';
}) {
  const colors = {
    emerald: active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : '',
    sky: active ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : '',
    violet: active ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : '',
    amber: active ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : '',
    red: active ? 'bg-red-500/20 text-red-400 border-red-500/30' : '',
    zinc: active ? 'bg-zinc-700 text-white border-zinc-600' : '',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 min-h-[40px] rounded-xl text-sm font-medium border transition-all duration-200 btn-press ${
        active
          ? colors[color]
          : 'bg-white/[0.03] text-zinc-400 border-transparent hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function ActiveFilterBadge({ label, color }: { label: string; color: 'emerald' | 'sky' | 'violet' | 'amber' | 'red' }) {
  const colors = {
    emerald: 'bg-emerald-500/15 text-emerald-400',
    sky: 'bg-sky-500/15 text-sky-400',
    violet: 'bg-violet-500/15 text-violet-400',
    amber: 'bg-amber-500/15 text-amber-400',
    red: 'bg-red-500/15 text-red-400',
  };

  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
}

function SectionHeader({ title, badge, count }: { title: string; badge?: string; count: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
            {badge}
          </span>
        )}
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <span className="text-zinc-500 text-sm tabular-nums">
        {count}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  );
}
