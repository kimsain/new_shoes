/**
 * 인증 기간 진행률 계산
 * 기준은 각 신발의 실제 인증 기간(시작일부터 만료일까지, 대부분 364일)이다.
 * 하루 단위로 계산해서 서버 렌더와 브라우저의 값이 같은 날에는 일치한다.
 */

import { getDaysBetween, getDaysSince } from './date';

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * 인증 기간 중 지난 비율 (0~1). 날짜가 없으면 null
 */
export function getElapsedRatio(
  startDateStr: string | undefined,
  endDateStr: string | undefined,
  now: number = Date.now()
): number | null {
  const windowDays = getDaysBetween(startDateStr, endDateStr);
  const elapsedDays = getDaysSince(startDateStr, now);
  if (windowDays === null || elapsedDays === null) return null;
  if (windowDays <= 0) return 1;
  return Math.round(clamp01(elapsedDays / windowDays) * 1000) / 1000;
}

/**
 * 인증 기간 중 남은 비율 (0~1). 날짜가 없으면 0
 */
export function getRemainingRatio(
  startDateStr: string | undefined,
  endDateStr: string | undefined,
  now: number = Date.now()
): number {
  const elapsed = getElapsedRatio(startDateStr, endDateStr, now);
  return elapsed === null ? 0 : Math.round((1 - elapsed) * 1000) / 1000;
}
