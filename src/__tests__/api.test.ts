import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchDevelopmentShoes, getShoeStats, parseShoeData, unescapeJson } from '@/lib/api';
import { makeShoe, NOW } from './fixtures';

// 실제 FullList 페이지와 같은 방식으로 JSON을 자바스크립트 문자열 안에 넣는다
function toPage(data: unknown): string {
  const jsEscaped = JSON.stringify(JSON.stringify(data)).slice(1, -1).replace(/'/g, "\\'");
  return `<script>var x = 1;\nlitProductsDataRaw = '${jsEscaped}';//]]></script>`;
}

const rows = [
  makeShoe({ productApplicationuuid: 'old', certificationStartDateExp: '2026-01-01', status: 'APPROVED_UNTIL', isDevelopmentShoe: false }),
  makeShoe({ productApplicationuuid: 'new', certificationStartDateExp: '2026-11-01', isDevelopmentShoe: true, status: 'APPROVED' }),
  makeShoe({ productApplicationuuid: 'released', isDevelopmentShoe: false, status: 'APPROVED' }),
  makeShoe({ productApplicationuuid: 'nodate', certificationStartDateExp: undefined }),
];

describe('unescapeJson', () => {
  it('실제 페이지에 나오는 이스케이프를 푼다', () => {
    // 페이지 원문: {\"modelNumberExp\":\"\\\"D24\\\"\",\"name\":\"A & B\"}
    const raw = String.raw`{\"modelNumberExp\":\"\\\"D24\\\"\",\"name\":\"A & B\"}`;
    expect(JSON.parse(unescapeJson(raw))).toEqual({ modelNumberExp: '"D24"', name: 'A & B' });
  });

  it('이스케이프된 역슬래시 뒤의 글자를 다시 풀지 않는다', () => {
    // 페이지 원문 \\n 은 역슬래시 + n 이어야 한다 (예전 구현은 역슬래시 + 줄바꿈으로 바꿔 JSON 파싱이 깨졌다)
    expect(unescapeJson(String.raw`a\\nb`)).toBe('a\\nb');
    expect(unescapeJson(String.raw`a\nb\tc\'d`)).toBe("a\nb\tc'd");
  });
});

describe('parseShoeData', () => {
  it('페이지에 박힌 JSON을 꺼낸다 (따옴표, 역슬래시, 중괄호, & 포함)', () => {
    const tricky = makeShoe({ productName: "Runner's {Edge} & \"Pro\"", modelNumber: '111\\222' });
    const data = { header_excel: [], rows: [tricky] };
    expect(parseShoeData(toPage(data))).toEqual(data);
  });

  it('표시가 없거나 JSON이 깨졌으면 null', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(parseShoeData('<html></html>')).toBeNull();
    expect(parseShoeData("litProductsDataRaw = '{\"rows\": [';")).toBeNull();
  });
});

describe('fetchDevelopmentShoes', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('개발 신발만 남기고 최신 인증 순으로 정렬한다', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(toPage({ header_excel: [], rows }))));
    const result = await fetchDevelopmentShoes();
    expect(result.map((s) => s.productApplicationuuid)).toEqual(['new', 'old', 'nodate']);
  });

  it('응답 오류, 파싱 실패, 네트워크 오류면 예외를 던져 ISR이 마지막 정상 페이지를 지키게 한다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn(async () => new Response(toPage({ header_excel: [], rows }), { status: 503 })));
    await expect(fetchDevelopmentShoes()).rejects.toThrow('503');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html></html>')));
    await expect(fetchDevelopmentShoes()).rejects.toThrow();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    await expect(fetchDevelopmentShoes()).rejects.toThrow('offline');
  });

  it('빌드 중에는 실패해도 빈 배열을 돌려 배포를 막지 않는다', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubEnv('NEXT_PHASE', 'phase-production-build');
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    expect(await fetchDevelopmentShoes()).toEqual([]);
  });
});

describe('getShoeStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('총수, 브랜드 수, 최근 인증, 만료 임박, 가장 가까운 만료를 센다', () => {
    const list = [
      makeShoe({ manufacturerName: 'Nike', certificationStartDateExp: '2026-11-10', certificationEndDateExp: '2026-11-27' }), // 최근, 10일 남음
      makeShoe({ manufacturerName: 'Nike', certificationStartDateExp: '2026-10-01', certificationEndDateExp: '2026-12-17' }), // 30일 남음
      makeShoe({ manufacturerName: 'Puma', certificationStartDateExp: '2026-11-20', certificationEndDateExp: '2027-11-20' }), // 시작 전
      makeShoe({ manufacturerName: 'Asics', certificationStartDateExp: '2025-01-01', certificationEndDateExp: '2026-11-01' }), // 만료
      makeShoe({ manufacturerName: 'On', certificationStartDateExp: undefined, certificationEndDateExp: undefined }),
    ];
    expect(getShoeStats(list)).toEqual({
      total: 5,
      brandCount: 4,
      recentCount: 1,
      expiringCount: 2,
      nextExpiryDays: 10,
    });
  });

  it('빈 목록', () => {
    expect(getShoeStats([])).toEqual({ total: 0, brandCount: 0, recentCount: 0, expiringCount: 0, nextExpiryDays: null });
  });
});
