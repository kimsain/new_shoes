import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getElapsedRatio, getRemainingRatio } from '@/utils/progress';
import { NOW } from './fixtures';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => {
  vi.useRealTimers();
});

describe('getElapsedRatio / getRemainingRatio', () => {
  it('인증 기간 중 지난 비율과 남은 비율 (소수 셋째 자리)', () => {
    // 100일 기간 중 25일 지남
    expect(getElapsedRatio('2026-10-23', '2027-01-31')).toBe(0.25);
    expect(getRemainingRatio('2026-10-23', '2027-01-31')).toBe(0.75);
    // 364일 중 103일
    expect(getElapsedRatio('2026-08-06', '2027-08-05')).toBe(0.283);
    expect(getRemainingRatio('2026-08-06', '2027-08-05')).toBe(0.717);
  });

  it('시작 전이면 0, 끝난 뒤면 1로 자른다', () => {
    expect(getElapsedRatio('2026-12-01', '2027-12-01')).toBe(0);
    expect(getElapsedRatio('2025-01-01', '2025-12-31')).toBe(1);
    expect(getRemainingRatio('2025-01-01', '2025-12-31')).toBe(0);
  });

  it('기간이 0일 이하이면 다 지난 것으로 본다', () => {
    expect(getElapsedRatio('2026-11-10', '2026-11-10')).toBe(1);
  });

  it('날짜가 없으면 지난 비율 null, 남은 비율 0', () => {
    expect(getElapsedRatio(undefined, '2027-01-01')).toBeNull();
    expect(getElapsedRatio('2026-01-01', undefined)).toBeNull();
    expect(getRemainingRatio(undefined, undefined)).toBe(0);
  });
});
