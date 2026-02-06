'use client';

import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { IMAGE_BASE_URL } from '@/constants';
import { getStatusInfo } from '@/utils/date';
import { getProgressPercent } from '@/utils/progress';

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
  const progressPercent = getProgressPercent(status.remainingDays);

  const handleImageError = useCallback(() => {
    if (retryCount < MAX_RETRY_COUNT) {
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
      className="card-new group relative cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
      <div className="relative aspect-[16/10] bg-black/40 overflow-hidden">
        {/* Skeleton loader */}
        {!imageLoaded && !imageError && imageUrl && (
          <div className="absolute inset-0 skeleton">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-zinc-800/50 uppercase tracking-widest">
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
            className={`object-contain p-8 transition-all duration-700 ${
              imageLoaded
                ? 'opacity-100 scale-100 blur-0'
                : 'opacity-0 scale-[0.97] blur-sm'
            } group-hover:scale-105 group-hover:rotate-1`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
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
                  className="w-8 h-8 text-zinc-700"
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

        {/* Top shine effect on hover */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Glow line separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent group-hover:via-indigo-500/40 transition-all duration-700" />

      {/* Content */}
      <div className="p-6">
        {/* Brand + NEW badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500">
            {shoe.manufacturerName}
          </span>
          {isNew && (
            <span className="bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-lg text-white line-clamp-2 break-words mb-2 group-hover:text-indigo-300 transition-colors duration-300">
          {shoe.productName}
        </h3>

        {/* Type */}
        <p className="text-sm text-zinc-500 mb-4">{shoe.shoeType}</p>

        {/* D-day Status Box */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="mb-2">
            <span className={`text-sm font-semibold ${status.colors.text}`}>
              {status.text}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${status.colors.bar} transition-all duration-700 ease-out`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
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
