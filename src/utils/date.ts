import { STATUS } from '@/styles/tokens';

// 상태 임계값 (일)
const THRESHOLDS = {
  EXPIRED: 0,
  URGENT: 30,
  WARNING: 90,
} as const;

export type StatusLevel = keyof typeof STATUS;

export interface StatusInfo {
  level: StatusLevel;
  text: string;
  remainingDays: number | null;
  colors: typeof STATUS[StatusLevel];
}

/**
 * 오늘부터 종료일까지 남은 일수 계산
 */
export function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷
 */
export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 남은 일수 기반 상태 레벨 반환
 */
export function getStatusLevel(remainingDays: number | null): StatusLevel {
  if (remainingDays === null) return 'unknown';
  if (remainingDays <= THRESHOLDS.EXPIRED) return 'expired';
  if (remainingDays <= THRESHOLDS.URGENT) return 'urgent';
  if (remainingDays <= THRESHOLDS.WARNING) return 'warning';
  return 'safe';
}

/**
 * 신발의 종합 상태 정보 반환 (카드용)
 */
export function getStatusInfo(endDateStr: string | undefined): StatusInfo {
  const remainingDays = getRemainingDays(endDateStr);
  const level = getStatusLevel(remainingDays);
  const colors = STATUS[level];

  let text: string;
  switch (level) {
    case 'expired':
      text = '만료';
      break;
    case 'unknown':
      text = '기간 미정';
      break;
    default:
      text = `D-${remainingDays}`;
  }

  return { level, text, remainingDays, colors };
}

/**
 * 상세 상태 정보 반환 (모달용)
 */
export function getDetailedStatusInfo(endDateStr: string | undefined): {
  text: string;
  color: string;
  bg: string;
  border: string;
  remainingDays: number | null;
} {
  const remainingDays = getRemainingDays(endDateStr);
  const level = getStatusLevel(remainingDays);
  const colors = STATUS[level];

  let text: string;
  switch (level) {
    case 'expired':
      text = '승인 기간 만료';
      break;
    case 'unknown':
      text = '기간 미정';
      break;
    default:
      text = `만료까지 ${remainingDays}일`;
  }

  return {
    text,
    color: colors.text,
    bg: colors.bg,
    border: colors.border,
    remainingDays,
  };
}
