'use client';

interface EmptyStateProps {
  onClearFilters?: () => void;
  hasActiveFilters: boolean;
}

export default function EmptyState({ onClearFilters, hasActiveFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-24 animate-fade-in">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/[0.06]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
      <p className="text-zinc-400 mb-2 max-w-sm mx-auto">
        No shoes match your current filters
      </p>
      <p className="text-zinc-500 text-sm mb-8">
        Try adjusting your search or filters
      </p>
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 min-h-[48px] rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium hover:from-indigo-600 hover:to-violet-600 active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
