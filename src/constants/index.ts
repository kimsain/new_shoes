/**
 * Application Constants
 *
 * 매직 넘버 참조:
 * - 레이아웃: MAX_CONTENT_WIDTH (1400px), MIN_TOUCH_TARGET (44px)
 * - 상태 임계값: src/utils/date.ts의 THRESHOLDS (30일, 90일)
 * - 진행률: src/utils/progress.ts의 MAX_DAYS_FOR_PROGRESS (180일)
 * - 색상/스타일: src/styles/tokens.ts
 */

// API & Image URLs
export const DATA_URL = 'https://certcheck.worldathletics.org/FullList';
export const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/OpenDocument/';

// Brand priority order (sorted by market share)
export const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'] as const;

// Newest section count (top N shoes to show in "New" section)
export const NEWEST_SHOES_COUNT = 3;

// Search debounce delay (ms) - prevents excessive API calls
export const SEARCH_DEBOUNCE_MS = 300;

// Layout constants (for reference - used in Tailwind classes)
// MAX_CONTENT_WIDTH = 1400px → max-w-[1400px]
// MIN_TOUCH_TARGET = 44px → min-h-[44px], min-w-[44px] (WCAG 2.5.5)
