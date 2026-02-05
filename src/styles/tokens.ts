/**
 * Design Tokens - 색상 및 스타일 일관성을 위한 토큰 시스템
 *
 * 모든 색상 값은 이 파일에서 관리되며, 컴포넌트에서 직접 참조합니다.
 * Tailwind JIT 컴파일러가 동적 클래스를 인식할 수 있도록 전체 클래스명을 사용합니다.
 */

// ============================================
// SEMANTIC COLORS
// ============================================

/** 배경 색상 */
export const BG = {
  // 페이지/섹션 배경
  page: 'bg-[#0a0a0a]',

  // 표면 (카드, 모달, 사이드바 등)
  surface: {
    primary: 'bg-zinc-900',       // 모달, 바텀시트
    secondary: 'bg-zinc-900/50',  // 사이드바
    tertiary: 'bg-zinc-950/50',   // 카드 이미지 영역
  },

  // 인터랙티브 요소 (버튼, 입력창)
  interactive: {
    default: 'bg-white/[0.03]',
    hover: 'bg-white/[0.06]',
    active: 'bg-white/10',
  },

  // 오버레이
  overlay: {
    light: 'bg-black/40',
    medium: 'bg-black/60',
    heavy: 'bg-black/70',
  },

  // 플레이스홀더
  placeholder: 'bg-zinc-800/50',
} as const;

/** 테두리 색상 */
export const BORDER = {
  subtle: 'border-white/[0.06]',
  default: 'border-white/10',
  hover: 'border-white/[0.15]',
  focus: 'border-emerald-500/50',
} as const;

/** 텍스트 색상 */
export const TEXT = {
  primary: 'text-white',
  secondary: 'text-zinc-300',
  tertiary: 'text-zinc-400',
  muted: 'text-zinc-500',
  disabled: 'text-zinc-600',
} as const;

// ============================================
// ACCENT COLORS (Primary Brand)
// ============================================

export const ACCENT = {
  // 솔리드
  solid: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-emerald-400',
    textHover: 'hover:text-emerald-400',
    border: 'border-emerald-500',
  },
  // 서브틀 (배지, 칩 등)
  subtle: {
    bg: 'bg-emerald-500/15',
    bgHover: 'hover:bg-emerald-500/20',
    border: 'border-emerald-500/30',
  },
  // 그라데이션
  gradient: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
  // 글로우
  shadow: 'shadow-emerald-500/20',
  shadowHover: 'hover:shadow-emerald-500/30',
} as const;

// ============================================
// STATUS COLORS
// ============================================

/** 상태별 색상 (D-day 표시용) */
export const STATUS = {
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
    bg: 'bg-zinc-800/50',
    text: 'text-zinc-400',
    border: 'border-zinc-500/20',
    dot: 'bg-zinc-400',
  },
} as const;

export type StatusLevel = keyof typeof STATUS;

// ============================================
// FILTER COLORS
// ============================================

