'use client';

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { IMAGE_BASE_URL } from '@/constants';
import { getStatusInfo } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';

interface ShoeCardProps {
  shoe: Shoe;
  onClick: () => void;
  isNew?: boolean;
}

const MAX_RETRY_COUNT = 1;

function ShoeCardComponent({ shoe, onClick, isNew }: ShoeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const status = getStatusInfo(shoe.certificationEndDateExp);

  const handleImageError = useCallback(() => {
    if (retryCount < MAX_RETRY_COUNT) {
      // 재시도
      setRetryCount((prev) => prev + 1);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  }, [retryCount]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const imageUrl = shoe.imageDocumentuuid
    ? `${IMAGE_BASE_URL}${shoe.imageDocumentuuid}${retryCount > 0 ? `?retry=${retryCount}` : ''}`
    : null;

  return (
    <article
      onClick={onClick}
      className="card-enhanced group relative cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      tabIndex={0}
      role="button"
      aria-label={`${shoe.manufacturerName} ${shoe.productName} - ${status.text}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-zinc-950/50 overflow-hidden">
        {/* Skeleton loader with shimmer */}
        {!imageLoaded && !imageError && imageUrl && (
          <div className="absolute inset-0 skeleton">
            {/* Brand placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-800/50 uppercase tracking-widest">
                {shoe.manufacturerName.slice(0, 2)}
              </span>
            </div>
          </div>
        )}

        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={shoe.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-6 transition-all duration-500 ease-out ${
              imageLoaded
                ? 'opacity-100 scale-100 blur-0'
                : 'opacity-0 scale-95 blur-sm'
            } group-hover:scale-110`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-3">
                <svg
                  className="w-8 h-8 text-zinc-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xs text-zinc-600">이미지 없음</span>
            </div>
          </div>
        )}

        {/* Brand + New Badge - Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-xs font-medium shadow-lg">
            {shoe.manufacturerName}
          </span>
          {isNew && (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide pulse-gentle shadow-lg shadow-emerald-500/30">
              New
            </span>
          )}
        </div>

        {/* Gradient overlay - enhanced on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top shine effect on hover */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Top Row: Product Name + D-day */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-white line-clamp-2 break-words group-hover:text-emerald-400 transition-colors duration-300 flex-1">
            {shoe.productName}
          </h3>
          <span
            className={`${status.colors.bg} ${status.colors.text} px-2 py-0.5 rounded-md text-xs font-bold tabular-nums whitespace-nowrap shadow-sm`}
          >
            {status.text}
          </span>
        </div>

        {/* Type */}
        <p className="text-sm text-zinc-500 mb-3">{shoe.shoeType}</p>

        {/* Disciplines */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {shoe.disciplines.slice(0, 2).map((disc) => (
            <span
              key={disc.name}
              className="px-2 py-1 bg-zinc-800/70 text-zinc-300 rounded-md text-xs break-words transition-colors duration-300 group-hover:bg-zinc-700/70"
            >
              {getDisplayName(disc.name)}
            </span>
          ))}
          {shoe.disciplines.length > 2 && (
            <span className="px-2 py-1 text-zinc-500 text-xs">
              +{shoe.disciplines.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line on hover - enhanced glow */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-emerald-500/50" />
    </article>
  );
}

// React.memo로 불필요한 리렌더링 방지
const ShoeCard = memo(ShoeCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.shoe.productApplicationuuid === nextProps.shoe.productApplicationuuid &&
    prevProps.isNew === nextProps.isNew
  );
});

ShoeCard.displayName = 'ShoeCard';

export default ShoeCard;
