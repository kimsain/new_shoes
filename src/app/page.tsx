import ShoeGrid from '@/components/ShoeGrid';
import Header from '@/components/Header';
import { fetchDevelopmentShoes, getShoeStats } from '@/lib/api';

export default async function Home() {
  const shoes = await fetchDevelopmentShoes();
  const stats = getShoeStats(shoes);
  const lastUpdated = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <HeroSection stats={stats} />

      {/* Gradient Transition */}
      <div className="h-16 bg-gradient-to-b from-transparent to-[#0a0a0a]" />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {shoes.length === 0 ? (
          <EmptyDataState />
        ) : (
          <ShoeGrid shoes={shoes} />
        )}
      </section>

      {/* Footer */}
      <Footer lastUpdated={lastUpdated} />
    </main>
  );
}

// Hero Section Component
function HeroSection({ stats }: { stats: { total: number; brandCount: number; disciplineCount: number } }) {
  return (
    <section className="relative pt-24 pb-12 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[100px]" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-sky-500/[0.05] rounded-full blur-[80px]" />
        <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-purple-500/[0.05] rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs text-zinc-400">World Athletics 실시간 동기화</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight leading-tight">
          <span className="text-gradient">Development</span>{' '}
          <span className="text-emerald-400">Shoes</span>
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-zinc-400 mb-6 max-w-xl mx-auto leading-relaxed">
          World Athletics 승인 대기 중인 프로토타입 러닝화를 한눈에 확인하세요
        </p>

        {/* Stats */}
        <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
          <StatItem value={stats.total} label="신발" />
          <div className="w-px h-8 bg-white/10" />
          <StatItem value={stats.brandCount} label="브랜드" />
          <div className="w-px h-8 bg-white/10" />
          <StatItem value={stats.disciplineCount} label="종목" />
          <div className="w-px h-8 bg-white/10" />
          <StatItem value="1h" label="갱신" />
        </div>
      </div>
    </section>
  );
}

// Stat Item Component
function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="px-5 py-2 text-center">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

// Empty Data State Component
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

// Footer Component
function Footer({ lastUpdated }: { lastUpdated: string }) {
  return (
    <footer className="border-t border-white/[0.04] py-10 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-white">DevShoes</span>
              <p className="text-xs text-zinc-500">마지막 업데이트: {lastUpdated}</p>
            </div>
          </div>

          <a
            href="https://certcheck.worldathletics.org/FullList"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
          >
            <span>World Athletics 공식 사이트</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <p className="text-center text-xs text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Development Shoes는 지정된 기간 내에만 사용 가능하며, World Athletics Series Events 또는 Olympic
          Games에서는 사용할 수 없습니다.
        </p>
      </div>
    </footer>
  );
}
