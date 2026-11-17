'use client';

import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { CARD_IMAGE_SIZES, IMAGE_BASE_URL } from '@/constants';
import { formatDate, formatShortDate, getDaysBetween, getDaysSince, getStatusInfo } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';
import { getElapsedRatio } from '@/utils/progress';
import CountUp from './CountUp';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon, ImageOffIcon } from './icons';

interface ShoeModalProps {
  shoe: Shoe;
  index: number;
  total: number;
  isNew: boolean;
  /** View Transition을 쓰지 못할 때의 CSS 닫힘 애니메이션 */
  closing: boolean;
  direction: 'left' | 'right' | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const FOCUSABLE = 'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])';
const SWIPE_THRESHOLD = 50;

export default function ShoeModal({
  shoe,
  index,
  total,
  isNew,
  closing,
  direction,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ShoeModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const id = shoe.productApplicationuuid;
  const navClass = direction === 'left' ? 'nav-from-left' : direction === 'right' ? 'nav-from-right' : '';

  // 스크롤 잠금과 첫 포커스
  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = '';
    };
  }, []);

  // 키보드: ESC, 좌우 이동, Tab을 패널 안에 가둔다
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomed) {
        if (e.key === 'Escape') setZoomed(false);
        return;
      }
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.offsetParent !== null
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomed, hasPrev, hasNext, onClose, onPrev, onNext]);

  const counter = (
    <span className="tabular-nums text-[13px] font-medium text-fg-2">
      <span className="text-fg">{index + 1}</span> / {total}
    </span>
  );

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-lg ${closing ? 'overlay-out' : 'overlay-in'}`}
        onClick={onClose}
      />

      <div className="pointer-events-none absolute inset-0 flex items-stretch justify-center lg:items-center lg:p-8">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          tabIndex={-1}
          className={`detail-panel pointer-events-auto relative flex h-full w-full flex-col overflow-y-auto overscroll-contain bg-surface outline-none lg:grid lg:h-[min(760px,calc(100svh-64px))] lg:max-w-[1180px] lg:grid-cols-[1.12fr_1fr] lg:overflow-hidden lg:rounded-[28px] lg:border lg:border-line-strong lg:shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] ${
            closing ? 'popup-out' : 'popup-in'
          }`}
        >
          {/* 모바일 상단 막대: 사진 위에 떠 있다 */}
          <div className="sticky top-0 z-20 -mb-14 flex h-14 shrink-0 items-center justify-between px-3 pt-[env(safe-area-inset-top)] lg:hidden">
            <span className="rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-md">{counter}</span>
            <IconButton label="닫기" onClick={onClose} className="bg-black/55 backdrop-blur-md">
              <CloseIcon className="h-[18px] w-[18px]" />
            </IconButton>
          </div>

          <DetailMedia
            key={`media-${id}`}
            shoe={shoe}
            navClass={navClass}
            onZoom={() => setZoomed(true)}
            onSwipe={(dir) => (dir === 'left' ? hasNext && onNext() : hasPrev && onPrev())}
          />

          <div className="flex min-h-0 flex-col">
            <div className="hidden items-center justify-between px-8 pb-2 pt-6 lg:flex">
              {counter}
              <div className="flex items-center gap-1.5">
                <IconButton label="이전 신발" onClick={onPrev} disabled={!hasPrev}>
                  <ChevronLeftIcon className="h-[18px] w-[18px]" />
                </IconButton>
                <IconButton label="다음 신발" onClick={onNext} disabled={!hasNext}>
                  <ChevronRightIcon className="h-[18px] w-[18px]" />
                </IconButton>
                <span className="mx-1 h-5 w-px bg-line-strong" aria-hidden="true" />
                <IconButton label="닫기" onClick={onClose}>
                  <CloseIcon className="h-[18px] w-[18px]" />
                </IconButton>
              </div>
            </div>

            <div className="flex-1 px-5 pb-8 pt-6 lg:overflow-y-auto lg:px-8 lg:pb-8 lg:pt-4">
              <DetailInfo key={`info-${id}`} shoe={shoe} isNew={isNew} navClass={navClass} />
            </div>

            <div className="hidden items-center justify-end gap-4 border-t border-line px-8 py-4 text-[12px] text-fg-3 lg:flex">
              <span className="flex items-center gap-1.5">
                <Kbd>←</Kbd>
                <Kbd>→</Kbd>
                이동
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>ESC</Kbd>
                닫기
              </span>
            </div>
          </div>

          {/* 모바일 하단 이동 막대 */}
          <div className="sticky bottom-0 z-20 mt-auto flex gap-2 border-t border-line bg-surface/90 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-control text-[15px] font-medium text-fg transition-opacity disabled:opacity-35"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              이전
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-control text-[15px] font-medium text-fg transition-opacity disabled:opacity-35"
            >
              다음
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {zoomed && shoe.imageDocumentuuid && (
        <ZoomOverlay shoe={shoe} onClose={() => setZoomed(false)} />
      )}
    </div>
  );
}

/**
 * 상세 사진. 카드와 같은 sizes로 이미 받은 사진을 먼저 깔고, 큰 사진이 오면 위에 덮는다.
 * view-transition-name이 카드 사진과 같아서 열고 닫을 때 사진이 제자리로 날아간다.
 */
function DetailMedia({
  shoe,
  navClass,
  onZoom,
  onSwipe,
}: {
  shoe: Shoe;
  navClass: string;
  onZoom: () => void;
  onSwipe: (direction: 'left' | 'right') => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const src = shoe.imageDocumentuuid ? `${IMAGE_BASE_URL}${shoe.imageDocumentuuid}` : null;

  const handleTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dy) < 40) onSwipe(dx < 0 ? 'left' : 'right');
  };

  return (
    <div className="shrink-0 p-2 lg:h-full lg:p-3 lg:pr-0">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-raised lg:aspect-auto lg:h-full"
        style={{ viewTransitionName: 'shoe-media' } as CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {src && !failed ? (
          <div className={`absolute inset-0 ${navClass}`}>
            <Image
              src={src}
              alt=""
              aria-hidden="true"
              fill
              sizes={CARD_IMAGE_SIZES}
              loading="eager"
              className="scale-125 object-cover opacity-90 blur-2xl saturate-150"
            />
            <Image
              src={src}
              alt=""
              aria-hidden="true"
              fill
              sizes={CARD_IMAGE_SIZES}
              loading="eager"
              className="object-contain p-5 lg:p-10"
            />
            <Image
              src={src}
              alt={`${shoe.manufacturerName} ${shoe.productName}`}
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="object-contain p-5 transition-opacity duration-300 ease-out lg:p-10"
              style={{ opacity: loaded ? 1 : 0 }}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-fg-4">
            <span className="flex flex-col items-center gap-2 text-[13px]">
              <ImageOffIcon className="h-8 w-8" />
              사진 없음
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/[0.06]" />

        {src && !failed && (
          <button
            type="button"
            onClick={onZoom}
            className="absolute bottom-3 right-3 flex h-9 items-center gap-1.5 rounded-full bg-black/55 px-3.5 text-[13px] font-medium text-fg backdrop-blur-md transition-colors duration-150 hover:bg-black/75"
          >
            <ExpandIcon className="h-3.5 w-3.5" />
            크게 보기
          </button>
        )}
      </div>
    </div>
  );
}

function DetailInfo({ shoe, isNew, navClass }: { shoe: Shoe; isNew: boolean; navClass: string }) {
  const status = getStatusInfo(shoe.certificationEndDateExp);
  const remaining = status.remainingDays;
  const elapsed = getElapsedRatio(shoe.certificationStartDateExp, shoe.certificationEndDateExp);
  const windowDays = getDaysBetween(shoe.certificationStartDateExp, shoe.certificationEndDateExp);
  const elapsedDays = getDaysSince(shoe.certificationStartDateExp);

  return (
    <div className={navClass}>
      <p className="text-[13px] font-medium text-fg-3">{shoe.manufacturerName}</p>
      <h2
        id="detail-title"
        className="mt-2 text-[28px] font-bold leading-[1.15] tracking-[-0.035em] text-fg break-words lg:text-[34px]"
      >
        {shoe.productName}
      </h2>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {isNew && <Tag className="bg-volt text-volt-ink">NEW</Tag>}
        <Tag>{shoe.shoeType}</Tag>
        {shoe.disciplines.map((d) => (
          <Tag key={d.name}>{getDisplayName(d.name)}</Tag>
        ))}
      </div>

      {/* 남은 기간 */}
      <div className="mt-7 rounded-[20px] border border-line bg-raised/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] text-fg-3">인증 만료까지</p>
            <p
              className={`mt-2 text-[56px] font-extrabold leading-none tracking-[-0.05em] lg:text-[64px] ${status.colors.emphasis}`}
            >
              {remaining !== null && remaining > 0 ? (
                <>
                  <CountUp value={remaining} duration={700} delay={120} />
                  <span className="ml-1 text-[20px] font-bold tracking-[-0.02em] text-fg-3">일</span>
                </>
              ) : (
                <span className="text-[40px]">{status.text}</span>
              )}
            </p>
          </div>
          <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${status.colors.chip}`}>
            {status.colors.label}
          </span>
        </div>

        {elapsed !== null && (
          <div className="mt-6">
            <div className="mb-2.5 flex justify-between text-[12px] text-fg-3">
              <span>
                인증 기간 <span className="tabular-nums text-fg-2">{windowDays}일</span>
              </span>
              {elapsedDays !== null && elapsedDays >= 0 && (
                <span>
                  <span className="tabular-nums text-fg-2">{elapsedDays}일</span> 지남
                </span>
              )}
            </div>
            <div className="relative h-1.5 rounded-full bg-white/[0.08]">
              <div
                className={`timeline-fill absolute inset-0 rounded-full ${status.colors.bar}`}
                style={{ '--p': 1 - elapsed } as CSSProperties}
              />
              <div className="timeline-marker absolute inset-0" style={{ '--p': elapsed } as CSSProperties}>
                <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface bg-fg shadow-[0_0_0_1px_rgb(255_255_255/0.2)]" />
              </div>
            </div>
            <div className="mt-2.5 flex justify-between text-[12px] tabular-nums text-fg-3">
              <span>{formatShortDate(shoe.certificationStartDateExp)} 시작</span>
              <span>{formatShortDate(shoe.certificationEndDateExp)} 만료</span>
            </div>
          </div>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line">
        <Field label="모델 번호" value={shoe.modelNumber || '-'} />
        <Field label="유형" value={shoe.shoeType} />
        <Field label="인증 시작" value={formatDate(shoe.certificationStartDateExp)} />
        <Field label="인증 만료" value={formatDate(shoe.certificationEndDateExp)} />
        {shoe.releaseDateExp && <Field label="출시일" value={formatDate(shoe.releaseDateExp)} />}
      </dl>

      {shoe.alternativeModelNumbers && (
        <div className="mt-6">
          <p className="mb-2 text-[13px] font-semibold text-fg-3">대체 모델 번호</p>
          <p className="rounded-[16px] border border-line bg-raised/60 p-4 text-[14px] leading-relaxed tabular-nums text-fg-2 break-words">
            {shoe.alternativeModelNumbers}
          </p>
        </div>
      )}
    </div>
  );
}

