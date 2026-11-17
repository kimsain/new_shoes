import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { DATA_URL, HERO_WALL_COUNT, IMAGE_BASE_URL } from '@/constants';
import { getShoeStats } from '@/lib/api';
import CountUp from './CountUp';
import { ArrowDownIcon, ArrowUpRightIcon } from './icons';

interface HeroSectionProps {
  shoes: Shoe[];
}

const WALL_ROWS = 3;

export default function HeroSection({ shoes }: HeroSectionProps) {
  const stats = getShoeStats(shoes);
  const wallShoes = shoes.filter((shoe) => shoe.imageDocumentuuid).slice(0, HERO_WALL_COUNT);

  return (
    <section id="top" className="relative overflow-hidden">
      {/* 배경: 은은한 빛, 레인처럼 나눈 세로선, 필름 그레인 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-glow absolute inset-0" />
        <div className="hero-grid-lines absolute inset-0" />
        <div className="hero-noise absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 pt-28 sm:px-6 sm:pt-32 lg:flex lg:min-h-[min(880px,100svh)] lg:items-center lg:pt-24 lg:pb-16">
        <div className="hero-scroll-copy relative z-10 lg:max-w-[700px]">
          <p
            className="anim-rise inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-fg-2 backdrop-blur-md"
            style={{ '--i': 0 } as CSSProperties}
          >
            <span className="live-dot relative h-2 w-2 rounded-full bg-volt" aria-hidden="true" />
            World Athletics 개발 신발 · 1시간마다 갱신
          </p>

          <h1 className="mt-6 text-[clamp(40px,8.6vw,92px)] font-extrabold leading-[1.06] tracking-[-0.045em] text-fg break-words">
            <span className="anim-rise block" style={{ '--i': 1 } as CSSProperties}>
              아직 출시되지 않은
            </span>
            <span className="anim-rise block" style={{ '--i': 2 } as CSSProperties}>
              개발 신발 <CountUp value={stats.total} delay={350} className="text-volt" />
              켤레
            </span>
          </h1>

          <p
            className="anim-rise mt-6 max-w-[500px] text-[16px] leading-[1.7] text-fg-2 sm:text-[17px] break-words"
            style={{ '--i': 3 } as CSSProperties}
          >
            World Athletics 인증 목록에서 개발 신발(프로토타입)만 골라 모았습니다. 남은 인증 기간과 종목, 모델 번호를 한곳에서 확인할 수 있습니다.
          </p>

          <div className="anim-rise mt-8 flex flex-wrap items-center gap-3" style={{ '--i': 4 } as CSSProperties}>
            <a
              href="#catalog"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-volt px-6 text-[15px] font-semibold text-volt-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
            >
              목록 보기
              <ArrowDownIcon className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5" />
            </a>
            <a
              href={DATA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-medium text-fg transition-colors duration-200 hover:bg-white/[0.06]"
            >
              원본 목록
              <ArrowUpRightIcon className="h-4 w-4 text-fg-3" />
            </a>
          </div>

          <dl
            className="anim-rise mt-12 grid grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-4"
            style={{ '--i': 5 } as CSSProperties}
          >
            <Stat label="브랜드" value={stats.brandCount} unit="곳" />
            <Stat label="최근 30일 신규" value={stats.recentCount} unit="켤레" />
            <Stat label="30일 안에 만료" value={stats.expiringCount} unit="켤레" tone={stats.expiringCount > 0 ? 'text-hot' : undefined} />
            {stats.nextExpiryDays !== null && (
              <Stat label="가장 가까운 만료" value={stats.nextExpiryDays} prefix="D-" />
            )}
          </dl>
        </div>
      </div>

      <PrototypeWall shoes={wallShoes} />

      {/* 아래쪽을 목록 바탕색으로 자연스럽게 잇는다 */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent" />
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
  prefix,
  tone,
}: {
  label: string;
  value: number;
  unit?: string;
  prefix?: string;
  tone?: string;
}) {
  return (
    <div className="sm:border-l sm:border-line sm:pl-5 sm:first:border-l-0 sm:first:pl-0">
      <dt className="text-[13px] text-fg-3">{label}</dt>
      <dd className={`mt-1.5 text-[28px] font-bold leading-none tracking-[-0.03em] sm:text-[32px] ${tone ?? 'text-fg'}`}>
        {prefix}
        <CountUp value={value} delay={700} />
        {unit && <span className="ml-1 text-[15px] font-semibold tracking-normal text-fg-3">{unit}</span>}
      </dd>
    </div>
  );
}

/**
 * 최신 신발 사진이 세 줄로 반대 방향으로 흐르는 3D 벽. 장식이라 보조기기에서는 숨긴다.
 */
function PrototypeWall({ shoes }: { shoes: Shoe[] }) {
  if (shoes.length === 0) return null;

  const rows = Array.from({ length: WALL_ROWS }, (_, r) => shoes.filter((_, i) => i % WALL_ROWS === r));

  return (
    <div
      aria-hidden="true"
      className="hero-scroll-wall relative mt-4 h-[300px] sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[56%]"
    >
      <div className="wall-stage wall-mask absolute inset-0 overflow-hidden">
        <div className="wall-enter absolute inset-0 flex items-center">
          <div className="wall-plane flex w-[150%] -translate-x-[8%] flex-col gap-3 sm:gap-4">
            {rows.map((row, r) => (
              <div
                key={r}
                className="wall-track flex w-max"
                data-reverse={r % 2 === 1}
                style={{ '--duration': `${64 + r * 14}s` } as CSSProperties}
              >
                {[...row, ...row].map((shoe, i) => (
                  <div
                    key={`${shoe.productApplicationuuid}-${i}`}
                    className="relative mr-3 aspect-[3/2] w-[150px] shrink-0 overflow-hidden rounded-[14px] bg-raised ring-1 ring-white/10 sm:mr-4 sm:w-[210px]"
                  >
                    <Image
                      src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 210px, 150px"
                      className="object-cover"
                      loading={r === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
