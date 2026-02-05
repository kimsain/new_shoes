import { Shoe, ShoeData } from '@/types/shoe';
import ShoeGrid from '@/components/ShoeGrid';

const DATA_URL = 'https://certcheck.worldathletics.org/FullList';

async function fetchDevelopmentShoes(): Promise<Shoe[]> {
  try {
    const response = await fetch(DATA_URL, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();

    // Extract JSON data from the page
    const startMarker = "litProductsDataRaw = '";
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) {
      console.error('Could not find shoe data start marker');
      return [];
    }

    const jsonStart = startIndex + startMarker.length;
    const endMarker = "';";
    let depth = 0;
    let endIndex = jsonStart;

    // Find the end of the JSON by tracking braces
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
    // The JSON is escaped for JavaScript string - unescape it
    const jsonStr = rawJson
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');

    const data: ShoeData = JSON.parse(jsonStr);

    // Filter development shoes only
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

export default async function Home() {
  const shoes = await fetchDevelopmentShoes();
  const lastUpdated = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Development Shoes
          </h1>
          <p className="text-lg text-purple-200 mb-2">
            World Athletics 승인 대기 중인 개발 신발 목록
          </p>
          <p className="text-sm text-gray-400">
            마지막 업데이트: {lastUpdated} | 총 {shoes.length}개 제품
          </p>
        </header>

        {shoes.length === 0 ? (
          <div className="text-center text-white py-20">
            <p className="text-xl">데이터를 불러올 수 없습니다.</p>
            <p className="text-gray-400 mt-2">잠시 후 다시 시도해주세요.</p>
          </div>
        ) : (
          <ShoeGrid shoes={shoes} />
        )}

        <footer className="text-center mt-16 text-gray-400 text-sm">
          <p>데이터 출처: World Athletics Shoe Checker</p>
          <p className="mt-1">
            개발 신발은 지정된 기간 내에만 사용 가능하며, WAS Events 또는 OG에서는 사용 불가
          </p>
        </footer>
      </div>
    </main>
  );
}
