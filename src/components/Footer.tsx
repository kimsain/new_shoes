import { DATA_URL, GITHUB_URL } from '@/constants';
import { ArrowUpRightIcon, LogoMark } from './icons';

interface FooterProps {
  lastUpdated: string;
}

export default function Footer({ lastUpdated }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="relative mx-auto grid max-w-[1400px] gap-10 px-4 pb-10 pt-14 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-8 w-8" />
            <span className="text-[16px] font-bold tracking-[-0.03em] text-fg">DevShoes</span>
          </div>
          <p className="mt-5 max-w-[440px] text-[14px] leading-[1.7] text-fg-3 break-words">
            개발 신발은 World Athletics 승인 대기 중인 프로토타입입니다. WAS 이벤트 및 올림픽에서는 사용할 수 없습니다.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-6 lg:items-end">
          <nav className="flex flex-wrap gap-2" aria-label="푸터 링크">
            <FooterLink href={DATA_URL}>원본 목록</FooterLink>
            <FooterLink href={GITHUB_URL}>GitHub</FooterLink>
          </nav>
          <p className="text-[13px] tabular-nums text-fg-4">업데이트 {lastUpdated}</p>
        </div>
      </div>

      {/* 큰 워드마크: 아래가 잘려 바닥에 깔린 듯 보인다 */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto -mb-[0.2em] max-w-[1400px] select-none px-2 text-center text-[clamp(72px,19vw,280px)] font-black leading-none tracking-[-0.06em] bg-gradient-to-b from-white/[0.09] to-white/0 bg-clip-text text-transparent"
      >
        DevShoes
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-10 items-center gap-1.5 rounded-full border border-line-strong px-4 text-[14px] font-medium text-fg-2 transition-colors duration-200 hover:bg-white/[0.06] hover:text-fg"
    >
      {children}
      <ArrowUpRightIcon className="h-3.5 w-3.5 text-fg-3" />
    </a>
  );
}
