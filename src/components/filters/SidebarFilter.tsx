'use client';

import { StatusFilter, CountedItem } from '@/types/filters';
import { getDisplayName } from '@/utils/displayNames';
import { FILTER, TEXT, BG, BUTTON, BORDER } from '@/styles/tokens';

interface SidebarFilterProps {
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
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

// 상태 필터 옵션 (Tailwind JIT를 위해 전체 클래스 명시)
const STATUS_OPTIONS = [
  {
    value: 'all' as const,
    label: '전체',
    active: { bg: 'bg-zinc-700', text: 'text-white', dot: 'bg-white' },
    inactive: { bg: '', text: 'text-zinc-400', dot: 'bg-zinc-600' },
  },
  {
    value: 'valid' as const,
    label: '유효',
    active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    inactive: { bg: '', text: 'text-zinc-400', dot: 'bg-zinc-600' },
  },
  {
    value: 'expiring' as const,
    label: '만료 임박',
    active: { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400' },
    inactive: { bg: '', text: 'text-zinc-400', dot: 'bg-zinc-600' },
  },
  {
    value: 'expired' as const,
    label: '만료됨',
    active: { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400' },
    inactive: { bg: '', text: 'text-zinc-400', dot: 'bg-zinc-600' },
  },
];

export default function SidebarFilter({
  statusFilter,
  setStatusFilter,
  brandsWithCount,
  selectedBrands,
  toggleBrand,
  disciplinesWithCount,
  selectedDisciplines,
  toggleDiscipline,
  typesWithCount,
  selectedTypes,
  toggleType,
  activeFilterCount,
  clearAllFilters,
}: SidebarFilterProps) {
  return (
    <div className="space-y-6">
      {/* Status */}
      <FilterGroup title="승인 상태">
        <div className="space-y-1">
          {STATUS_OPTIONS.map(({ value, label, active, inactive }) => {
            const isActive = statusFilter === value;
            const colors = isActive ? active : inactive;
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive ? `${colors.bg} ${colors.text}` : `${colors.text} hover:bg-white/5 hover:text-white`
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                {label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* Brands */}
      <FilterGroup
        title="브랜드"
        selectedCount={selectedBrands.size}
        selectedColor="text-emerald-400"
      >
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
          {brandsWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={name}
              count={count}
              checked={selectedBrands.has(name)}
              onClick={() => toggleBrand(name)}
              colors={FILTER.brand}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Disciplines */}
      <FilterGroup
        title="종목"
        selectedCount={selectedDisciplines.size}
        selectedColor="text-sky-400"
      >
        <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
          {disciplinesWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={getDisplayName(name)}
              count={count}
              checked={selectedDisciplines.has(name)}
              onClick={() => toggleDiscipline(name)}
              colors={FILTER.discipline}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Types */}
      <FilterGroup
        title="신발 유형"
        selectedCount={selectedTypes.size}
        selectedColor="text-violet-400"
      >
        <div className="space-y-1">
          {typesWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={name}
              count={count}
              checked={selectedTypes.has(name)}
              onClick={() => toggleType(name)}
              colors={FILTER.type}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm ${BUTTON.danger.text} ${BUTTON.danger.bgHover} border ${BUTTON.danger.border} transition-all`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          필터 초기화
        </button>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  selectedCount,
  selectedColor,
  children,
}: {
  title: string;
  selectedCount?: number;
  selectedColor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-xs font-semibold ${TEXT.tertiary} uppercase tracking-wider`}>{title}</h4>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className={`text-xs ${selectedColor}`}>{selectedCount}개 선택</span>
        )}
      </div>
      {children}
    </div>
  );
}

interface FilterColors {
  active: { bg: string; text: string; checkbox: string };
  inactive: { bg: string; text: string; checkbox: string };
}

function CheckboxItem({
  label,
  count,
  checked,
  onClick,
  colors,
}: {
  label: string;
  count: number;
  checked: boolean;
  onClick: () => void;
  colors: FilterColors;
}) {
  const style = checked ? colors.active : colors.inactive;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${style.bg} ${style.text} ${
        !checked ? 'hover:bg-white/5 hover:text-white' : ''
      }`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span
          className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${style.checkbox}`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="break-words text-left">{label}</span>
      </span>
      <span className={`text-xs ${TEXT.disabled} flex-shrink-0 ml-2`}>{count}</span>
    </button>
  );
}
