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
      return { text: '기간 미정', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' };
    }
    if (remainingDays <= 0) {
      return { text: '승인 기간 만료', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    }
    if (remainingDays <= 30) {
      return { text: `만료까지 ${remainingDays}일`, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    }
    return { text: `만료까지 ${remainingDays}일`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  };

  const status = getStatusInfo();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/70"
      onClick={onClose}
    >
      <div
        className="modal-content relative bg-zinc-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Section */}
          <div className="relative lg:w-1/2 bg-black/40 flex items-center justify-center min-h-[300px] lg:min-h-[550px]">
            {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
              <div className="absolute inset-0 skeleton" />
            )}

            {shoe.imageDocumentuuid && !imageError ? (
              <Image
                src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
                alt={shoe.productName}
                fill
                className={`object-contain p-10 transition-all duration-500 ${
                  imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-zinc-800/50 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-zinc-600 text-sm">이미지를 불러올 수 없습니다</p>
              </div>
            )}

            {/* Brand Badge */}
            <div className="absolute top-5 left-5">
              <span className="glass text-white px-4 py-2 rounded-full text-sm font-medium">
                {shoe.manufacturerName}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-8 lg:p-10 overflow-y-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {shoe.productName}
                </h2>
              </div>
              <p className="text-zinc-500 text-lg">{shoe.shoeType}</p>
            </div>

            {/* Status Card */}
            <div className={`${status.bg} ${status.border} border rounded-2xl p-5 mb-8`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">승인 상태</p>
                  <p className={`text-lg font-semibold ${status.color}`}>{status.text}</p>
                </div>
                {remainingDays !== null && remainingDays > 0 && (
                  <div className="text-right">
                    <p className={`text-4xl font-bold tabular-nums ${status.color}`}>D-{remainingDays}</p>
                  </div>
                )}
              </div>
              {shoe.certificationStartDateExp && shoe.certificationEndDateExp && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(shoe.certificationStartDateExp)} ~ {formatDate(shoe.certificationEndDateExp)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <InfoCard label="모델 번호" value={shoe.modelNumber || '-'} />
              <InfoCard label="개발 신발" value={shoe.isDevelopmentShoe ? '예' : '아니오'} />
              <InfoCard
                label="승인 상태"
                value={shoe.status === 'APPROVED_UNTIL' ? '기간 한정 승인' : '정식 승인'}
              />
              {shoe.releaseDate && (
                <InfoCard label="출시일" value={formatDate(shoe.releaseDateExp)} />
              )}
            </div>

            {/* Alternative Model Numbers */}
            {shoe.alternativeModelNumbers && (
              <div className="mb-8">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">대체 모델 번호</p>
                <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                  <code className="text-sm text-zinc-300 font-mono break-all">
                    {shoe.alternativeModelNumbers}
                  </code>
                </div>
              </div>
            )}

            {/* Disciplines */}
            <div className="mb-8">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                사용 가능 종목 ({shoe.disciplines.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {shoe.disciplines.map((disc) => (
                  <span
                    key={disc.name}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm transition-colors duration-200"
                  >
                    {disc.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-white/5">
              <a
                href="https://certcheck.worldathletics.org/FullList"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
              >
                <span>World Athletics 공식 페이지에서 확인</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-200">
      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-white font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
