'use client';

import { StatusFilter, CountedItem } from '@/types/filters';
import { getDisplayName } from '@/utils/displayNames';
import { TEXT, BUTTON } from '@/styles/tokens';

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

// 상태 필터 옵션
const STATUS_OPTIONS = [
  { value: 'all' as const, label: '전체' },
  { value: 'valid' as const, label: '유효' },
  { value: 'expiring' as const, label: '임박' },
  { value: 'expired' as const, label: '만료' },
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
    <div className="space-y-5">
      {/* Status - Segment Control */}
      <FilterSection title="상태">
        <div className="segment-control">
          {STATUS_OPTIONS.map(({ value, label }) => {
            const isActive = statusFilter === value;
            return (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`segment-item ${isActive ? 'active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Brands - Toggle Chips Grid */}
      <FilterSection
        title="브랜드"
        selectedCount={selectedBrands.size}
      >
        <div className="grid grid-cols-2 gap-2">
          {brandsWithCount.map(({ name, count }) => {
            const isActive = selectedBrands.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleBrand(name)}
                className={`toggle-chip ${isActive ? 'active' : ''}`}
              >
                <span className="truncate">{name}</span>
                <span className="text-[10px] text-zinc-600">{count}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Disciplines - Collapsible List */}
      <FilterSection
        title="종목"
        selectedCount={selectedDisciplines.size}
      >
        <div className="space-y-1 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
          {disciplinesWithCount.map(({ name, count }) => {
            const isActive = selectedDisciplines.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleDiscipline(name)}
                className={`filter-list-item ${isActive ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-zinc-600'}`} />
                  <span className="truncate">{getDisplayName(name)}</span>
                </span>
                <span className="text-[10px] text-zinc-600 flex-shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Types - Toggle Chips */}
      <FilterSection
        title="유형"
        selectedCount={selectedTypes.size}
      >
        <div className="space-y-1">
          {typesWithCount.map(({ name, count }) => {
            const isActive = selectedTypes.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleType(name)}
                className={`filter-list-item ${isActive ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-zinc-600'}`} />
                  <span className="truncate">{name}</span>
                </span>
                <span className="text-[10px] text-zinc-600 flex-shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Clear All */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearAllFilters}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm ${BUTTON.secondary.bg} border ${BUTTON.secondary.border} ${BUTTON.secondary.text} ${BUTTON.secondary.hover} transition-all`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          초기화
        </button>
      )}
    </div>
  );
}

function FilterSection({
  title,
  selectedCount,
  children,
}: {
  title: string;
  selectedCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-[11px] font-medium uppercase tracking-[0.05em] ${TEXT.muted}`}>
          {title}
        </h4>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="text-[10px] text-indigo-400">{selectedCount}</span>
        )}
      </div>
      {children}
    </div>
  );
}
