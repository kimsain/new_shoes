import { STATUS, StatusLevel } from '@/styles/tokens';

// 상태 임계값 (일)
const THRESHOLDS = {
  EXPIRED: 0,
  URGENT: 30,
  WARNING: 90,
} as const;

const DAY_MS = 1000 * 60 * 60 * 24;

export type { StatusLevel };

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
  return Math.ceil(diffTime / DAY_MS);
}

/**
 * 시작일부터 오늘까지 지난 일수 계산
 */
export function getDaysSince(startDateStr: string | undefined): number | null {
  if (!startDateStr) return null;
  return Math.floor((Date.now() - new Date(startDateStr).getTime()) / DAY_MS);
}

/**
 * 두 날짜 사이의 일수
 */
export function getDaysBetween(startDateStr: string | undefined, endDateStr: string | undefined): number | null {
  if (!startDateStr || !endDateStr) return null;
  return Math.round((new Date(endDateStr).getTime() - new Date(startDateStr).getTime()) / DAY_MS);
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷 (2027년 11월 16일)
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
 * 짧은 날짜 형식 (2027.11.16)
 */
export function formatShortDate(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  const [y, m, d] = dateStr.slice(0, 10).split('-');
  return `${y}.${m}.${d}`;
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
 * 신발의 종합 상태 정보 반환
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
