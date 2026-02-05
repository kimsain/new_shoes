'use client';

import { StatusFilter, CountedItem } from '@/types/filters';
import { getDisplayName } from '@/utils/displayNames';

interface SidebarFilterProps {
  // Status
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  // Brands
  brandsWithCount: CountedItem[];
  selectedBrands: Set<string>;
  toggleBrand: (brand: string) => void;
  // Disciplines
  disciplinesWithCount: CountedItem[];
  selectedDisciplines: Set<string>;
  toggleDiscipline: (discipline: string) => void;
  // Types
  typesWithCount: CountedItem[];
  selectedTypes: Set<string>;
  toggleType: (type: string) => void;
  // Actions
  activeFilterCount: number;
  clearAllFilters: () => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체', color: 'zinc' },
  { value: 'valid', label: '유효', color: 'emerald' },
  { value: 'expiring', label: '만료 임박', color: 'amber' },
  { value: 'expired', label: '만료됨', color: 'red' },
] as const;

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
          {STATUS_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                statusFilter === value
                  ? `bg-${color}-500/15 text-${color}-400`
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  statusFilter === value ? `bg-${color}-400` : 'bg-zinc-600'
                }`}
              />
              {label}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Brands */}
      <FilterGroup title="브랜드" selectedCount={selectedBrands.size} selectedColor="emerald">
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
          {brandsWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={name}
              count={count}
              checked={selectedBrands.has(name)}
              onClick={() => toggleBrand(name)}
              color="emerald"
            />
          ))}
        </div>
      </FilterGroup>

      {/* Disciplines */}
      <FilterGroup title="종목" selectedCount={selectedDisciplines.size} selectedColor="sky">
        <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin">
          {disciplinesWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={getDisplayName(name)}
              count={count}
              checked={selectedDisciplines.has(name)}
              onClick={() => toggleDiscipline(name)}
              color="sky"
            />
          ))}
        </div>
      </FilterGroup>

      {/* Types */}
      <FilterGroup title="신발 유형" selectedCount={selectedTypes.size} selectedColor="violet">
        <div className="space-y-1">
          {typesWithCount.map(({ name, count }) => (
            <CheckboxItem
              key={name}
              label={name}
              count={count}
              checked={selectedTypes.has(name)}
              onClick={() => toggleType(name)}
              color="violet"
            />
          ))}
        </div>
      </FilterGroup>

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all"
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
  selectedColor?: 'emerald' | 'sky' | 'violet';
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{title}</h4>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className={`text-xs text-${selectedColor}-400`}>{selectedCount}개 선택</span>
        )}
      </div>
      {children}
    </div>
  );
}

function CheckboxItem({
  label,
  count,
  checked,
  onClick,
  color,
}: {
  label: string;
  count: number;
  checked: boolean;
  onClick: () => void;
  color: 'emerald' | 'sky' | 'violet';
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
        checked
          ? `bg-${color}-500/15 text-${color}-400`
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-2 min-w-0">
        <span
          className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center ${
            checked ? `bg-${color}-500 border-${color}-500` : 'border-zinc-600'
          }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span className="break-words text-left">{label}</span>
      </span>
      <span className="text-xs text-zinc-600 flex-shrink-0 ml-2">{count}</span>
    </button>
  );
}
