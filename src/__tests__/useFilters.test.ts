import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  countBrands,
  countDisciplines,
  countStatuses,
  countTypes,
  filterAndSortShoes,
  getStatusFilterOf,
  toggleInSet,
  useFilters,
} from '@/hooks/useFilters';
import type { FilterState } from '@/types/filters';
import { makeShoe, NOW } from './fixtures';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => {
  vi.useRealTimers();
});

const noFilter: FilterState = {
  selectedBrands: new Set(),
  selectedDisciplines: new Set(),
  selectedTypes: new Set(),
  statusFilter: 'all',
  searchQuery: '',
  sortBy: 'newest',
};

const road = { name: 'Road Races (including Track Race Walking Events)', order: 1 };
const track = { name: 'Track', order: 2 };

const shoes = [
  makeShoe({ productApplicationuuid: 'a', manufacturerName: 'Adidas', productName: 'Pro Evo 3', modelNumber: 'JR1', certificationStartDateExp: '2026-11-01', certificationEndDateExp: '2026-12-01', shoeType: 'Road Shoe', disciplines: [road] }),
  makeShoe({ productApplicationuuid: 'b', manufacturerName: 'Nike', productName: 'alphafly 4', modelNumber: 'HQ9', certificationStartDateExp: '2026-09-01', certificationEndDateExp: '2027-08-31', shoeType: 'Spike', disciplines: [road, track] }),
  makeShoe({ productApplicationuuid: 'c', manufacturerName: 'Hoka', productName: 'Cielo X3', modelNumber: 'CX3', certificationStartDateExp: '2025-10-01', certificationEndDateExp: '2026-10-01', shoeType: 'Spike', disciplines: [track] }),
  makeShoe({ productApplicationuuid: 'd', manufacturerName: 'Nike', productName: 'Bowerman Spike', modelNumber: 'BW1', certificationStartDateExp: undefined, certificationEndDateExp: undefined, shoeType: 'Spike', disciplines: [] }),
];

const ids = (list: { productApplicationuuid: string }[]) => list.map((s) => s.productApplicationuuid);

describe('getStatusFilterOf', () => {
  it.each([
    [null, 'valid'],
    [-1, 'expired'],
    [0, 'expired'],
    [1, 'expiring'],
    [30, 'expiring'],
    [31, 'valid'],
  ] as const)('%s일 -> %s', (days, status) => {
    expect(getStatusFilterOf(days)).toBe(status);
  });
});

describe('filterAndSortShoes', () => {
  it('필터가 없으면 최신 인증 순, 날짜 없는 신발은 맨 뒤', () => {
    expect(ids(filterAndSortShoes(shoes, noFilter))).toEqual(['a', 'b', 'c', 'd']);
  });

  it('원본 배열을 바꾸지 않는다', () => {
    const copy = [...shoes];
    filterAndSortShoes(shoes, { ...noFilter, sortBy: 'alphabetical' });
    expect(shoes).toEqual(copy);
  });

  it('만료 임박 순: 날짜 없는 신발은 맨 뒤', () => {
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, sortBy: 'expiring' }))).toEqual(['c', 'a', 'b', 'd']);
  });

  it('이름 순', () => {
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, sortBy: 'alphabetical' }))).toEqual(['b', 'd', 'c', 'a']);
  });

  it('브랜드, 종목, 타입 필터는 서로 AND, 같은 필터 안은 OR', () => {
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, selectedBrands: new Set(['Nike', 'Hoka']) }))).toEqual(['b', 'c', 'd']);
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, selectedDisciplines: new Set(['Track']) }))).toEqual(['b', 'c']);
    expect(
      ids(filterAndSortShoes(shoes, { ...noFilter, selectedTypes: new Set(['Spike']), selectedBrands: new Set(['Nike']) }))
    ).toEqual(['b', 'd']);
  });

  it('상태 필터', () => {
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, statusFilter: 'expiring' }))).toEqual(['a']);
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, statusFilter: 'expired' }))).toEqual(['c']);
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, statusFilter: 'valid' }))).toEqual(['b', 'd']);
  });

  it('검색은 이름, 브랜드, 모델 번호에서 대소문자 없이 찾는다', () => {
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, searchQuery: 'ALPHA' }))).toEqual(['b']);
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, searchQuery: 'hoka' }))).toEqual(['c']);
    expect(ids(filterAndSortShoes(shoes, { ...noFilter, searchQuery: 'jr1' }))).toEqual(['a']);
    expect(filterAndSortShoes(shoes, { ...noFilter, searchQuery: 'zzz' })).toEqual([]);
  });
});

describe('counts', () => {
  it('브랜드: 우선 브랜드를 정해진 순서로 먼저, 나머지는 개수 순', () => {
    const extra = [...shoes, makeShoe({ manufacturerName: 'On' }), makeShoe({ manufacturerName: 'On' })];
    expect(countBrands(extra)).toEqual([
      { name: 'Nike', count: 2 },
      { name: 'Adidas', count: 1 },
      { name: 'On', count: 2 },
      { name: 'Hoka', count: 1 },
    ]);
  });

  it('종목과 타입은 개수 많은 순', () => {
    expect(countDisciplines(shoes)).toEqual([
      { name: road.name, count: 2 },
      { name: 'Track', count: 2 },
    ]);
    expect(countTypes(shoes)).toEqual([
      { name: 'Spike', count: 3 },
      { name: 'Road Shoe', count: 1 },
    ]);
  });

  it('상태별 개수 (기간 미정은 유효)', () => {
    expect(countStatuses(shoes)).toEqual({ all: 4, valid: 2, expiring: 1, expired: 1 });
  });
});

describe('toggleInSet', () => {
  it('없으면 넣고 있으면 빼며, 원본은 그대로 둔다', () => {
    const original = new Set(['Nike']);
    expect([...toggleInSet(original, 'Puma')]).toEqual(['Nike', 'Puma']);
    expect([...toggleInSet(original, 'Nike')]).toEqual([]);
    expect([...original]).toEqual(['Nike']);
  });
});

describe('useFilters (첫 렌더)', () => {
  it('초기 상태와 개수 계산을 연결한다', () => {
    type State = ReturnType<typeof useFilters>;
    const report = vi.fn<(state: State) => void>();
    function Probe({ onRender }: { onRender: (state: State) => void }) {
      onRender(useFilters(shoes, NOW.getTime()));
      return null;
    }
    renderToString(createElement(Probe, { onRender: report }));
    const state = report.mock.calls[0][0];
    expect(state).toMatchObject({
      statusFilter: 'all',
      sortBy: 'newest',
      activeFilterCount: 0,
      statusCounts: countStatuses(shoes),
      brandsWithCount: countBrands(shoes),
      disciplinesWithCount: countDisciplines(shoes),
      typesWithCount: countTypes(shoes),
    });
    expect(state.selectedBrands.size).toBe(0);
  });
});
