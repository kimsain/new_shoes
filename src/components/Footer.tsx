import { DATA_URL } from '@/constants';

interface FooterProps {
  lastUpdated: string;
  stats: {
    total: number;
    brandCount: number;
  };
}

export default function Footer({ lastUpdated, stats }: FooterProps) {
  return (
    <footer className="relative pt-10 pb-[calc(2rem+env(safe-area-inset-bottom))] px-4">
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
              동기화됨
            </span>
            <span className="text-zinc-700">·</span>
            <span>{stats.total}개</span>
            <span className="text-zinc-700">·</span>
            <span>업데이트 {lastUpdated}</span>
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
            href={DATA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-zinc-400 hover:text-white hover:border-white/[0.12] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            원본 데이터
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-zinc-600 max-w-xl mx-auto leading-relaxed">
          개발 신발은 World Athletics 승인 대기 중인 프로토타입입니다.
          <br />
          WAS 이벤트 및 올림픽에서는 사용할 수 없습니다.
        </p>
      </div>
    </footer>
  );
}
