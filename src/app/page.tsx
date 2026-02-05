import ShoeGrid from '@/components/ShoeGrid';
import Header from '@/components/Header';
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

// Hero Section Component
function HeroSection({ stats }: { stats: { total: number; brandCount: number; disciplineCount: number } }) {
  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 px-4 overflow-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 - Indigo (largest) */}
        <div className="glow-orb-1" />
        {/* Orb 2 - Violet */}
        <div className="glow-orb-2" />
        {/* Orb 3 - Cyan */}
        <div className="glow-orb-3" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-5 backdrop-blur-sm">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-indigo-300">
            ✦ Development Shoes
          </span>
        </div>

        {/* Title - Two lines */}
        <h1 className="hero-title mb-4">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[-0.04em] leading-[1.1]">
            The Future of
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.1] bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Running Shoes
          </span>
        </h1>

        {/* Description */}
        <p className="hero-description text-sm sm:text-base text-zinc-400 mb-6 max-w-xl mx-auto leading-relaxed">
          World Athletics 승인 대기 중인 프로토타입을 실시간으로 추적하세요
        </p>

        {/* Minimal Stats */}
        <div className="hero-stats inline-flex items-center gap-2 text-sm text-zinc-500">
          <span className="text-white font-semibold tabular-nums">{stats.total}</span>
          <span>shoes</span>
          <span className="text-zinc-600">·</span>
          <span className="text-white font-semibold tabular-nums">{stats.brandCount}</span>
          <span>brands</span>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
    </section>
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
function Footer({ lastUpdated, stats }: { lastUpdated: string; stats: { total: number; brandCount: number } }) {
  return (
    <footer className="relative pt-10 pb-8 px-4">
      {/* Glow gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-[1400px] mx-auto">
        {/* Brand */}
        <div className="text-center mb-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600 mb-3">
            Development Shoes
          </p>

          {/* Status */}
          <div className="inline-flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Synced
            </span>
            <span className="text-zinc-700">·</span>
            <span>{stats.total} shoes</span>
            <span className="text-zinc-700">·</span>
            <span>Updated {lastUpdated}</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <a
            href="https://github.com/kimsain/new_shoes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:border-white/[0.12] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://certcheck.worldathletics.org/FullList"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:border-white/[0.12] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Source Data
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Development shoes are prototypes awaiting World Athletics approval.
          <br />
          Not permitted in WAS Events or Olympic Games.
        </p>
      </div>
    </footer>
  );
}
