'use client';

import { useState, useMemo } from 'react';
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
  const [sortBy, setSortBy] = useState<'newest' | 'expiring' | 'alphabetical'>('newest');

  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedDisciplines, setSelectedDisciplines] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
  };

  return (
    <>
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 glass mb-10">
        <div className="flex flex-col gap-4">
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="신발명, 브랜드, 모델번호 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/[0.03] text-white placeholder-zinc-500 border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-3 rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                  showAdvancedFilters || activeFilterCount > 0
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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'expiring' | 'alphabetical')}
                className="px-4 py-3 rounded-xl bg-white/[0.03] text-white border border-white/[0.06] focus:outline-none focus:border-emerald-500/50 transition-all duration-300 text-sm cursor-pointer"
              >
                <option value="newest">최신순</option>
                <option value="expiring">만료임박순</option>
                <option value="alphabetical">이름순</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="animate-fade-in bg-black/20 rounded-2xl p-5 border border-white/[0.04] space-y-5">
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
              {hasActiveFilters && (
                <div className="pt-3 border-t border-white/[0.04]">
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    모든 필터 초기화
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Summary */}
          {!showAdvancedFilters && hasActiveFilters && (
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

      {/* Results */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-zinc-500">
          <span className="text-white font-medium tabular-nums">{filteredShoes.length}</span>개 결과
          {filteredShoes.length !== shoes.length && (
            <span className="text-zinc-600 ml-1">/ 전체 {shoes.length}</span>
          )}
        </p>
      </div>

      {/* Newest Section */}
      {!hasActiveFilters && (
        <section className="mb-14">
          <SectionHeader title="Newest" badge="NEW" count={newestShoes.length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
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
      {sortedBrands.map((brand) => (
        <section key={brand} className="mb-14">
          <SectionHeader title={brand} count={groupedShoes[brand].length} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
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
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-zinc-800/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-xl text-white mb-2">검색 결과가 없습니다</p>
          <p className="text-zinc-500 mb-6">다른 검색어나 필터를 시도해보세요</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all duration-300"
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

function FilterSection({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-3">
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
      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
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
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        {badge && (
          <span className="px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
            {badge}
          </span>
        )}
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] text-zinc-500 text-sm tabular-nums">
        {count}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
    </div>
  );
}
