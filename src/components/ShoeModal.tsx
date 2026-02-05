'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { IMAGE_BASE_URL } from '@/constants';
import { formatDate, getDetailedStatusInfo, getRemainingDays } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';

interface ShoeModalProps {
  shoe: Shoe;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

// D-day 진행률 계산 (최대 180일 기준)
function getProgressPercent(daysRemaining: number | null): number {
  if (daysRemaining === null) return 0;
  if (daysRemaining <= 0) return 0;
  return Math.min(100, (daysRemaining / 180) * 100);
}

export default function ShoeModal({
  shoe,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: ShoeModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const status = getDetailedStatusInfo(shoe.certificationEndDateExp);
  const remainingDays = getRemainingDays(shoe.certificationEndDateExp);
  const progressPercent = getProgressPercent(remainingDays);

  // Status bar color
  const getStatusBarColor = () => {
    if (remainingDays === null) return 'bg-zinc-500';
    if (remainingDays <= 0) return 'bg-red-500';
    if (remainingDays <= 30) return 'bg-amber-500';
    if (remainingDays <= 90) return 'bg-sky-500';
    return 'bg-emerald-500';
  };

  // 모달 닫기 애니메이션
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          setIsZoomed(false);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (hasPrev && onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
        case 'ArrowRight':
          if (hasNext && onNext) {
            e.preventDefault();
            onNext();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleClose, onPrev, onNext, hasPrev, hasNext, isZoomed]);

  // 신발 변경 시 상태 초기화
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setIsZoomed(false);
  }, [shoe.productApplicationuuid]);

  const toggleZoom = () => {
    if (shoe.imageDocumentuuid && !imageError) {
      setIsZoomed(!isZoomed);
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isClosing ? 'animate-fade-out' : 'animate-in fade-in duration-200'
        }`}
        style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)' }}
        onClick={handleClose}
      >
        <div
          className={`relative bg-[#0a0a0a] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/[0.06] shadow-2xl ${
            isClosing ? 'modal-zoom-exit' : 'modal-zoom-enter'
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {hasPrev && onPrev && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  aria-label="Previous shoe"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500">
                  {shoe.manufacturerName}
                </p>
                <h2 id="modal-title" className="text-white font-medium">
                  {shoe.productName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasNext && onNext && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Next shoe"
                  className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleClose}
                aria-label="Close"
                className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
            {/* Image Section */}
            <div
              className="relative aspect-[16/9] bg-black/40 flex items-center justify-center cursor-zoom-in modal-stagger-1"
              onClick={toggleZoom}
            >
              {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
                <div className="absolute inset-0 skeleton">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-zinc-800/30 uppercase tracking-widest">
                      {shoe.manufacturerName.slice(0, 2)}
                    </span>
                  </div>
                </div>
              )}

              {shoe.imageDocumentuuid && !imageError ? (
                <Image
                  src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
                  alt={shoe.productName}
                  fill
                  className={`object-contain p-12 transition-all duration-500 ${
                    imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } hover:scale-105`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  priority
                  unoptimized
                />
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-zinc-800/50 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-zinc-600 text-sm">No image available</p>
                </div>
              )}

              {/* Zoom hint */}
              {shoe.imageDocumentuuid && !imageError && imageLoaded && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-zinc-400 text-xs flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Click to zoom
                </div>
              )}
            </div>

            {/* Glow line separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {/* Info Section */}
            <div className="p-6 lg:p-8 space-y-6">
              {/* Type */}
              <p className="text-zinc-500 modal-stagger-2">{shoe.shoeType}</p>

              {/* Status Card with Progress Bar */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] modal-stagger-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-lg font-semibold ${status.color}`}>
                    {remainingDays !== null && remainingDays > 0 ? `D-${remainingDays}` : status.text}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${getStatusBarColor()}`} />
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${getStatusBarColor()} transition-all duration-700 ease-out`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Date range */}
                {shoe.certificationStartDateExp && shoe.certificationEndDateExp && (
                  <p className="text-sm text-zinc-500">
                    {formatDate(shoe.certificationStartDateExp)} → {formatDate(shoe.certificationEndDateExp)}
                  </p>
                )}
              </div>

              {/* Details Grid */}
              <div className="modal-stagger-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500 mb-3">
                  Details
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <DetailCard label="Model" value={shoe.modelNumber || '-'} />
                  <DetailCard label="Status" value={shoe.status === 'APPROVED_UNTIL' ? 'Limited' : 'Approved'} />
                  {shoe.releaseDate && <DetailCard label="Release" value={formatDate(shoe.releaseDateExp)} />}
                </div>
              </div>

              {/* Disciplines */}
              <div className="modal-stagger-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500 mb-3">
                  Disciplines
                </p>
                <div className="flex flex-wrap gap-2">
                  {shoe.disciplines.map((disc) => (
                    <span
                      key={disc.name}
                      className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.06] text-zinc-300 rounded-lg text-sm transition-colors duration-200"
                    >
                      {getDisplayName(disc.name)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alternative Model Numbers */}
              {shoe.alternativeModelNumbers && (
                <div className="modal-stagger-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-zinc-500 mb-3">
                    Alternative Models
                  </p>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/[0.06]">
                    <code className="text-sm text-zinc-400 font-mono break-all">
                      {shoe.alternativeModelNumbers}
                    </code>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                {/* External link */}
                <a
                  href="https://certcheck.worldathletics.org/FullList"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-indigo-400 transition-colors duration-200"
                >
                  <span>View on World Athletics</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                {/* Keyboard hints */}
                <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-600">
                  {(hasPrev || hasNext) && (
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-500">←</kbd>
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-500">→</kbd>
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-500">ESC</kbd>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Overlay */}
      {isZoomed && shoe.imageDocumentuuid && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center zoom-overlay cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoom"
            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full max-w-[90vw] max-h-[90vh]">
            <Image
              src={`${IMAGE_BASE_URL}${shoe.imageDocumentuuid}`}
              alt={shoe.productName}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white font-semibold mb-1">{shoe.productName}</p>
            <p className="text-zinc-400 text-sm">{shoe.manufacturerName}</p>
          </div>
        </div>
      )}
    </>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
      <p className="text-[10px] font-medium uppercase tracking-[0.05em] text-zinc-600 mb-1">{label}</p>
      <p className="text-sm text-white font-medium truncate" title={value}>
        {value}
      </p>
    </div>
  );
}