/** 필터 카테고리별 색상 */
export const FILTER = {
  brand: {
    active: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      checkbox: 'bg-emerald-500 border-emerald-500',
    },
    inactive: {
      bg: BG.interactive.default,
      text: TEXT.tertiary,
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  discipline: {
    active: {
      bg: 'bg-sky-500/15',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
      checkbox: 'bg-sky-500 border-sky-500',
    },
    inactive: {
      bg: BG.interactive.default,
      text: TEXT.tertiary,
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  type: {
    active: {
      bg: 'bg-violet-500/15',
      text: 'text-violet-400',
      border: 'border-violet-500/30',
      checkbox: 'bg-violet-500 border-violet-500',
    },
    inactive: {
      bg: BG.interactive.default,
      text: TEXT.tertiary,
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  status: {
    all: {
      active: { bg: 'bg-zinc-700', text: 'text-white', border: 'border-zinc-600' },
      inactive: { bg: BG.interactive.default, text: TEXT.tertiary, border: 'border-transparent' },
    },
    valid: {
      active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      inactive: { bg: BG.interactive.default, text: TEXT.tertiary, border: 'border-transparent' },
    },
    expiring: {
      active: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
      inactive: { bg: BG.interactive.default, text: TEXT.tertiary, border: 'border-transparent' },
    },
    expired: {
      active: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
      inactive: { bg: BG.interactive.default, text: TEXT.tertiary, border: 'border-transparent' },
    },
  },
} as const;

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

/** 카드 스타일 */
export const CARD = {
  bg: 'bg-[#131313]',
  bgHover: 'hover:bg-[#181818]',
  border: BORDER.subtle,
  borderHover: 'hover:border-white/[0.15]',
  image: {
    bg: 'bg-zinc-950/50',
    placeholder: 'bg-zinc-800/50',
  },
} as const;

/** 모달 스타일 */
export const MODAL = {
  backdrop: 'bg-black/70',
  container: 'bg-zinc-900',
  border: 'border-white/5',
  imageBg: 'bg-black/40',
} as const;

/** 바텀시트 스타일 */
export const BOTTOMSHEET = {
  backdrop: 'bg-black/60',
  container: 'bg-zinc-900',
  handle: 'bg-zinc-600',
  border: 'border-white/10',
  footer: 'bg-zinc-900/95',
} as const;

/** 버튼 스타일 */
export const BUTTON = {
  primary: {
    bg: 'bg-emerald-500',
    bgHover: 'hover:bg-emerald-600',
    text: 'text-white',
    shadow: 'shadow-lg shadow-emerald-500/20',
    shadowHover: 'hover:shadow-emerald-500/30',
  },
  secondary: {
    bg: BG.interactive.default,
    bgHover: `hover:${BG.interactive.hover}`,
    text: TEXT.tertiary,
    textHover: 'hover:text-white',
    border: BORDER.subtle,
    borderHover: 'hover:border-white/10',
  },
  danger: {
    text: 'text-red-400',
    bgHover: 'hover:bg-red-500/10',
    border: 'border-red-500/20',
    borderHover: 'hover:border-red-500/30',
  },
} as const;

/** 입력 필드 스타일 */
export const INPUT = {
  bg: BG.interactive.default,
  bgFocus: 'focus:bg-white/[0.05]',
  text: TEXT.primary,
  placeholder: 'placeholder-zinc-500',
  border: BORDER.subtle,
  borderFocus: `focus:${BORDER.focus}`,
} as const;

/** 태그/칩 스타일 */
export const CHIP = {
  default: {
    bg: 'bg-zinc-800/70',
    text: TEXT.secondary,
  },
  interactive: {
    bg: 'bg-white/5',
    bgHover: 'hover:bg-white/10',
    text: TEXT.secondary,
  },
} as const;

/** 배지 스타일 */
export const BADGE = {
  new: {
    bg: 'bg-emerald-500',
    text: 'text-white',
  },
  brand: {
    bg: 'bg-black/50',
    text: 'text-white/90',
  },
  section: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
  },
} as const;

// ============================================
// UTILITY CLASSES
// ============================================

/** 공통 유틸리티 조합 */
export const UTILS = {
  // 글래스모피즘
  glass: 'backdrop-blur-md',

  // 포커스 링
  focusRing: 'focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',

  // 트랜지션
  transition: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-500',
  },

  // 디바이더
  divider: 'bg-gradient-to-r from-transparent via-white/[0.08] to-transparent',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * 필터 색상 가져오기
 */
export function getFilterColors(
  category: 'brand' | 'discipline' | 'type',
  isActive: boolean
) {
  const colors = FILTER[category];
  return isActive ? colors.active : colors.inactive;
}

/**
 * 상태 필터 색상 가져오기
 */
export function getStatusFilterColors(
  status: 'all' | 'valid' | 'expiring' | 'expired',
  isActive: boolean
) {
  const colors = FILTER.status[status];
  return isActive ? colors.active : colors.inactive;
}
