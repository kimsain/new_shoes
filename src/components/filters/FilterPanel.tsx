'use client';

import { useCallback, useEffect, useReducer, useRef, type ReactNode, type TouchEvent } from 'react';
import { CountedItem, SortOption, StatusFilter } from '@/types/filters';
import { getDisplayName } from '@/utils/displayNames';
import { MOTION } from '@/styles/tokens';
import { getSheetOffset, initialSheetState, sheetReducer } from '@/lib/sheetMachine';
import { CloseIcon } from '../icons';
import { STATUS_OPTIONS } from '../StatusSegment';
import { SORT_OPTIONS } from '../SortMenu';

interface FilterPanelProps {
  /** 나가는 애니메이션이 끝난 뒤 불린다. 부모는 이때 패널을 내린다 */
  onClose: () => void;
  resultCount: number;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  statusCounts: Record<StatusFilter, number>;
  brandsWithCount: CountedItem[];
  selectedBrands: Set<string>;
  toggleBrand: (brand: string) => void;
  disciplinesWithCount: CountedItem[];
  selectedDisciplines: Set<string>;
  toggleDiscipline: (discipline: string) => void;
  typesWithCount: CountedItem[];
  selectedTypes: Set<string>;
  toggleType: (type: string) => void;
  activeFilterCount: number;
  clearAllFilters: () => void;
}

/**
 * 모바일에서는 아래에서 올라오는 바텀시트, 데스크톱에서는 오른쪽 서랍.
 * 같은 마크업에 globals.css의 panel-in / panel-out이 화면 너비에 맞는 방향을 고른다.
 * 부모는 열려 있는 동안에만 이 컴포넌트를 렌더한다.
 * 등장, 끌기, 닫힘 순서는 src/lib/sheetMachine.ts의 상태 기계가 정한다.
 */
export default function FilterPanel(props: FilterPanelProps) {
  const { onClose } = props;
  const [sheet, dispatch] = useReducer(sheetReducer, initialSheetState);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragY = getSheetOffset(sheet);
  const closing = sheet.phase === 'closing';

  const handleClose = useCallback(() => dispatch({ type: 'CLOSE' }), []);

  // 나가는 애니메이션이 끝나면 부모에게 알린다. closing에는 한 번만 들어가므로 onClose도 한 번만 불린다
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClose, MOTION.sheetExit);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);

  useEffect(() => {
    const root = document.documentElement;
    const returnFocus = document.activeElement as HTMLElement | null;
    root.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      root.style.overflow = '';
      returnFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    dispatch({ type: 'DRAG_START', y: e.touches[0].clientY });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    dispatch({ type: 'DRAG_MOVE', y: e.touches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback(() => dispatch({ type: 'DRAG_END' }), []);

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${closing ? 'overlay-out' : 'overlay-in'}`}
        style={dragY > 0 ? { opacity: Math.max(0.3, 1 - dragY / 400) } : undefined}
        onClick={handleClose}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="필터"
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[28px] border-t border-line-strong bg-surface outline-none lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[420px] lg:rounded-l-[28px] lg:rounded-tr-none lg:border-l lg:border-t-0 ${
          closing ? 'panel-out' : sheet.phase === 'entering' ? 'panel-in' : ''
        }`}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: sheet.phase === 'dragging' || closing ? 'none' : 'transform 300ms var(--ease-out)',
        }}
      >
        {/* 끌어서 닫는 손잡이 (모바일) */}
        <div
          className="flex touch-none justify-center pb-1 pt-3 lg:hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <span className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3 pt-2 lg:px-6 lg:pt-6">
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-fg">필터</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="필터 닫기"
            className="grid h-10 w-10 place-items-center rounded-full text-fg-2 transition-colors duration-150 hover:bg-white/[0.08] hover:text-fg"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 pb-6 pt-2 lg:px-6">
          <Section title="정렬" className="lg:hidden">
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <Pill key={option.value} active={props.sortBy === option.value} onClick={() => props.setSortBy(option.value)}>
                  {option.label}
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="인증 상태">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <Pill
                  key={option.value}
                  active={props.statusFilter === option.value}
                  onClick={() => props.setStatusFilter(option.value)}
                >
                  {option.dot && <span className={`h-1.5 w-1.5 rounded-full ${option.dot}`} aria-hidden="true" />}
                  {option.label}
                  <span className="tabular-nums text-[12px] opacity-60">{props.statusCounts[option.value]}</span>
                </Pill>
              ))}
            </div>
          </Section>

          <Section title="브랜드" count={props.selectedBrands.size}>
            <div className="grid grid-cols-2 gap-x-3">
              {props.brandsWithCount.map(({ name, count }) => (
                <CheckRow
                  key={name}
                  label={name}
                  count={count}
                  checked={props.selectedBrands.has(name)}
                  onChange={() => props.toggleBrand(name)}
                />
              ))}
            </div>
          </Section>

          <Section title="종목" count={props.selectedDisciplines.size}>
            {props.disciplinesWithCount.map(({ name, count }) => (
              <CheckRow
                key={name}
                label={getDisplayName(name)}
                count={count}
                checked={props.selectedDisciplines.has(name)}
                onChange={() => props.toggleDiscipline(name)}
              />
            ))}
          </Section>

          <Section title="유형" count={props.selectedTypes.size}>
            {props.typesWithCount.map(({ name, count }) => (
              <CheckRow
                key={name}
                label={name}
                count={count}
                checked={props.selectedTypes.has(name)}
                onChange={() => props.toggleType(name)}
              />
            ))}
          </Section>
        </div>

        <div className="flex gap-2 border-t border-line px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 lg:px-6 lg:pb-6">
          <button
            type="button"
            onClick={props.clearAllFilters}
            disabled={props.activeFilterCount === 0}
            className="h-12 rounded-full px-5 text-[15px] font-medium text-fg-2 transition-colors duration-150 hover:bg-white/[0.06] hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="h-12 flex-1 rounded-full bg-volt text-[15px] font-semibold text-volt-ink transition-transform duration-150 active:scale-[0.98]"
          >
            <span className="tabular-nums">{props.resultCount}</span>켤레 보기
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  count,
  className = '',
  children,
}: {
  title: string;
  count?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={className}>
      <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-fg-3">
        {title}
        {count !== undefined && count > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-volt px-1.5 text-[11px] font-bold tabular-nums text-volt-ink">
            {count}
          </span>
        )}
      </h3>
      {children}
    </section>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-colors duration-150 ${
        active ? 'border-fg bg-fg text-canvas' : 'border-line-strong text-fg-2 hover:border-white/25 hover:text-fg'
      }`}
    >
      {children}
    </button>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl px-1 text-[14px]">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
      <span
        aria-hidden="true"
        className="check-box grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border border-white/25 text-volt-ink transition-colors duration-150 group-hover:border-white/45 peer-checked:border-volt peer-checked:bg-volt peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-volt"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path className="check-path" d="m3.5 8.5 3 3 6-7" />
        </svg>
      </span>
      <span className={`min-w-0 flex-1 truncate ${checked ? 'text-fg' : 'text-fg-2'}`} title={label}>
        {label}
      </span>
      <span className="tabular-nums text-[12px] text-fg-4">{count}</span>
    </label>
  );
}