function ZoomOverlay({ shoe, onClose }: { shoe: Shoe; onClose: () => void }) {
  return (
    <div className="overlay-in fixed inset-0 z-[80] cursor-zoom-out bg-black/95" onClick={onClose}>
      <div className="popup-in absolute inset-4 bottom-24 sm:inset-10 sm:bottom-28">
        <Image
          src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
          alt={`${shoe.manufacturerName} ${shoe.productName}`}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
      <IconButton label="크게 보기 닫기" onClick={onClose} className="absolute right-4 top-4 bg-white/10 backdrop-blur-md sm:right-6 sm:top-6">
        <CloseIcon className="h-5 w-5" />
      </IconButton>
      <div className="absolute inset-x-0 bottom-6 text-center sm:bottom-8">
        <p className="text-[16px] font-semibold text-fg">{shoe.productName}</p>
        <p className="mt-1 text-[13px] text-fg-3">{shoe.manufacturerName}</p>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  className = '',
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={`grid h-10 w-10 place-items-center rounded-full text-fg-2 transition-colors duration-150 hover:bg-white/[0.08] hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

function Tag({ children, className = 'bg-white/[0.06] text-fg-2' }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold leading-none ${className}`}>{children}</span>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-surface p-4 last:odd:col-span-2">
      <dt className="text-[12px] text-fg-3">{label}</dt>
      <dd className="mt-1 truncate text-[14px] font-medium text-fg" title={value}>
        {value}
      </dd>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="grid h-6 min-w-6 place-items-center rounded-md border border-line-strong px-1.5 text-[11px] font-medium text-fg-2">
      {children}
    </kbd>
  );
}
