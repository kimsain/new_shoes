export type StatusFilter = 'all' | 'valid' | 'expiring' | 'expired';

export type SortOption = 'newest' | 'expiring' | 'alphabetical';

export type FilterColor = 'emerald' | 'sky' | 'violet' | 'amber' | 'red' | 'zinc';

export interface FilterState {
  selectedBrands: Set<string>;
  selectedDisciplines: Set<string>;
  selectedTypes: Set<string>;
  statusFilter: StatusFilter;
  searchQuery: string;
  sortBy: SortOption;
}

export interface CountedItem {
  name: string;
  count: number;
}
