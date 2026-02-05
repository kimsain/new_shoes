/**
 * Design Tokens - Linear/Vercel 스타일 디자인 시스템
 *
 * 세계 최고 수준의 UI를 위한 토큰 시스템
 * - 순수 블랙 배경
 * - 인디고→바이올렛 악센트
 * - 글로우 효과
 */

// ============================================
// BACKGROUND COLORS (깊이감 레이어)
// ============================================

export const BG = {
  // 페이지 배경 (Level 0)
  page: 'bg-black',

  // 표면 (Level 1-3)
  surface: {
    primary: 'bg-[#0a0a0a]',
    secondary: 'bg-[#0d0d0d]',
    tertiary: 'bg-[#111111]',
    elevated: 'bg-[#161616]',
  },

  // 인터랙티브 요소
  interactive: {
    default: 'bg-white/[0.02]',
    hover: 'bg-white/[0.04]',
    active: 'bg-white/[0.06]',
  },

  // 오버레이
  overlay: {
    light: 'bg-black/60',
    medium: 'bg-black/75',
    heavy: 'bg-black/85',
  },

  // 카드 그라데이션
  card: 'bg-gradient-to-b from-[#0a0a0a] to-[#111111]',
} as const;

// ============================================
// ACCENT COLORS (인디고 → 바이올렛)
// ============================================

export const ACCENT = {
  // 솔리드
  solid: {
    bg: 'bg-indigo-500',
    primary: 'bg-indigo-500',
    secondary: 'bg-violet-500',
    hover: 'hover:bg-indigo-600',
    bgHover: 'hover:bg-indigo-600',
    text: 'text-indigo-400',
    textHover: 'hover:text-indigo-400',
    border: 'border-indigo-500',
  },

  // 텍스트
  text: {
    primary: 'text-indigo-400',
    secondary: 'text-violet-400',
    light: 'text-indigo-300',
  },

  // 테두리
  border: {
    default: 'border-indigo-500/30',
    hover: 'border-indigo-500/50',
    active: 'border-indigo-500',
  },

  // 글로우
  glow: {
    sm: 'shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]',
    md: 'shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]',
    lg: 'shadow-[0_0_60px_-15px_rgba(99,102,241,0.5)]',
  },

  // 배경 글로우
  bgGlow: {
    subtle: 'bg-indigo-500/10',
    medium: 'bg-indigo-500/15',
    strong: 'bg-indigo-500/20',
  },

  // 그라데이션
  gradient: {
    text: 'bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent',
    bg: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    border: 'bg-gradient-to-r from-indigo-500/50 to-violet-500/50',
  },
} as const;

// ============================================
// BORDER COLORS
// ============================================

export const BORDER = {
  subtle: 'border-white/[0.04]',
  default: 'border-white/[0.06]',
  medium: 'border-white/[0.08]',
  hover: 'border-white/[0.12]',
  focus: 'border-indigo-500/50',
} as const;

// ============================================
// TEXT COLORS
// ============================================

export const TEXT = {
  primary: 'text-white',
  secondary: 'text-zinc-300',
  tertiary: 'text-zinc-400',
  muted: 'text-zinc-500',
  disabled: 'text-zinc-600',
} as const;

// ============================================
// STATUS COLORS (D-day)
// ============================================

export const STATUS = {
  expired: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
    bar: 'bg-red-500',
  },
  urgent: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    bar: 'bg-amber-500',
  },
  warning: {
    bg: 'bg-sky-500/15',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
    bar: 'bg-sky-500',
  },
  safe: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-500',
  },
  unknown: {
    bg: 'bg-zinc-800/50',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
    dot: 'bg-zinc-400',
    bar: 'bg-zinc-500',
  },
} as const;

export type StatusLevel = keyof typeof STATUS;

// ============================================
// FILTER COLORS
// ============================================

