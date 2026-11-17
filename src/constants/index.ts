/**
 * Application Constants
 *
 * 매직 넘버 참조:
 * - 레이아웃: max-w-[1400px] 컨테이너, min-h-[44px] 터치 영역 (WCAG 2.5.5)
 * - 상태 임계값: src/utils/date.ts의 THRESHOLDS (30일, 90일)
 * - 진행률: src/utils/progress.ts (각 신발의 실제 인증 기간 기준)
 * - 색과 모션: src/app/globals.css의 @theme, src/styles/tokens.ts
 */

// API & Image URLs
export const DATA_URL = 'https://certcheck.worldathletics.org/FullList';
export const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/OpenDocument/';
export const GITHUB_URL = 'https://github.com/kimsain/new_shoes';

// Brand priority order (sorted by market share)
export const PRIORITY_BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics'] as const;

// 인증 시작 후 이 기간 안이면 NEW 표시
export const NEW_WINDOW_DAYS = 30;

// 히어로 사진 벽에 쓰는 최신 신발 수 (3줄로 나눈다)
export const HERO_WALL_COUNT = 18;

// Search debounce delay (ms)
export const SEARCH_DEBOUNCE_MS = 300;

// 카드 사진의 sizes. 상세 화면도 같은 값을 써서 이미 받은 사진을 그대로 재사용한다.
export const CARD_IMAGE_SIZES =
  '(min-width: 1280px) 330px, (min-width: 1024px) 31vw, (min-width: 640px) 48vw, 50vw';
