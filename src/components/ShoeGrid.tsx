'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Shoe } from '@/types/shoe';
import { SortOption, StatusFilter } from '@/types/filters';
import { NEW_WINDOW_DAYS } from '@/constants';
import { MOTION } from '@/styles/tokens';
import { useFilters, filterAndSortShoes } from '@/hooks/useFilters';
import { useSearch } from '@/hooks/useSearch';
import { getDaysSince } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';
import { runViewTransition, supportsViewTransition } from '@/lib/motion';

import ShoeCard from './ShoeCard';
import ShoeModal from './ShoeModal';
import SearchBar from './SearchBar';
import SortMenu from './SortMenu';
import StatusSegment, { STATUS_OPTIONS } from './StatusSegment';
import BrandRail from './BrandRail';
import EmptyState from './EmptyState';
import { FilterPanel } from './filters';
import { CloseIcon, SlidersIcon } from './icons';

interface ShoeGridProps {
  shoes: Shoe[];
}

const HEADER_HEIGHT = 64;

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.bottom > HEADER_HEIGHT && rect.top < window.innerHeight;
}

export default function ShoeGrid({ shoes }: ShoeGridProps) {
  const filters = useFilters(shoes);
  const search = useSearch();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [closingModal, setClosingModal] = useState(false);
  const [navDirection, setNavDirection] = useState<'left' | 'right' | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { selectedBrands, selectedDisciplines, selectedTypes, statusFilter, sortBy } = filters;

  const filteredShoes = useMemo(
    () =>
      filterAndSortShoes(shoes, {
        selectedBrands,
        selectedDisciplines,
        selectedTypes,
        statusFilter,
        searchQuery: search.searchQuery,
        sortBy,
      }),
    [shoes, selectedBrands, selectedDisciplines, selectedTypes, statusFilter, search.searchQuery, sortBy]
  );

  const newIds = useMemo(() => {
    const ids = new Set<string>();
    shoes.forEach((shoe) => {
      const days = getDaysSince(shoe.certificationStartDateExp);
      if (days !== null && days >= 0 && days <= NEW_WINDOW_DAYS) ids.add(shoe.productApplicationuuid);
    });
    return ids;
  }, [shoes]);

  const hasActiveFilters = filters.activeFilterCount > 0 || search.searchQuery !== '';
  const selectedIndex = selectedId ? filteredShoes.findIndex((s) => s.productApplicationuuid === selectedId) : -1;
  const selectedShoe = selectedIndex >= 0 ? filteredShoes[selectedIndex] : null;

  // 도구 막대가 헤더 밑에 붙었는지 감지해 배경을 깐다
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: `-${HEADER_HEIGHT + 1}px 0px 0px 0px`,
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // ---------- 상세 열기와 닫기 ----------

  // 카드는 memo로 고정되므로 이 함수는 상태에 기대지 않는다 (예전의 엉뚱한 신발이 열리던 문제)
  const openShoe = useCallback(async (id: string) => {
    const media = document.querySelector<HTMLElement>(`[data-media="${id}"]`);
    const img = media?.querySelector<HTMLImageElement>('img[data-fg]');

    // 상세 화면이 첫 프레임부터 같은 사진을 그릴 수 있게 미리 디코드한다
    if (img?.complete && img.currentSrc) {
      const preload = new window.Image();
      preload.src = img.currentSrc;
      await preload.decode().catch(() => undefined);
    }

    setNavDirection(null);
    if (!media || !supportsViewTransition()) {
      setSelectedId(id);
      return;
    }

    media.style.viewTransitionName = 'shoe-media';
    runViewTransition('open', () => {
      media.style.viewTransitionName = '';
      flushSync(() => setSelectedId(id));
    });
  }, []);

  const closeShoe = useCallback(() => {
    if (!selectedId) return;
    const media = document.querySelector<HTMLElement>(`[data-media="${selectedId}"]`);
    const cardButton = document.querySelector<HTMLElement>(`[data-card-button="${selectedId}"]`);
    const restoreFocus = () => cardButton?.focus({ preventScroll: true });

    if (media && supportsViewTransition() && isInViewport(media)) {
      const transition = runViewTransition('close', () => {
        flushSync(() => setSelectedId(null));
        media.style.viewTransitionName = 'shoe-media';
      });
      transition?.finished
        .catch(() => undefined)
        .finally(() => {
          media.style.viewTransitionName = '';
          restoreFocus();
        });
      return;
    }

    setClosingModal(true);
    window.setTimeout(() => {
      setClosingModal(false);
      setSelectedId(null);
      restoreFocus();
    }, MOTION.popupExit);
  }, [selectedId]);

  const goTo = useCallback(
    (delta: 1 | -1) => {
      const next = filteredShoes[selectedIndex + delta];
      if (selectedIndex < 0 || !next) return;
      setNavDirection(delta > 0 ? 'right' : 'left');
      setSelectedId(next.productApplicationuuid);
    },
    [filteredShoes, selectedIndex]
  );
  const showPrev = useCallback(() => goTo(-1), [goTo]);
  const showNext = useCallback(() => goTo(1), [goTo]);

  // ---------- 필터: 목록 밖에서 바꿀 때는 카드가 새 자리로 미끄러진다 ----------

  const withTransition = useCallback((update: () => void) => {
    runViewTransition('filter', () => flushSync(update));
  }, []);

  const { toggleBrand, toggleDiscipline, toggleType, setStatusFilter, setSortBy, clearAllFilters } = filters;
  const { clearSearch } = search;

  const animatedToggleBrand = useCallback((brand: string) => withTransition(() => toggleBrand(brand)), [withTransition, toggleBrand]);
  const animatedClearBrands = useCallback(
    () => withTransition(() => selectedBrands.forEach((brand) => toggleBrand(brand))),
    [withTransition, selectedBrands, toggleBrand]
  );
  const animatedSetStatus = useCallback((status: StatusFilter) => withTransition(() => setStatusFilter(status)), [withTransition, setStatusFilter]);
  const animatedSetSort = useCallback((sort: SortOption) => withTransition(() => setSortBy(sort)), [withTransition, setSortBy]);
  const animatedClearAll = useCallback(
    () =>
      withTransition(() => {
        clearAllFilters();
        clearSearch();
      }),
    [withTransition, clearAllFilters, clearSearch]
  );
  const closeFilterPanel = useCallback(() => setFilterOpen(false), []);

  const activeChips = [
    ...(search.searchQuery ? [{ key: 'q', label: `"${search.searchQuery}"`, onRemove: clearSearch }] : []),
    ...(statusFilter !== 'all'
      ? [
          {
            key: 'status',
            label: STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? '',
            onRemove: () => animatedSetStatus('all'),
          },
        ]
      : []),
    ...[...selectedBrands].map((brand) => ({ key: `b-${brand}`, label: brand, onRemove: () => animatedToggleBrand(brand) })),
    ...[...selectedDisciplines].map((d) => ({
      key: `d-${d}`,
      label: getDisplayName(d),
      onRemove: () => withTransition(() => toggleDiscipline(d)),
    })),
    ...[...selectedTypes].map((t) => ({ key: `t-${t}`, label: t, onRemove: () => withTransition(() => toggleType(t)) })),
  ];

  return (
    <section id="catalog" className="relative mx-auto max-w-[1400px] scroll-mt-2 px-4 pb-24 pt-14 sm:px-6 lg:pt-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Catalog</p>
          <h2 className="mt-3 text-[clamp(30px,4.4vw,48px)] font-bold leading-[1.1] tracking-[-0.04em] text-fg">전체 목록</h2>
        </div>
        <p className="pb-1 text-[15px] text-fg-3" aria-live="polite">
          <span className="font-semibold tabular-nums text-fg">{filteredShoes.length}</span>
          {filteredShoes.length !== shoes.length && <span className="tabular-nums"> / {shoes.length}</span>}
          켤레
        </p>
      </div>

      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      {/* 상단에 붙는 도구 막대 */}
      <div className="catalog-toolbar sticky top-16 z-40 -mx-4 mt-5 px-4 py-3 sm:-mx-6 sm:px-6" data-stuck={stuck}>
        <div className="catalog-toolbar-bg absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 border-b border-line bg-canvas/80 backdrop-blur-xl backdrop-saturate-150" />
        <div className="relative flex items-center gap-2 lg:gap-3">
          <SearchBar
            searchInput={search.searchInput}
            setSearchInput={search.setSearchInput}
            isSearching={search.isSearching}
            clearSearch={clearSearch}
          />
          <StatusSegment
            value={statusFilter}
            onChange={animatedSetStatus}
            counts={filters.statusCounts}
            className="hidden w-[380px] shrink-0 lg:grid"
          />
          <div className="hidden lg:block">
            <SortMenu value={sortBy} onChange={animatedSetSort} />
          </div>
          <div className="lg:hidden">
            <SortMenu value={sortBy} onChange={animatedSetSort} compact />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            aria-label={`필터${filters.activeFilterCount > 0 ? `, ${filters.activeFilterCount}개 적용됨` : ''}`}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-control text-[14px] font-medium text-fg transition-colors duration-200 hover:bg-control-hover lg:w-auto lg:pl-4 lg:pr-3.5"
          >
            <SlidersIcon className="h-[18px] w-[18px]" />
            <span className="hidden lg:inline">필터</span>
            {filters.activeFilterCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1 text-[11px] font-bold tabular-nums text-volt-ink lg:static">
                {filters.activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-2">
        <BrandRail
          brands={filters.brandsWithCount}
          selected={selectedBrands}
          total={shoes.length}
          onToggle={animatedToggleBrand}
          onClear={animatedClearBrands}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="flex h-8 items-center gap-1 rounded-full bg-white/[0.06] pl-3 pr-1 text-[13px] text-fg-2"
            >
              <span className="max-w-[200px] truncate">{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`${chip.label} 필터 해제`}
                className="grid h-6 w-6 place-items-center rounded-full text-fg-3 transition-colors duration-150 hover:bg-white/10 hover:text-fg"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={animatedClearAll}
            className="h-8 rounded-full px-3 text-[13px] font-medium text-fg-3 underline-offset-4 transition-colors duration-150 hover:text-fg hover:underline"
          >
            모두 지우기
          </button>
        </div>
      )}

      {filteredShoes.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {filteredShoes.map((shoe) => (
            <ShoeCard
              key={shoe.productApplicationuuid}
              shoe={shoe}
              onOpen={openShoe}
              isNew={newIds.has(shoe.productApplicationuuid)}
              lifted={shoe.productApplicationuuid === selectedId}
            />
          ))}
        </div>
      ) : (
        <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={animatedClearAll} />
      )}

      {filterOpen && (
        <FilterPanel
          onClose={closeFilterPanel}
          resultCount={filteredShoes.length}
          sortBy={sortBy}
          setSortBy={setSortBy}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusCounts={filters.statusCounts}
          brandsWithCount={filters.brandsWithCount}
          selectedBrands={selectedBrands}
          toggleBrand={toggleBrand}
          disciplinesWithCount={filters.disciplinesWithCount}
          selectedDisciplines={selectedDisciplines}
          toggleDiscipline={toggleDiscipline}
          typesWithCount={filters.typesWithCount}
          selectedTypes={selectedTypes}
          toggleType={toggleType}
          activeFilterCount={filters.activeFilterCount}
          clearAllFilters={clearAllFilters}
        />
      )}

      {selectedShoe && (
        <ShoeModal
          shoe={selectedShoe}
          index={selectedIndex}
          total={filteredShoes.length}
          isNew={newIds.has(selectedShoe.productApplicationuuid)}
          closing={closingModal}
          direction={navDirection}
          onClose={closeShoe}
          onPrev={showPrev}
          onNext={showNext}
          hasPrev={selectedIndex > 0}
          hasNext={selectedIndex < filteredShoes.length - 1}
        />
      )}
    </section>
  );
}
