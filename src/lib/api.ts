import { Shoe, ShoeData } from '@/types/shoe';
import { DATA_URL } from '@/constants';

/**
 * Fetch development shoes from World Athletics
 */
export async function fetchDevelopmentShoes(): Promise<Shoe[]> {
  try {
    const response = await fetch(DATA_URL, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();
    const data = parseShoeData(html);

    if (!data) {
      console.error('Could not parse shoe data');
      return [];
    }

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
  } catch (error) {
    console.error('Failed to fetch shoe data:', error);
    return [];
  }
}

/**
 * Parse shoe data from HTML
 */
function parseShoeData(html: string): ShoeData | null {
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
function unescapeJson(raw: string): string {
  return raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');
}

/**
 * Get stats from shoes
 */
export function getShoeStats(shoes: Shoe[]) {
  return {
    total: shoes.length,
    brandCount: new Set(shoes.map(s => s.manufacturerName)).size,
    disciplineCount: new Set(shoes.flatMap(s => s.disciplines.map(d => d.name))).size,
  };
}
