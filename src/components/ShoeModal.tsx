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
  if (!dateStr) return '-';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const getStatusInfo = () => {
    if (remainingDays === null) {
      return { text: '기간 없음', color: 'bg-gray-600', borderColor: 'border-gray-600' };
    }
    if (remainingDays <= 0) {
      return { text: '승인 기간 만료', color: 'bg-red-500/20', borderColor: 'border-red-500/50' };
    }
    if (remainingDays <= 30) {
      return { text: `만료까지 ${remainingDays}일`, color: 'bg-amber-500/20', borderColor: 'border-amber-500/50' };
    }
    return { text: `만료까지 ${remainingDays}일`, color: 'bg-green-500/20', borderColor: 'border-green-500/50' };
  };

  const status = getStatusInfo();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative bg-[#141414] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white hover:bg-black/70 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="relative lg:w-1/2 bg-gray-950 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
            {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
              <div className="absolute inset-0 skeleton" />
            )}

            {shoe.imageDocumentuuid && !imageError ? (
              <Image
                src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
                alt={shoe.productName}
                fill
                className={`object-contain p-8 transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="text-center text-gray-600">
                <svg className="w-20 h-20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>이미지 없음</p>
              </div>
            )}

            {/* Brand Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                {shoe.manufacturerName}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {shoe.productName}
              </h2>
              <p className="text-gray-400">{shoe.shoeType}</p>
            </div>

            {/* Status Banner */}
            <div className={`${status.color} ${status.borderColor} border rounded-xl p-4 mb-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">승인 상태</p>
                  <p className="text-lg font-semibold text-white">{status.text}</p>
                </div>
                {remainingDays !== null && remainingDays > 0 && (
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">D-{remainingDays}</p>
                  </div>
                )}
              </div>
              {shoe.certificationStartDateExp && shoe.certificationEndDateExp && (
                <p className="text-sm text-gray-400 mt-2">
                  {formatDate(shoe.certificationStartDateExp)} ~ {formatDate(shoe.certificationEndDateExp)}
                </p>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <InfoCard label="모델 번호" value={shoe.modelNumber || '-'} />
              <InfoCard label="개발 신발" value={shoe.isDevelopmentShoe ? '예' : '아니오'} />
              <InfoCard
                label="상태"
                value={shoe.status === 'APPROVED_UNTIL' ? '기간 한정' : '승인됨'}
              />
              {shoe.releaseDate && (
                <InfoCard label="출시일" value={formatDate(shoe.releaseDateExp)} />
              )}
            </div>

            {/* Alternative Numbers */}
            {shoe.alternativeModelNumbers && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">대체 모델 번호</p>
                <p className="text-sm text-gray-300 bg-gray-900 rounded-lg p-3 font-mono">
                  {shoe.alternativeModelNumbers}
                </p>
              </div>
            )}

            {/* Disciplines */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">사용 가능 종목</p>
              <div className="flex flex-wrap gap-2">
                {shoe.disciplines.map((disc) => (
                  <span
                    key={disc.name}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm"
                  >
                    {disc.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Link */}
            <div className="pt-4 border-t border-gray-800">
              <a
                href="https://certcheck.worldathletics.org/FullList"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <span>World Athletics에서 확인</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm text-white font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
