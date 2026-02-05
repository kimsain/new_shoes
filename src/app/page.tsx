import { Shoe, ShoeData } from '@/types/shoe';
import ShoeGrid from '@/components/ShoeGrid';
import Header from '@/components/Header';

const DATA_URL = 'https://certcheck.worldathletics.org/FullList';

async function fetchDevelopmentShoes(): Promise<Shoe[]> {
  try {
    const response = await fetch(DATA_URL, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();

    const startMarker = "litProductsDataRaw = '";
    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) {
      console.error('Could not find shoe data start marker');
      return [];
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
    const jsonStr = rawJson
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');

    const data: ShoeData = JSON.parse(jsonStr);

    const developmentShoes = data.rows.filter(
      (shoe) => shoe.isDevelopmentShoe === true || shoe.status === 'APPROVED_UNTIL'
    );

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

  // Get brand count
  const brandCount = new Set(shoes.map(s => s.manufacturerName)).size;

  return (
    <main className="min-h-screen bg-[#0f0f0f]">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            실시간 업데이트
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Development Shoes
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            World Athletics 승인 대기 중인 프로토타입 러닝화
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">{shoes.length}</span>
              <span className="text-gray-500">개발 신발</span>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">{brandCount}</span>
              <span className="text-gray-500">브랜드</span>
            </div>
            <div className="w-px h-10 bg-gray-800" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">1h</span>
              <span className="text-gray-500">갱신 주기</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {shoes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl text-white mb-2">데이터를 불러올 수 없습니다</p>
            <p className="text-gray-500">잠시 후 다시 시도해주세요</p>
          </div>
        ) : (
          <ShoeGrid shoes={shoes} />
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>마지막 업데이트: {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://certcheck.worldathletics.org/FullList"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              World Athletics Shoe Checker
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-4 max-w-2xl mx-auto">
          Development Shoes는 지정된 기간 내에만 사용 가능하며, World Athletics Series Events 또는 Olympic Games에서는 사용할 수 없습니다.
        </p>
      </footer>
    </main>
  );
}
