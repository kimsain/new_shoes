// API & Image URLs
export const DATA_URL = 'https://certcheck.worldathletics.org/FullList';
export const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/OpenDocument/';

// Brand priority order
export const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'] as const;

// Status thresholds (days)
export const STATUS_THRESHOLDS = {
  EXPIRED: 0,
  URGENT: 30,
  WARNING: 90,
} as const;

// Newest section count
export const NEWEST_SHOES_COUNT = 3;

// Debounce delay (ms)
export const SEARCH_DEBOUNCE_MS = 300;

// Status colors mapping
export const STATUS_COLORS = {
  expired: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
  urgent: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  warning: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400',
  },
  safe: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  unknown: {
    bg: 'bg-zinc-800',
    text: 'text-zinc-400',
    border: 'border-zinc-500/20',
    dot: 'bg-zinc-400',
  },
} as const;

// Filter colors
export const FILTER_COLORS = {
  brand: 'emerald',
  discipline: 'sky',
  type: 'violet',
  status: {
    all: 'zinc',
    valid: 'emerald',
    expiring: 'amber',
    expired: 'red',
  },
} as const;
