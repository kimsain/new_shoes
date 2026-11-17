'use client';

import { useEffect, useState } from 'react';
import { MOTION } from '@/styles/tokens';
import { prefersReducedMotion } from '@/lib/motion';

interface CountUpProps {
  value: number;
  className?: string;
  /** 애니메이션 시작 전 대기 시간 (ms) */
  delay?: number;
  duration?: number;
}

/**
 * 0부터 value까지 숫자를 올린다.
 * 서버 렌더에는 최종 값을 넣되, JS가 켜져 있으면 숫자가 올라가기 시작할 때까지 숨겨서
 * "89가 보였다가 0으로 돌아가는" 깜빡임을 막는다(globals.css의 .countup-pending).
 */
export default function CountUp({ value, className, delay = 0, duration = MOTION.countUp }: CountUpProps) {
  // null이면 아직 시작 전
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let raf = 0;
    let start = 0;

    const tick = (time: number) => {
      if (reduce || value === 0) {
        setDisplay(value);
        return;
      }
      if (!start) start = time + delay;
      const progress = Math.min(1, Math.max(0, (time - start) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay, duration]);

  return (
    <span className={`tabular-nums ${display === null ? 'countup-pending' : ''} ${className ?? ''}`}>
      {display ?? value}
    </span>
  );
}
