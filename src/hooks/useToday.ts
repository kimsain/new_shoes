'use client';

import { useSyncExternalStore } from 'react';
import { startOfUtcDay } from '@/utils/date';

const subscribe = () => () => {};

/**
 * 남은 일수 계산의 기준 시각(오늘 UTC 자정).
 * ISR HTML은 길게는 한 시간 넘게 묵어서, 그사이 날짜가 바뀌면 서버가 그린 D-day와 브라우저 값이 어긋나 하이드레이션 오류가 난다.
 * 하이드레이션 때는 서버가 렌더한 시각(renderedAt)을 쓰고, 그 직후 브라우저의 오늘로 다시 그린다.
 */
export function useToday(renderedAt: number): number {
  return useSyncExternalStore(
    subscribe,
    () => startOfUtcDay(Date.now()),
    () => startOfUtcDay(renderedAt)
  );
}
