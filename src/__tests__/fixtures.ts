import type { Shoe } from '@/types/shoe';

// 테스트 기준 시각: 2026-11-17 06:00 UTC (한국 시간 15:00)
export const NOW = new Date('2026-11-17T06:00:00Z');

export function makeShoe(overrides: Partial<Shoe> = {}): Shoe {
  return {
    productApplicationuuid: 'uuid',
    applicationId: 1,
    manufacturerName: 'Nike',
    productName: 'Alphafly 4',
    modelNumber: 'AB1234',
    modelNumberExp: '"AB1234"',
    alternativeModelNumbers: '',
    alternativeModelNumbersExp: '',
    shoeType: 'Road Shoe',
    shoeDevelopment: '',
    certificationStartDateExp: '2026-08-06',
    certificationEndDateExp: '2027-08-05',
    shoeDisciplines: '',
    productSearch: '',
    export: false,
    status: 'APPROVED_UNTIL',
    isDevelopmentShoe: true,
    isDefaultReleaseDate: false,
    disciplinesFullList: [],
    disciplines: [{ name: 'Road Races (including Track Race Walking Events)', order: 1 }],
    ...overrides,
  };
}
