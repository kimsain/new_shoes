'use client';

import { useCallback, useMemo } from 'react';
import { StatusFilter, CountedItem } from '@/types/filters';

interface MobilePresetChipsProps {
  selectedBrands: Set<string>;
  toggleBrand: (brand: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (status: StatusFilter) => void;
  selectedDisciplines: Set<string>;
  toggleDiscipline: (discipline: string) => void;
  disciplinesWithCount: CountedItem[];
}

interface PresetChip {
  id: string;
  label: string;
  isActive: boolean;
  onToggle: () => void;
  activeStyle: string;
}

// Road Races discipline name (the full name used in data)
const ROAD_RACES_DISCIPLINE = 'Road Races (including Track Race Walking Events)';

export default function MobilePresetChips({
  selectedBrands,
  toggleBrand,
  statusFilter,
  setStatusFilter,
  selectedDisciplines,
  toggleDiscipline,
  disciplinesWithCount,
}: MobilePresetChipsProps) {
  const handleExpiringToggle = useCallback(() => {
    setStatusFilter(statusFilter === 'expiring' ? 'all' : 'expiring');
  }, [statusFilter, setStatusFilter]);

  // Check if Road Races discipline exists in the data
  const hasRoadRaces = useMemo(
    () => disciplinesWithCount.some((d) => d.name === ROAD_RACES_DISCIPLINE),
    [disciplinesWithCount]
  );

  const presets: PresetChip[] = useMemo(() => {
    const chips: PresetChip[] = [
      {
        id: 'expiring',
        label: '만료 임박',
        isActive: statusFilter === 'expiring',
        onToggle: handleExpiringToggle,
        activeStyle: 'bg-red-500/15 border-red-500/50 text-red-400',
      },
      {
        id: 'nike',
        label: 'Nike',
        isActive: selectedBrands.has('Nike'),
        onToggle: () => toggleBrand('Nike'),
        activeStyle: 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300',
      },
      {
        id: 'adidas',
        label: 'Adidas',
        isActive: selectedBrands.has('Adidas'),
        onToggle: () => toggleBrand('Adidas'),
        activeStyle: 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300',
      },
      {
        id: 'puma',
        label: 'Puma',
        isActive: selectedBrands.has('Puma'),
        onToggle: () => toggleBrand('Puma'),
        activeStyle: 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300',
      },
    ];

    if (hasRoadRaces) {
      chips.push({
        id: 'road-races',
        label: '러닝화',
        isActive: selectedDisciplines.has(ROAD_RACES_DISCIPLINE),
        onToggle: () => toggleDiscipline(ROAD_RACES_DISCIPLINE),
        activeStyle: 'bg-violet-500/15 border-violet-500/50 text-violet-300',
      });
    }

    return chips;
  }, [statusFilter, selectedBrands, selectedDisciplines, hasRoadRaces, handleExpiringToggle, toggleBrand, toggleDiscipline]);

  return (
    <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={preset.onToggle}
          className={`flex-shrink-0 px-3 py-1.5 min-h-[36px] rounded-full border text-xs font-medium transition-all duration-200 btn-haptic ${
            preset.isActive
              ? preset.activeStyle
              : 'bg-transparent border-white/[0.08] text-zinc-400 hover:border-white/[0.15] hover:text-zinc-300'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
