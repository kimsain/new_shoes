import ShoeGrid from '@/components/ShoeGrid';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { fetchDevelopmentShoes, getShoeStats } from '@/lib/api';

export default async function Home() {
  const shoes = await fetchDevelopmentShoes();
  const stats = getShoeStats(shoes);
  const lastUpdated = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Main Content */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">
        {shoes.length === 0 ? (
          <EmptyDataState />
        ) : (
          <ShoeGrid shoes={shoes} />
        )}
      </section>

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} stats={stats} />
    </main>
  );
}

// Empty Data State - shown when API fetch fails
function EmptyDataState() {
  return (
    <div className="text-center py-24">
      <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-zinc-800/50 flex items-center justify-center">
        <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-xl text-white mb-3">데이터를 불러올 수 없습니다</p>
      <p className="text-zinc-500">잠시 후 다시 시도해주세요</p>
    </div>
  );
}
