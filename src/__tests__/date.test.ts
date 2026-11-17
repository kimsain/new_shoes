import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  formatDate,
  formatShortDate,
  getDaysBetween,
  getDaysSince,
  getRemainingDays,
  getStatusInfo,
  getStatusLevel,
  startOfUtcDay,
} from '@/utils/date';
import { NOW } from './fixtures';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => {
  vi.useRealTimers();
});

describe('getRemainingDays', () => {
  it('종료일까지 남은 일수를 올림한다', () => {
    expect(getRemainingDays('2026-11-18')).toBe(1);
    expect(getRemainingDays('2026-12-17')).toBe(30);
  });

  it('종료일 당일(UTC 자정 이후)은 0, 지난 날은 음수', () => {
    expect(getRemainingDays('2026-11-17')).toBeCloseTo(0); // Math.ceil이 -0을 돌려준다
    expect(getRemainingDays('2026-11-10')).toBe(-7);
  });

  it('날짜가 없으면 null', () => {
    expect(getRemainingDays(undefined)).toBeNull();
    expect(getRemainingDays('')).toBeNull();
  });
});

describe('getDaysSince / getDaysBetween', () => {
  it('시작일부터 지난 일수를 내림한다', () => {
    expect(getDaysSince('2026-11-17')).toBe(0);
    expect(getDaysSince('2026-11-07')).toBe(10);
    expect(getDaysSince('2026-11-20')).toBe(-3);
    expect(getDaysSince(undefined)).toBeNull();
  });

  it('두 날짜 사이 일수', () => {
    expect(getDaysBetween('2026-08-06', '2027-08-05')).toBe(364);
    expect(getDaysBetween(undefined, '2027-08-05')).toBeNull();
    expect(getDaysBetween('2026-08-06', undefined)).toBeNull();
  });
});

describe('formatShortDate / formatDate', () => {
  it('짧은 형식은 시각 부분을 버린다', () => {
    expect(formatShortDate('2027-11-16')).toBe('2027.11.16');
    expect(formatShortDate('2027-11-16T00:00:00')).toBe('2027.11.16');
    expect(formatShortDate(undefined)).toBe('-');
  });

  it('긴 형식은 시간대와 상관없이 같은 날짜를 보여준다', () => {
    const original = process.env.TZ;
    try {
      for (const tz of ['Asia/Seoul', 'America/Los_Angeles']) {
        process.env.TZ = tz;
        expect(formatDate('2027-11-16')).toBe('2027년 11월 16일');
      }
    } finally {
      process.env.TZ = original;
    }
    expect(formatDate(undefined)).toBe('-');
  });
});

describe('getStatusLevel', () => {
  it.each([
    [null, 'unknown'],
    [-5, 'expired'],
    [0, 'expired'],
    [1, 'urgent'],
    [30, 'urgent'],
    [31, 'warning'],
    [90, 'warning'],
    [91, 'safe'],
  ] as const)('%s일 -> %s', (days, level) => {
    expect(getStatusLevel(days)).toBe(level);
  });
});

describe('getStatusInfo', () => {
  it('남은 기간이 있으면 D-n', () => {
    const info = getStatusInfo('2026-12-17');
    expect(info).toMatchObject({ level: 'urgent', text: 'D-30', remainingDays: 30 });
    expect(info.colors.text).toBe('text-hot');
  });

  it('만료와 기간 미정', () => {
    expect(getStatusInfo('2026-11-01')).toMatchObject({ level: 'expired', text: '만료' });
    expect(getStatusInfo(undefined)).toMatchObject({ level: 'unknown', text: '기간 미정', remainingDays: null });
  });
});

describe('기준 시각(now)', () => {
  it('UTC 자정으로 내려도 날짜 문자열의 남은 일수와 지난 일수는 같다', () => {
    const today = startOfUtcDay(NOW.getTime());
    expect(new Date(today).toISOString()).toBe('2026-11-17T00:00:00.000Z');
    expect(getRemainingDays('2026-12-17', today)).toBe(getRemainingDays('2026-12-17'));
    expect(getDaysSince('2026-08-06', today)).toBe(getDaysSince('2026-08-06'));
  });

  it('서버가 렌더한 날의 값을 그대로 다시 계산할 수 있다 (하이드레이션 불일치 방지)', () => {
    const renderedAt = Date.parse('2026-11-16T23:30:00Z'); // 한국 시각 오전 8시 30분, 날짜가 바뀌기 30분 전
    expect(getStatusInfo('2026-12-17', renderedAt).text).toBe('D-31');
    expect(getStatusInfo('2026-12-17').text).toBe('D-30');
  });
});
