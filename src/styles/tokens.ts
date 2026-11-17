/**
 * Design Tokens
 *
 * 색, 글꼴, 모서리, 모션 곡선은 globals.css의 @theme에 CSS 변수로 정의하고
 * Tailwind 유틸리티(bg-canvas, text-fg-2, bg-volt ...)로 쓴다.
 * 이 파일에는 런타임에 골라 써야 하는 클래스 묶음만 둔다.
 *
 * Tailwind JIT는 `bg-${color}` 같은 동적 클래스를 만들지 못하므로 전체 클래스명을 적는다.
 */

// ============================================
// STATUS (D-day)
// text: 카드 숫자(평소 흰색, 급할 때만 색), emphasis: 상세 화면의 큰 숫자
// ============================================

export const STATUS = {
  expired: {
    label: '만료',
    text: 'text-fg-3',
    emphasis: 'text-fg-3',
    bar: 'bg-fg-4',
    dot: 'bg-fg-4',
    chip: 'bg-white/[0.06] text-fg-3',
  },
  urgent: {
    label: '30일 이내',
    text: 'text-hot',
    emphasis: 'text-hot',
    bar: 'bg-hot',
    dot: 'bg-hot',
    chip: 'bg-hot/15 text-hot',
  },
  warning: {
    label: '90일 이내',
    text: 'text-warn',
    emphasis: 'text-warn',
    bar: 'bg-warn',
    dot: 'bg-warn',
    chip: 'bg-warn/15 text-warn',
  },
  safe: {
    label: '유효',
    text: 'text-fg',
    emphasis: 'text-volt',
    bar: 'bg-volt',
    dot: 'bg-volt',
    chip: 'bg-volt/15 text-volt',
  },
  unknown: {
    label: '기간 미정',
    text: 'text-fg-3',
    emphasis: 'text-fg-3',
    bar: 'bg-fg-4',
    dot: 'bg-fg-4',
    chip: 'bg-white/[0.06] text-fg-3',
  },
} as const;

export type StatusLevel = keyof typeof STATUS;

// ============================================
// MOTION (ms) - globals.css의 애니메이션 시간과 맞춘다
// ============================================

export const MOTION = {
  popupExit: 150,
  sheetExit: 250,
  countUp: 900,
} as const;
