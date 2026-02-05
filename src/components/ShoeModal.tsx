'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Shoe } from '@/types/shoe';
import { IMAGE_BASE_URL } from '@/constants';
import { formatDate, getDetailedStatusInfo } from '@/utils/date';
import { getDisplayName } from '@/utils/displayNames';

interface ShoeModalProps {
  shoe: Shoe;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
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
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-enhanced ${
          isClosing ? 'animate-fade-out' : 'animate-in fade-in duration-200'
        }`}
        onClick={handleClose}
      >
        <div
          className={`relative bg-zinc-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/5 shadow-2xl overscroll-contain ${
            isClosing ? 'modal-zoom-exit' : 'modal-zoom-enter'
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="닫기"
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 btn-haptic"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {hasPrev && onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="이전 신발"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 btn-haptic nav-arrow-left"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="다음 신발"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 btn-haptic nav-arrow-right"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
            {/* Image Section */}
            <div
              className="relative lg:w-1/2 bg-black/40 flex items-center justify-center min-h-[300px] lg:min-h-[550px] cursor-zoom-in"
              onClick={toggleZoom}
            >
              {!imageLoaded && !imageError && shoe.imageDocumentuuid && (
                <div className="absolute inset-0 skeleton">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-zinc-800/30 uppercase tracking-widest">
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
                  className={`object-contain p-10 transition-all duration-500 ${
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
                    <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-zinc-600 text-sm">이미지를 불러올 수 없습니다</p>
                </div>
              )}

              {/* Zoom hint */}
              {shoe.imageDocumentuuid && !imageError && imageLoaded && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-zinc-400 text-xs flex items-center gap-1.5 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  클릭하여 확대
                </div>
              )}

              {/* Brand Badge */}
              <div className="absolute top-5 left-5">
                <span className="glass text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  {shoe.manufacturerName}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <h2 id="modal-title" className="text-2xl lg:text-3xl font-bold text-white leading-tight mb-1">
                  {shoe.productName}
                </h2>
                <p className="text-zinc-500">{shoe.shoeType}</p>
              </div>

              {/* Status Card */}
              <div className={`${status.bg} ${status.border} border rounded-2xl p-5 mb-6 transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">승인 상태</p>
                    <p className={`text-lg font-semibold ${status.color}`}>{status.text}</p>
                  </div>
                  {status.remainingDays !== null && status.remainingDays > 0 && (
                    <div className="text-right">
                      <p className={`text-4xl font-bold tabular-nums ${status.color}`}>
                        D-{status.remainingDays}
                      </p>
                    </div>
                  )}
                </div>
                {shoe.certificationStartDateExp && shoe.certificationEndDateExp && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {formatDate(shoe.certificationStartDateExp)} ~ {formatDate(shoe.certificationEndDateExp)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <InfoCard label="모델 번호" value={shoe.modelNumber || '-'} />
                <InfoCard label="개발 신발" value={shoe.isDevelopmentShoe ? '예' : '아니오'} />
                <InfoCard
                  label="승인 상태"
                  value={shoe.status === 'APPROVED_UNTIL' ? '기간 한정 승인' : '정식 승인'}
                />
                {shoe.releaseDate && <InfoCard label="출시일" value={formatDate(shoe.releaseDateExp)} />}
              </div>

              {/* Alternative Model Numbers */}
              {shoe.alternativeModelNumbers && (
                <div className="mb-6">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">대체 모델 번호</p>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <code className="text-sm text-zinc-300 font-mono break-all">
                      {shoe.alternativeModelNumbers}
                    </code>
                  </div>
                </div>
              )}

              {/* Disciplines */}
              <div className="mb-6">
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                  사용 가능 종목 ({shoe.disciplines.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {shoe.disciplines.map((disc) => (
                    <span
                      key={disc.name}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm transition-colors duration-200"
                    >
                      {getDisplayName(disc.name)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keyboard hints */}
              <div className="flex items-center gap-4 py-4 border-t border-white/5 text-xs text-zinc-600">
                {(hasPrev || hasNext) && (
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">←</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">→</kbd>
                    <span className="ml-1">이동</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">ESC</kbd>
                  <span className="ml-1">닫기</span>
                </span>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/5">
                <a
                  href="https://certcheck.worldathletics.org/FullList"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors duration-300"
                >
                  <span>World Athletics 공식 페이지에서 확인</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
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
            aria-label="확대 닫기"
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-200">
      <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-white font-medium break-words" title={value}>
        {value}
      </p>
    </div>
  );
}
