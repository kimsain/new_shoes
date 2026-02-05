'use client';

import { useEffect, ReactNode } from 'react';
import { BG, BORDER, TEXT, BOTTOMSHEET } from '@/styles/tokens';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, footer, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${BOTTOMSHEET.backdrop} backdrop-blur-sm animate-in fade-in duration-200`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`absolute bottom-0 left-0 right-0 ${BOTTOMSHEET.container} rounded-t-3xl border-t ${BOTTOMSHEET.border} animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col`}>
        {/* Drag Handle */}
        <div className="flex justify-center py-3">
          <div className={`w-10 h-1 rounded-full ${BOTTOMSHEET.handle}`} />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 pb-4 border-b ${BORDER.subtle}`}>
          <h3 className={`text-lg font-semibold ${TEXT.primary}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${TEXT.tertiary} hover:text-white hover:bg-white/[0.06] transition-all`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`p-4 border-t ${BORDER.subtle} ${BOTTOMSHEET.footer} backdrop-blur-sm`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
