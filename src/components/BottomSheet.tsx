'use client';

import { useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

const CLOSE_DURATION = 250;
const SWIPE_DISMISS_THRESHOLD = 100;

export default function BottomSheet({ isOpen, onClose, title, footer, children }: BottomSheetProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setDragY(0);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, CLOSE_DURATION);
  }, [onClose]);

  // Touch handlers for swipe-to-dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    currentY.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.touches[0].clientY - startY.current;
    // Only allow dragging downward
    const clampedY = Math.max(0, deltaY);
    currentY.current = clampedY;
    setDragY(clampedY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (currentY.current >= SWIPE_DISMISS_THRESHOLD) {
      // Dismiss
      handleClose();
    } else {
      // Spring back
      setDragY(0);
    }
  }, [handleClose]);

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

  // Reset drag state when opening
  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      isDragging.current = false;
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const sheetStyle = dragY > 0 && !isClosing
    ? { transform: `translateY(${dragY}px)`, transition: 'none' }
    : undefined;

  const springBackStyle = !isDragging.current && dragY === 0 && !isClosing
    ? { transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }
    : undefined;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${
          isClosing ? 'animate-fade-out' : 'animate-in fade-in duration-200'
        }`}
        style={dragY > 0 ? { opacity: Math.max(0.3, 1 - dragY / 400) } : undefined}
        onClick={handleClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 bg-[#0a0a0a] rounded-t-3xl border-t border-white/[0.06] max-h-[85vh] flex flex-col ${
          isClosing ? 'animate-slide-out-bottom' : dragY > 0 ? '' : 'animate-in slide-in-from-bottom duration-300'
        }`}
        style={{ ...sheetStyle, ...springBackStyle }}
      >
        {/* Drag Handle - swipe target */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-sm">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
