import { Shoe, ShoeData } from '@/types/shoe';
import { DATA_URL, NEW_WINDOW_DAYS } from '@/constants';
import { THRESHOLDS } from '@/utils/date';

/**
 * Fetch development shoes from World Athletics
 *
 * 실패하면 예외를 던진다. ISR 재생성 중에 던지면 Next가 마지막 정상 페이지를 계속 내보내고 다음 요청 때 다시 시도한다.
 * 빈 배열을 돌려주면 빈 목록이 한 시간 동안 캐시되어 정상 페이지를 덮어쓴다.
 * 다만 빌드 중에는 원본이 내려가 있어도 배포가 막히지 않도록 빈 배열로 대신한다(page.tsx가 안내 문구를 보여 준다).
 */
export async function fetchDevelopmentShoes(): Promise<Shoe[]> {
  try {
    return await loadDevelopmentShoes();
  } catch (error) {
    console.error('Failed to fetch shoe data:', error);
    if (process.env.NEXT_PHASE === 'phase-production-build') return [];
    throw error;
  }
}

async function loadDevelopmentShoes(): Promise<Shoe[]> {
  const response = await fetch(DATA_URL, {
    next: { revalidate: 3600 },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  if (!response.ok) throw new Error(`FullList responded ${response.status}`);

  const data = parseShoeData(await response.text());
  if (!data) throw new Error('Could not parse shoe data');

  // Filter development shoes
  const developmentShoes = data.rows.filter(
    (shoe) => shoe.isDevelopmentShoe === true || shoe.status === 'APPROVED_UNTIL'
  );

  // Sort by certification start date (newest first)
  developmentShoes.sort((a, b) => {
    const dateA = a.certificationStartDateExp ? new Date(a.certificationStartDateExp).getTime() : 0;
    const dateB = b.certificationStartDateExp ? new Date(b.certificationStartDateExp).getTime() : 0;
    return dateB - dateA;
  });

  return developmentShoes;
}

/**
 * Parse shoe data from HTML
 */
export function parseShoeData(html: string): ShoeData | null {
  const startMarker = "litProductsDataRaw = '";
  const startIndex = html.indexOf(startMarker);

  if (startIndex === -1) {
    console.error('Could not find shoe data start marker');
    return null;
  }

  const jsonStart = startIndex + startMarker.length;
  let depth = 0;
  let endIndex = jsonStart;

  for (let i = jsonStart; i < html.length; i++) {
    const char = html[i];
    if (char === '{') depth++;
    if (char === '}') depth--;
    if (depth === 0 && html.slice(i + 1, i + 3) === "';") {
      endIndex = i + 1;
      break;
    }
  }

  const rawJson = html.slice(jsonStart, endIndex);
  const jsonStr = unescapeJson(rawJson);

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Unescape JSON string from HTML
 */
export function unescapeJson(raw: string): string {
  // 한 번에 훑어야 이스케이프된 역슬래시 뒤의 n이 줄바꿈으로 바뀌지 않는다
  const simple: Record<string, string> = { n: '\n', r: '\r', t: '\t' };
  return raw.replace(/\\(u[0-9a-fA-F]{4}|.)/g, (_, esc: string) =>
    esc.length === 5 ? String.fromCharCode(parseInt(esc.slice(1), 16)) : simple[esc] ?? esc
  );
}

/**
 * Get stats from shoes
 */
export function getShoeStats(shoes: Shoe[]) {
  const now = Date.now();
  const DAY_MS = 1000 * 60 * 60 * 24;
  let recentCount = 0;
  let expiringCount = 0;
  let nextExpiryDays: number | null = null;

  shoes.forEach((shoe) => {
    if (shoe.certificationStartDateExp) {
      const days = (now - new Date(shoe.certificationStartDateExp).getTime()) / DAY_MS;
      if (days >= 0 && days <= NEW_WINDOW_DAYS) recentCount++;
    }
    if (shoe.certificationEndDateExp) {
      const remaining = Math.ceil((new Date(shoe.certificationEndDateExp).getTime() - now) / DAY_MS);
      if (remaining > 0 && remaining <= THRESHOLDS.URGENT) expiringCount++;
      if (remaining > 0 && (nextExpiryDays === null || remaining < nextExpiryDays)) nextExpiryDays = remaining;
    }
  });

  return {
    total: shoes.length,
    brandCount: new Set(shoes.map(s => s.manufacturerName)).size,
    recentCount,
    expiringCount,
    nextExpiryDays,
  };
}
