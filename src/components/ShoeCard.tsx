'use client';

import { Shoe } from '@/types/shoe';
import Image from 'next/image';
import { useState } from 'react';

interface ShoeCardProps {
  shoe: Shoe;
  onClick: () => void;
}

const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/api/ProductImage/';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR');
}

function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function ShoeCard({ shoe, onClick }: ShoeCardProps) {
  const [imageError, setImageError] = useState(false);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);

  const validityStatus = remainingDays !== null
    ? remainingDays > 0
      ? `D-${remainingDays}`
      : '만료됨'
    : '기간 없음';

  const statusColor = remainingDays !== null
    ? remainingDays > 30
      ? 'bg-green-500'
      : remainingDays > 0
        ? 'bg-yellow-500'
        : 'bg-red-500'
    : 'bg-gray-500';

  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-[1.02] hover:shadow-xl border border-white/10 hover:border-purple-400/50"
    >
      {/* Image */}
      <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-800">
        {shoe.imageDocumentuuid && !imageError ? (
          <Image
            src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
            alt={shoe.productName}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span>이미지 없음</span>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-white mb-1 truncate" title={shoe.productName}>
        {shoe.productName}
      </h3>
      <p className="text-sm text-gray-400 mb-2">{shoe.shoeType}</p>

      {/* Validity Badge */}
      <div className="flex items-center justify-between">
        <span className={`${statusColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
          {validityStatus}
        </span>
        <span className="text-xs text-gray-400">
          ~{formatDate(shoe.certificationEndDateExp)}
        </span>
      </div>

      {/* Disciplines */}
      <div className="mt-2 flex flex-wrap gap-1">
        {shoe.disciplines.slice(0, 3).map((disc) => (
          <span
            key={disc.name}
            className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded"
          >
            {disc.name.split(' ')[0]}
          </span>
        ))}
        {shoe.disciplines.length > 3 && (
          <span className="text-xs text-gray-400">+{shoe.disciplines.length - 3}</span>
        )}
      </div>
    </div>
  );
}
