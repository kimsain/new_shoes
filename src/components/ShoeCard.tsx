'use client';

import { Shoe } from '@/types/shoe';
import Image from 'next/image';
import { useState } from 'react';

interface ShoeCardProps {
  shoe: Shoe;
  onClick: () => void;
  isNew?: boolean;
}

const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/OpenDocument/';

function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function ShoeCard({ shoe, onClick, isNew }: ShoeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);

  const getStatusInfo = () => {
    if (remainingDays === null) {
      return { text: '기간 미정', bgColor: 'bg-zinc-800', textColor: 'text-zinc-400' };
    }
    if (remainingDays <= 0) {
      return { text: '만료', bgColor: 'bg-red-500/15', textColor: 'text-red-400' };
    }
    if (remainingDays <= 30) {
      return { text: `D-${remainingDays}`, bgColor: 'bg-amber-500/15', textColor: 'text-amber-400' };
    }
    if (remainingDays <= 90) {
      return { text: `D-${remainingDays}`, bgColor: 'bg-sky-500/15', textColor: 'text-sky-400' };
    }
    return { text: `D-${remainingDays}`, bgColor: 'bg-emerald-500/15', textColor: 'text-emerald-400' };
  };

  const status = getStatusInfo();

  return (
    <article
      onClick={onClick}
      className="card group relative cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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
      <div className="relative aspect-[4/3] bg-zinc-950/50 overflow-hidden will-change-transform">
        {/* Skeleton loader */}
        {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
          <div className="absolute inset-0 skeleton" />
        )}

        {shoe.imageDocumentuuid && !imageError ? (
          <Image
            src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
            alt={shoe.productName}
            fill
            className={`object-contain p-6 img-zoom ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
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
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-black/50 backdrop-blur-md text-white/90 px-2.5 py-1 rounded-full text-xs font-medium">
            {shoe.manufacturerName}
          </span>
          {isNew && (
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide pulse-gentle">
              New
            </span>
          )}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Top Row: Product Name + D-day */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-semibold text-white line-clamp-2 break-words group-hover:text-emerald-400 transition-colors duration-300 flex-1">
            {shoe.productName}
          </h3>
          <span className={`${status.bgColor} ${status.textColor} px-2 py-0.5 rounded-md text-xs font-bold tabular-nums whitespace-nowrap`}>
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
              className="px-2 py-1 bg-zinc-800/70 text-zinc-300 rounded-md text-xs break-words"
            >
              {disc.name}
            </span>
          ))}
          {shoe.disciplines.length > 2 && (
            <span className="px-2 py-1 text-zinc-500 text-xs">
              +{shoe.disciplines.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  );
}
