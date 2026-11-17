import { describe, expect, it } from 'vitest';
import { getDisplayName } from '@/utils/displayNames';

describe('getDisplayName', () => {
  it('긴 종목명을 줄인다', () => {
    expect(getDisplayName('Road Races (including Track Race Walking Events)')).toBe('Road Races');
    expect(getDisplayName('Cross Country (including Mountain and Trail Running)')).toBe('Cross Country');
  });

  it('모르는 이름은 그대로 둔다', () => {
    expect(getDisplayName('Track')).toBe('Track');
  });
});
