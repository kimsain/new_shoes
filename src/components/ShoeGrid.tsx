'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Shoe } from '@/types/shoe';
import { SortOption, StatusFilter } from '@/types/filters';
import { NEW_WINDOW_DAYS } from '@/constants';
import { MOTION } from '@/styles/tokens';
import { useFilters, filterAndSortShoes } from '@/hooks/useFilters';
import { useSearch } from '@/hooks/useSearch';
import { useToday } from '@/hooks/useToday';
import { getDaysSince } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';
import { runViewTransition, supportsViewTransition } from '@/lib/motion';
import { detailReducer, getDetailId, initialDetailState } from '@/lib/detailMachine';

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
  /** 서버가 이 페이지를 렌더한 시각(ms). 하이드레이션 때 D-day를 서버와 같게 계산한다 */
  renderedAt: number;
}

const HEADER_HEIGHT = 64;

function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return rect.bottom > HEADER_HEIGHT && rect.top < window.innerHeight;
}

function focusCardButton(id: string) {
  document.querySelector<HTMLElement>(`[data-card-button="${id}"]`)?.focus({ preventScroll: true });
}

export default function ShoeGrid({ shoes, renderedAt }: ShoeGridProps) {
  const today = useToday(renderedAt);
  const filters = useFilters(shoes, today);
  const search = useSearch();
  // 상세 화면: closed / open / exiting. 전이 규칙은 src/lib/detailMachine.ts에 있다
  const [detail, dispatchDetail] = useReducer(detailReducer, initialDetailState);
  const selectedId = getDetailId(detail);
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
      }, today),
    [shoes, selectedBrands, selectedDisciplines, selectedTypes, statusFilter, search.searchQuery, sortBy, today]
  );

  const newIds = useMemo(() => {
    const ids = new Set<string>();
    shoes.forEach((shoe) => {
      const days = getDaysSince(shoe.certificationStartDateExp, today);
      if (days !== null && days >= 0 && days <= NEW_WINDOW_DAYS) ids.add(shoe.productApplicationuuid);
    });
    return ids;
  }, [shoes, today]);

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

    if (!media || !supportsViewTransition()) {
      dispatchDetail({ type: 'OPEN', id, morph: false });
      return;
    }

    media.style.viewTransitionName = 'shoe-media';
    runViewTransition('open', () => {
      media.style.viewTransitionName = '';
      flushSync(() => dispatchDetail({ type: 'OPEN', id, morph: true }));
    });
  }, []);

  const closeShoe = useCallback(() => {
    // 이미 닫히는 중이면 무시한다 (ESC를 두 번 눌러도 타이머가 겹치지 않는다)
    if (detail.phase !== 'open') return;
    const id = detail.id;
    const media = document.querySelector<HTMLElement>(`[data-media="${id}"]`);

    // 카드가 화면에 보이면 사진이 카드 자리로 날아가며 닫힌다
    if (media && supportsViewTransition() && isInViewport(media)) {
      const transition = runViewTransition('close', () => {
        flushSync(() => dispatchDetail({ type: 'CLOSED' }));
        media.style.viewTransitionName = 'shoe-media';
      });
      transition?.finished
        .catch(() => undefined)
        .finally(() => {
          media.style.viewTransitionName = '';
          focusCardButton(id);
        });
      return;
    }

    // 그 밖에는 CSS 닫힘 애니메이션(popup-out)을 돌린 뒤 아래 효과가 내린다
    dispatchDetail({ type: 'EXIT' });
  }, [detail]);

  // exiting에 들어가면 애니메이션 시간만큼 기다렸다가 닫고 카드로 포커스를 돌려준다
  const exitingId = detail.phase === 'exiting' ? detail.id : null;
  useEffect(() => {
    if (!exitingId) return;
    const timer = window.setTimeout(() => {
      dispatchDetail({ type: 'CLOSED' });
      focusCardButton(exitingId);
    }, MOTION.popupExit);
    return () => window.clearTimeout(timer);
  }, [exitingId]);

  const goTo = useCallback(
    (delta: 1 | -1) => {
      const next = filteredShoes[selectedIndex + delta];
      if (selectedIndex < 0 || !next) return;
      dispatchDetail({ type: 'NAVIGATE', id: next.productApplicationuuid, direction: delta > 0 ? 'right' : 'left' });
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
              today={today}
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
          closing={detail.phase === 'exiting'}
          direction={detail.phase === 'closed' ? null : detail.direction}
          morph={detail.phase !== 'closed' && detail.morph}
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
