import { STATUS_THRESHOLDS, STATUS_COLORS } from '@/constants';

export type StatusLevel = 'expired' | 'urgent' | 'warning' | 'safe' | 'unknown';

export interface StatusInfo {
  level: StatusLevel;
  text: string;
  remainingDays: number | null;
  colors: typeof STATUS_COLORS[StatusLevel];
}

/**
 * Calculate remaining days from today to the end date
 */
export function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format date string to Korean locale
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
 * Get status level based on remaining days
 */
export function getStatusLevel(remainingDays: number | null): StatusLevel {
  if (remainingDays === null) return 'unknown';
  if (remainingDays <= STATUS_THRESHOLDS.EXPIRED) return 'expired';
  if (remainingDays <= STATUS_THRESHOLDS.URGENT) return 'urgent';
  if (remainingDays <= STATUS_THRESHOLDS.WARNING) return 'warning';
  return 'safe';
}

/**
 * Get comprehensive status info for a shoe
 */
export function getStatusInfo(endDateStr: string | undefined): StatusInfo {
  const remainingDays = getRemainingDays(endDateStr);
  const level = getStatusLevel(remainingDays);
  const colors = STATUS_COLORS[level];

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
 * Get detailed status info for modal display
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
  const colors = STATUS_COLORS[level];

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
