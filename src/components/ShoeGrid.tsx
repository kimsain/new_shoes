'use client';

import { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { Shoe } from '@/types/shoe';
import { NEWEST_SHOES_COUNT } from '@/constants';
import { useFilters, filterAndSortShoes, groupShoesByBrand, sortBrandsWithPriority } from '@/hooks/useFilters';
import { useSearch } from '@/hooks/useSearch';

import ShoeCard from './ShoeCard';
import SearchBar from './SearchBar';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import BottomSheet from './BottomSheet';
import { SidebarFilter, MobileFilter, ActiveFilterBadge } from './filters';

// Dynamic import for modal (code splitting)
const ShoeModal = lazy(() => import('./ShoeModal'));

interface ShoeGridProps {
  shoes: Shoe[];
}

export default function ShoeGrid({ shoes }: ShoeGridProps) {
  const [selectedShoeIndex, setSelectedShoeIndex] = useState<number | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Hooks
  const filters = useFilters(shoes);
  const search = useSearch();

  // Computed: newest shoes
  const newestShoes = useMemo(() => {
    return [...shoes]
      .sort((a, b) => {
        const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
        const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, NEWEST_SHOES_COUNT);
  }, [shoes]);

  // Computed: filtered shoes
  const filteredShoes = useMemo(() => {
    return filterAndSortShoes(shoes, {
      selectedBrands: filters.selectedBrands,
      selectedDisciplines: filters.selectedDisciplines,
      selectedTypes: filters.selectedTypes,
      statusFilter: filters.statusFilter,
      searchQuery: search.searchQuery,
      sortBy: filters.sortBy,
    });
  }, [shoes, filters, search.searchQuery]);

  // Computed: grouped by brand
  const groupedShoes = useMemo(() => groupShoesByBrand(filteredShoes), [filteredShoes]);
  const sortedBrands = sortBrandsWithPriority(Object.keys(groupedShoes));

  // Computed: has active filters
  const hasActiveFilters = filters.activeFilterCount > 0 || search.searchQuery !== '';

  // Selected shoe from filtered list
  const selectedShoe = selectedShoeIndex !== null ? filteredShoes[selectedShoeIndex] : null;

  // Navigation handlers
  const handleSelectShoe = useCallback((shoe: Shoe) => {
    const index = filteredShoes.findIndex((s) => s.productApplicationuuid === shoe.productApplicationuuid);
    setSelectedShoeIndex(index >= 0 ? index : null);
  }, [filteredShoes]);

  const handleCloseModal = useCallback(() => {
    setSelectedShoeIndex(null);
  }, []);

  const handlePrevShoe = useCallback(() => {
    if (selectedShoeIndex !== null && selectedShoeIndex > 0) {
      setSelectedShoeIndex(selectedShoeIndex - 1);
    }
  }, [selectedShoeIndex]);

  const handleNextShoe = useCallback(() => {
    if (selectedShoeIndex !== null && selectedShoeIndex < filteredShoes.length - 1) {
      setSelectedShoeIndex(selectedShoeIndex + 1);
    }
  }, [selectedShoeIndex, filteredShoes.length]);

  // Clear all (filters + search)
  const handleClearAll = useCallback(() => {
    filters.clearAllFilters();
    search.clearSearch();
  }, [filters, search]);

  // Shared filter props
  const filterProps = {
    statusFilter: filters.statusFilter,
    setStatusFilter: filters.setStatusFilter,
    brandsWithCount: filters.brandsWithCount,
    selectedBrands: filters.selectedBrands,
    toggleBrand: filters.toggleBrand,
    disciplinesWithCount: filters.disciplinesWithCount,
    selectedDisciplines: filters.selectedDisciplines,
    toggleDiscipline: filters.toggleDiscipline,
    typesWithCount: filters.typesWithCount,
    selectedTypes: filters.selectedTypes,
    toggleType: filters.toggleType,
    activeFilterCount: filters.activeFilterCount,
    clearAllFilters: filters.clearAllFilters,
  };

  return (
    <>
      {/* Desktop Layout (lg+): Sidebar + Main */}
      <div className="hidden lg:flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-20 bg-zinc-900/50 rounded-2xl border border-white/[0.06] p-5 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">필터</h3>
              {filters.activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                  {filters.activeFilterCount}
                </span>
              )}
            </div>
            <SidebarFilter {...filterProps} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="sticky top-16 z-40 -mx-4 px-4 py-3 glass mb-6">
            <SearchBar
              searchInput={search.searchInput}
              setSearchInput={search.setSearchInput}
              isSearching={search.isSearching}
              clearSearch={search.clearSearch}
              sortBy={filters.sortBy}
              setSortBy={filters.setSortBy}
            />
          </div>

          <MainContent
            shoes={shoes}
            filteredShoes={filteredShoes}
            newestShoes={newestShoes}
            groupedShoes={groupedShoes}
            sortedBrands={sortedBrands}
            hasActiveFilters={hasActiveFilters}
            onSelectShoe={handleSelectShoe}
            onClearFilters={handleClearAll}
          />
        </main>
      </div>

      {/* Mobile/Tablet Layout (< lg) */}
      <div className="lg:hidden">
        {/* Sticky Search Bar */}
        <div className="sticky top-16 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 glass mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar
                searchInput={search.searchInput}
                setSearchInput={search.setSearchInput}
                isSearching={search.isSearching}
                clearSearch={search.clearSearch}
                sortBy={filters.sortBy}
                setSortBy={filters.setSortBy}
                placeholder="검색..."
                compact
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className={`px-3 py-2.5 min-h-[44px] rounded-xl border transition-all duration-300 flex items-center gap-2 btn-haptic ${
                filters.activeFilterCount > 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white hover:border-white/10'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              {filters.activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                  {filters.activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              <span className="text-xs text-zinc-600">활성:</span>
              {filters.selectedBrands.size > 0 && (
                <ActiveFilterBadge label={`브랜드 ${filters.selectedBrands.size}`} color="emerald" />
              )}
              {filters.selectedDisciplines.size > 0 && (
                <ActiveFilterBadge label={`종목 ${filters.selectedDisciplines.size}`} color="sky" />
              )}
              {filters.selectedTypes.size > 0 && (
                <ActiveFilterBadge label={`유형 ${filters.selectedTypes.size}`} color="violet" />
              )}
              {filters.statusFilter !== 'all' && (
                <ActiveFilterBadge
                  label={filters.statusFilter === 'valid' ? '유효' : filters.statusFilter === 'expiring' ? '만료임박' : '만료됨'}
                  color={filters.statusFilter === 'valid' ? 'emerald' : filters.statusFilter === 'expiring' ? 'amber' : 'red'}
                />
              )}
              <button
                onClick={handleClearAll}
                className="px-2 py-1 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
              >
                초기화
              </button>
            </div>
          )}
        </div>

        {/* Mobile Bottom Sheet */}
        <BottomSheet
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          title="필터"
          footer={
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all"
            >
              {filteredShoes.length}개 결과 보기
            </button>
          }
        >
          <MobileFilter {...filterProps} />
        </BottomSheet>

        <MainContent
          shoes={shoes}
          filteredShoes={filteredShoes}
          newestShoes={newestShoes}
          groupedShoes={groupedShoes}
          sortedBrands={sortedBrands}
          hasActiveFilters={hasActiveFilters}
          onSelectShoe={handleSelectShoe}
          onClearFilters={handleClearAll}
        />
      </div>

      {/* Modal with Suspense for lazy loading */}
      {selectedShoe && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <ShoeModal
            shoe={selectedShoe}
            onClose={handleCloseModal}
            onPrev={handlePrevShoe}
            onNext={handleNextShoe}
            hasPrev={selectedShoeIndex !== null && selectedShoeIndex > 0}
            hasNext={selectedShoeIndex !== null && selectedShoeIndex < filteredShoes.length - 1}
          />
        </Suspense>
      )}
    </>
  );
}

// Main content component (shared between layouts)
interface MainContentProps {
  shoes: Shoe[];
  filteredShoes: Shoe[];
  newestShoes: Shoe[];
  groupedShoes: Record<string, Shoe[]>;
  sortedBrands: string[];
  hasActiveFilters: boolean;
  onSelectShoe: (shoe: Shoe) => void;
  onClearFilters: () => void;
}

function MainContent({
  shoes,
  filteredShoes,
  newestShoes,
  groupedShoes,
  sortedBrands,
  hasActiveFilters,
  onSelectShoe,
  onClearFilters,
}: MainContentProps) {
  return (
    <>
      {/* Results count */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-bounce">
            {newestShoes.map((shoe) => (
              <ShoeCard
                key={`newest-${shoe.productApplicationuuid}`}
                shoe={shoe}
                onClick={() => onSelectShoe(shoe)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-bounce">
            {groupedShoes[brand].map((shoe) => (
              <ShoeCard
                key={shoe.productApplicationuuid}
                shoe={shoe}
                onClick={() => onSelectShoe(shoe)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Empty State */}
      {filteredShoes.length === 0 && (
        <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
      )}
    </>
  );
}
