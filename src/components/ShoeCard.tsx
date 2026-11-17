'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { CARD_IMAGE_SIZES, IMAGE_BASE_URL } from '@/constants';
import { formatShortDate, getStatusInfo } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';
import { getRemainingRatio } from '@/utils/progress';
import { observeReveal } from '@/lib/motion';
import { ArrowUpRightIcon, ImageOffIcon } from './icons';

interface ShoeCardProps {
  shoe: Shoe;
  /** 상세 열기. 부모가 고정된 함수를 넘긴다 */
  onOpen: (id: string) => void;
  /** D-day 기준 시각. 서버 렌더와 하이드레이션이 같은 값을 쓰도록 부모가 넘긴다 */
  today: number;
  isNew?: boolean;
  /** 상세 화면이 이 카드 사진을 가져가 있는 동안 카드 사진을 숨긴다 */
  lifted?: boolean;
}

const MAX_RETRY_COUNT = 1;

function ShoeCardComponent({ shoe, onOpen, today, isNew = false, lifted = false }: ShoeCardProps) {
  const id = shoe.productApplicationuuid;
  const articleRef = useRef<HTMLElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const status = getStatusInfo(shoe.certificationEndDateExp, today);
  const ratio = getRemainingRatio(shoe.certificationStartDateExp, shoe.certificationEndDateExp, today);
  const disciplines = shoe.disciplines.map((d) => getDisplayName(d.name)).join(', ');
  const isSpike = shoe.shoeType === 'Spike';

  useEffect(() => observeReveal(articleRef.current), []);

  const handleError = useCallback(() => {
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount((prev) => prev + 1);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  }, [retryCount]);

  // 커서를 따라가는 빛: 진입할 때 위치를 한 번 재고, 움직일 때는 CSS 변수만 바꾼다
  const handlePointerEnter = (e: PointerEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };
  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !rectRef.current) return;
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rectRef.current.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rectRef.current.top}px`);
  };

  const imageUrl = shoe.imageDocumentuuid
    ? `${IMAGE_BASE_URL}${shoe.imageDocumentuuid}${retryCount > 0 ? `?retry=${retryCount}` : ''}`
    : null;

  return (
    <article
      ref={articleRef}
      className="shoe-card reveal relative"
      data-lifted={lifted}
      style={{ '--vt-name': `card-${id}` } as CSSProperties}
    >
      <div
        className="shoe-card-inner relative isolate h-full overflow-hidden rounded-card border border-line bg-surface"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
      >
        {/* 사진 판: 같은 사진을 흐리게 깔아 빈 곳을 사진 자신의 색으로 채운다 */}
        <div className="shoe-media relative m-1.5 aspect-[4/3] overflow-hidden rounded-[15px] bg-raised" data-media={id}>
          {imageUrl && !failed ? (
            <>
              {!loaded && <div className="skeleton absolute inset-0" />}
              <Image
                src={imageUrl}
                alt=""
                aria-hidden="true"
                fill
                sizes={CARD_IMAGE_SIZES}
                className="shoe-media-ambient scale-125 object-cover blur-2xl saturate-150"
                style={{ opacity: loaded ? 0.9 : 0 }}
              />
              <Image
                data-fg=""
                data-loaded={loaded}
                src={imageUrl}
                alt={`${shoe.manufacturerName} ${shoe.productName}`}
                fill
                sizes={CARD_IMAGE_SIZES}
                className="shoe-media-fg object-contain p-2.5 sm:p-3"
                style={{ opacity: loaded ? 1 : 0 }}
                onLoad={() => setLoaded(true)}
                onError={handleError}
              />
            </>
          ) : (
            <MediaFallback brand={shoe.manufacturerName} />
          )}

          <div className="pointer-events-none absolute inset-0 rounded-[15px] ring-1 ring-inset ring-white/[0.06]" />

          {isNew && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-volt px-2 py-[3px] text-[10px] font-bold leading-none tracking-[0.08em] text-volt-ink">
              NEW
            </span>
          )}
          {isSpike && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2 py-[3px] text-[10px] font-semibold leading-none tracking-[0.06em] text-fg backdrop-blur-md">
              SPIKE
            </span>
          )}
        </div>

        <div className="px-3.5 pb-4 pt-2.5 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-medium text-fg-3" title={shoe.manufacturerName}>
              {shoe.manufacturerName}
            </p>
            <ArrowUpRightIcon className="shoe-card-arrow h-4 w-4 shrink-0 text-fg-2" />
          </div>

          <h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-[15px] font-semibold leading-[1.3] tracking-[-0.02em] text-fg break-words sm:text-[17px]">
            <button
              type="button"
              data-card-button={id}
              onClick={() => onOpen(id)}
              aria-label={`${shoe.manufacturerName} ${shoe.productName}, ${status.text}`}
              className="text-left outline-none after:absolute after:inset-0 after:z-[2] after:content-['']"
            >
              {shoe.productName}
            </button>
          </h3>

          <p className="mt-1.5 truncate text-[12px] text-fg-3" title={disciplines}>
            {disciplines}
          </p>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className={`text-[15px] font-bold tabular-nums tracking-[-0.02em] sm:text-[16px] ${status.colors.text}`}>
              {status.text}
            </span>
            {shoe.certificationEndDateExp && (
              <span className="text-[11px] tabular-nums text-fg-3 sm:text-[12px]">
                {formatShortDate(shoe.certificationEndDateExp)}까지
              </span>
            )}
          </div>

          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
            <div className={`bar-fill h-full rounded-full ${status.colors.bar}`} style={{ '--ratio': ratio } as CSSProperties} />
          </div>
        </div>
      </div>
    </article>
  );
}

function MediaFallback({ brand }: { brand: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-raised">
      <div className="flex flex-col items-center gap-2 text-fg-4">
        <span className="text-[28px] font-extrabold uppercase tracking-[-0.02em]">{brand.slice(0, 2)}</span>
        <span className="flex items-center gap-1 text-[11px]">
          <ImageOffIcon className="h-3.5 w-3.5" />
          사진 없음
        </span>
      </div>
    </div>
  );
}

const ShoeCard = memo(ShoeCardComponent, (prev, next) => {
  return (
    prev.shoe.productApplicationuuid === next.shoe.productApplicationuuid &&
    prev.today === next.today &&
    prev.isNew === next.isNew &&
    prev.lifted === next.lifted &&
    prev.onOpen === next.onOpen
  );
});

ShoeCard.displayName = 'ShoeCard';

export default ShoeCard;
