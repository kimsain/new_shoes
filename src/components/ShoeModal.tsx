'use client';

import { Shoe } from '@/types/shoe';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ShoeModalProps {
  shoe: Shoe;
  onClose: () => void;
}

const IMAGE_BASE_URL = 'https://certcheck.worldathletics.org/OpenDocument/';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getRemainingDays(endDateStr: string | undefined): number | null {
  if (!endDateStr) return null;
  const endDate = new Date(endDateStr);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function ShoeModal({ shoe, onClose }: ShoeModalProps) {
  const [imageError, setImageError] = useState(false);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{shoe.productName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          {/* Image */}
          <div className="relative w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden bg-gray-900">
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
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
                이미지 없음
              </div>
            )}
          </div>

          {/* Validity Status */}
          {remainingDays !== null && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                remainingDays > 30
                  ? 'bg-green-500/20 border border-green-500/50'
                  : remainingDays > 0
                    ? 'bg-yellow-500/20 border border-yellow-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
              }`}
            >
              <p className="text-lg font-semibold text-white">
                {remainingDays > 0
                  ? `승인 만료까지 ${remainingDays}일 남음`
                  : '승인 기간 만료됨'}
              </p>
              <p className="text-sm text-gray-300">
                {formatDate(shoe.certificationStartDateExp)} ~ {formatDate(shoe.certificationEndDateExp)}
              </p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoItem label="제조사" value={shoe.manufacturerName} />
            <InfoItem label="모델 번호" value={shoe.modelNumber} />
            <InfoItem label="타입" value={shoe.shoeType} />
            <InfoItem label="개발 신발" value={shoe.isDevelopmentShoe ? '예' : '아니오'} />
            <InfoItem label="상태" value={shoe.status === 'APPROVED_UNTIL' ? '기간 한정 승인' : '승인됨'} />
            {shoe.releaseDate && <InfoItem label="출시일" value={formatDate(shoe.releaseDateExp)} />}
          </div>

          {/* Alternative Model Numbers */}
          {shoe.alternativeModelNumbers && (
            <div className="mb-6">
              <h3 className="text-sm text-gray-400 uppercase mb-2">대체 모델 번호</h3>
              <p className="text-white bg-slate-700 p-3 rounded-lg text-sm">
                {shoe.alternativeModelNumbers}
              </p>
            </div>
          )}

          {/* Disciplines */}
          <div>
            <h3 className="text-sm text-gray-400 uppercase mb-2">사용 가능 종목</h3>
            <div className="flex flex-wrap gap-2">
              {shoe.disciplines.map((disc) => (
                <span
                  key={disc.name}
                  className="bg-purple-500/30 text-purple-200 px-3 py-1.5 rounded-lg text-sm"
                >
                  {disc.name}
                </span>
              ))}
            </div>
          </div>

          {/* External Link */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <a
              href={`https://certcheck.worldathletics.org/FullList`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              World Athletics Shoe Checker에서 보기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/50 p-3 rounded-lg">
      <p className="text-xs text-gray-400 uppercase mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