export const FILTER = {
  // 브랜드 필터 (인디고)
  brand: {
    active: {
      bg: 'bg-indigo-500/15',
      text: 'text-indigo-300',
      border: 'border-indigo-500/50',
      checkbox: 'bg-indigo-500 border-indigo-500',
    },
    inactive: {
      bg: 'bg-white/[0.02]',
      text: 'text-zinc-400',
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  // 종목 필터 (바이올렛)
  discipline: {
    active: {
      bg: 'bg-violet-500/15',
      text: 'text-violet-300',
      border: 'border-violet-500/50',
      checkbox: 'bg-violet-500 border-violet-500',
    },
    inactive: {
      bg: 'bg-white/[0.02]',
      text: 'text-zinc-400',
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  // 유형 필터 (퍼플)
  type: {
    active: {
      bg: 'bg-purple-500/15',
      text: 'text-purple-300',
      border: 'border-purple-500/50',
      checkbox: 'bg-purple-500 border-purple-500',
    },
    inactive: {
      bg: 'bg-white/[0.02]',
      text: 'text-zinc-400',
      border: 'border-transparent',
      checkbox: 'border-zinc-600',
    },
  },
  // 상태 필터
  status: {
    all: {
      active: { bg: 'bg-zinc-700', text: 'text-white', border: 'border-zinc-600' },
      inactive: { bg: 'bg-white/[0.02]', text: 'text-zinc-400', border: 'border-transparent' },
    },
    valid: {
      active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      inactive: { bg: 'bg-white/[0.02]', text: 'text-zinc-400', border: 'border-transparent' },
    },
    expiring: {
      active: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
      inactive: { bg: 'bg-white/[0.02]', text: 'text-zinc-400', border: 'border-transparent' },
    },
    expired: {
      active: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
      inactive: { bg: 'bg-white/[0.02]', text: 'text-zinc-400', border: 'border-transparent' },
    },
  },
  // 새 토글 칩 스타일
  chip: {
    inactive: {
      bg: 'bg-transparent',
      text: 'text-zinc-400',
      border: 'border-white/[0.08]',
    },
    active: {
      bg: 'bg-indigo-500/15',
      text: 'text-indigo-300',
      border: 'border-indigo-500/50',
      glow: 'shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]',
    },
  },
  // 세그먼트 컨트롤
  segment: {
    inactive: {
      bg: 'bg-transparent',
      text: 'text-zinc-500',
    },
    active: {
      bg: 'bg-white/[0.08]',
      text: 'text-white',
    },
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const TYPOGRAPHY = {
  hero: 'text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] leading-[1.1]',
  heroLight: 'text-6xl sm:text-7xl lg:text-8xl font-light tracking-[-0.04em] leading-[1.1]',
  section: 'text-2xl sm:text-3xl font-semibold tracking-[-0.02em]',
  cardTitle: 'text-lg font-medium',
  body: 'text-sm leading-relaxed',
  caption: 'text-xs text-zinc-500',
  label: 'text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500',
} as const;

// ============================================
// SPACING
// ============================================

export const SPACING = {
  section: 'py-24 lg:py-32',
  sectionGap: 'space-y-24 lg:space-y-32',
  cardPadding: 'p-6 lg:p-8',
  cardGap: 'gap-6',
} as const;

// ============================================
// CARD STYLES
// ============================================

export const CARD = {
  base: `
    bg-gradient-to-b from-[#0a0a0a] to-[#111111]
    border border-white/[0.06]
    rounded-3xl
    overflow-hidden
    transition-all duration-500 ease-out
  `,
  hover: `
    hover:border-indigo-500/40
    hover:shadow-[0_0_60px_-20px_rgba(99,102,241,0.4)]
    hover:-translate-y-2
  `,
  image: {
    aspect: 'aspect-[16/10]',
    bg: 'bg-black/40',
  },
} as const;

// ============================================
// MODAL STYLES
// ============================================

export const MODAL = {
  backdrop: 'bg-black/80 backdrop-blur-xl',
  container: 'bg-[#0a0a0a] border border-white/[0.06] rounded-3xl',
  header: 'border-b border-white/[0.06]',
} as const;

// ============================================
// BUTTON STYLES
// ============================================

export const BUTTON = {
  primary: {
    base: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-medium rounded-xl',
    bg: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    text: 'text-white',
    hover: 'hover:from-indigo-600 hover:to-violet-600',
    bgHover: 'hover:from-indigo-600 hover:to-violet-600',
    glow: 'shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)]',
    shadow: 'shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]',
    shadowHover: 'hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]',
  },
  secondary: {
    base: 'bg-white/[0.04] border border-white/[0.08] text-zinc-300 rounded-xl',
    bg: 'bg-white/[0.04]',
    text: 'text-zinc-300',
    textHover: 'hover:text-white',
    hover: 'hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white',
    bgHover: 'hover:bg-white/[0.06]',
    border: 'border-white/[0.08]',
    borderHover: 'hover:border-white/[0.12]',
  },
  ghost: {
    base: 'text-zinc-400 rounded-xl',
    text: 'text-zinc-400',
    hover: 'hover:bg-white/[0.04] hover:text-white',
    bgHover: 'hover:bg-white/[0.04]',
  },
  danger: {
    text: 'text-red-400',
    bgHover: 'hover:bg-red-500/10',
    border: 'border-red-500/20',
    borderHover: 'hover:border-red-500/30',
  },
} as const;

// ============================================
// GLOW LINE
// ============================================

export const GLOW_LINE = {
  horizontal: 'h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent',
  vertical: 'w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent',
} as const;

// ============================================
// ANIMATIONS (CSS class names)
// ============================================

export const ANIMATION = {
  fadeIn: 'animate-fade-in',
  fadeUp: 'animate-fade-up',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideInBottom: 'animate-slide-in-bottom',
} as const;

// ============================================
// BADGE STYLES
// ============================================

export const BADGE = {
  new: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
  brand: {
    bg: 'bg-black/60',
    text: 'text-white/90',
    border: 'border-white/[0.06]',
  },
  section: {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
  },
} as const;

// ============================================
// CHIP STYLES
// ============================================

export const CHIP = {
  default: {
    bg: 'bg-zinc-800/70',
    text: 'text-zinc-300',
  },
  interactive: {
    bg: 'bg-white/[0.04]',
    bgHover: 'hover:bg-white/[0.06]',
    text: 'text-zinc-300',
  },
} as const;

// ============================================
// BOTTOMSHEET STYLES
// ============================================

export const BOTTOMSHEET = {
  backdrop: 'bg-black/60',
  container: 'bg-[#0a0a0a]',
  handle: 'bg-zinc-600',
  border: 'border-white/[0.08]',
  footer: 'bg-[#0a0a0a]/95',
} as const;

// ============================================
// UTILITY CLASSES
// ============================================

export const UTILS = {
  glass: 'backdrop-blur-md',
  focusRing: 'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
  transition: {
    default: 'transition-all duration-300',
    fast: 'transition-all duration-200',
    slow: 'transition-all duration-500',
  },
  divider: 'bg-gradient-to-r from-transparent via-white/[0.06] to-transparent',
} as const;


