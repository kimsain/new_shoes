'use client';

import { StatusFilter, CountedItem, FilterColor } from '@/types/filters';
import { getDisplayName } from '@/utils/displayNames';
import FilterSection from './FilterSection';
import FilterChip from './FilterChip';

interface MobileFilterProps {
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

const STATUS_OPTIONS: { value: StatusFilter; label: string; color: FilterColor }[] = [
  { value: 'all', label: '전체', color: 'zinc' },
  { value: 'valid', label: '유효', color: 'emerald' },
  { value: 'expiring', label: '만료임박', color: 'amber' },
  { value: 'expired', label: '만료됨', color: 'red' },
];

export default function MobileFilter({
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
}: MobileFilterProps) {
  return (
    <div className="space-y-5">
      {/* Status */}
      <FilterSection title="상태">
        {STATUS_OPTIONS.map(({ value, label, color }) => (
          <FilterChip
            key={value}
            label={label}
            active={statusFilter === value}
            onClick={() => setStatusFilter(value)}
            color={color}
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
            label={`${getDisplayName(name)} (${count})`}
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
}
