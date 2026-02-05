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

function formatDateShort(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ShoeCard({ shoe, onClick, isNew }: ShoeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);

  const getStatusInfo = () => {
    if (remainingDays === null) {
      return { text: '기간 없음', color: 'bg-gray-600', textColor: 'text-gray-300' };
    }
    if (remainingDays <= 0) {
      return { text: '만료됨', color: 'bg-red-500', textColor: 'text-white' };
    }
    if (remainingDays <= 30) {
      return { text: `D-${remainingDays}`, color: 'bg-amber-500', textColor: 'text-white' };
    }
    if (remainingDays <= 90) {
      return { text: `D-${remainingDays}`, color: 'bg-blue-500', textColor: 'text-white' };
    }
    return { text: `D-${remainingDays}`, color: 'bg-green-500', textColor: 'text-white' };
  };

  const status = getStatusInfo();

  return (
    <article
      onClick={onClick}
      className="group relative bg-gray-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:bg-gray-800 card-glow border border-gray-800 hover:border-gray-700"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-950 overflow-hidden">
        {/* Skeleton loader */}
        {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
          <div className="absolute inset-0 skeleton" />
        )}

        {shoe.imageDocumentuuid && !imageError ? (
          <Image
            src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
            alt={shoe.productName}
            fill
            className={`object-contain p-4 transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 mx-auto text-gray-700 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-600">No Image</span>
            </div>
          </div>
        )}

        {/* D-Day Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span className={`${status.color} ${status.textColor} px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg`}>
            {status.text}
          </span>
        </div>

        {/* Brand Badge - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
            {shoe.manufacturerName}
          </span>
          {isNew && (
            <span className="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg animate-pulse">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-green-400 transition-colors">
          {shoe.productName}
        </h3>

        {/* Type */}
        <p className="text-sm text-gray-500 mb-3">{shoe.shoeType}</p>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs">
          {/* Validity Period */}
          <div className="text-gray-500">
            {shoe.certificationEndDateExp && (
              <span>~ {formatDateShort(shoe.certificationEndDateExp)}</span>
            )}
          </div>

          {/* Disciplines Count */}
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{shoe.disciplines.length} 종목</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </article>
  );
}
