import { STATUS, StatusLevel } from '@/styles/tokens';

// 상태 임계값 (일)
export const THRESHOLDS = {
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
 * 기준 시각이 속한 UTC 날짜의 자정. 날짜 문자열('YYYY-MM-DD')이 UTC 자정이라 남은 일수는 하루 안에서 같다.
 * 서버 렌더와 하이드레이션이 같은 값을 쓰도록 기준 시각을 넘길 때 쓴다(useToday).
 */
export function startOfUtcDay(ms: number): number {
  return Math.floor(ms / DAY_MS) * DAY_MS;
}

/**
 * 오늘부터 종료일까지 남은 일수 계산
 */
export function getRemainingDays(endDateStr: string | undefined, now: number = Date.now()): number | null {
  if (!endDateStr) return null;
  return Math.ceil((new Date(endDateStr).getTime() - now) / DAY_MS);
}

/**
 * 시작일부터 오늘까지 지난 일수 계산
 */
export function getDaysSince(startDateStr: string | undefined, now: number = Date.now()): number | null {
  if (!startDateStr) return null;
  return Math.floor((now - new Date(startDateStr).getTime()) / DAY_MS);
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
    // 'YYYY-MM-DD'는 UTC 자정으로 읽히므로 UTC로 표시해야 시간대와 상관없이 같은 날짜가 나온다
    timeZone: 'UTC',
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
export function getStatusInfo(endDateStr: string | undefined, now: number = Date.now()): StatusInfo {
  const remainingDays = getRemainingDays(endDateStr, now);
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
