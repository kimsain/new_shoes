// 긴 종목명을 짧게 표시
const DISCIPLINE_SHORT_NAMES: Record<string, string> = {
  'Road Races (including Track Race Walking Events)': 'Road Races',
  'Cross Country (including Mountain and Trail Running)': 'Cross Country',
};

export function getDisplayName(name: string): string {
  return DISCIPLINE_SHORT_NAMES[name] || name;
}
