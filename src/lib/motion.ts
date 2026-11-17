/**
 * 화면 전환과 움직임 관련 도우미 (클라이언트 전용)
 */

export type TransitionKind = 'open' | 'close' | 'filter';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsViewTransition(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document && !prefersReducedMotion();
}

/**
 * View Transitions로 상태를 바꾼다. 지원하지 않거나 reduced-motion이면 바로 바꾼다.
 * kind는 <html data-vt>로 걸어서 CSS가 전환 종류별로 시간을 다르게 줄 수 있게 한다.
 */
export function runViewTransition(kind: TransitionKind, update: () => void): ViewTransition | null {
  if (!supportsViewTransition()) {
    update();
    return null;
  }

  const root = document.documentElement;
  root.dataset.vt = kind;
  const transition = document.startViewTransition(update);
  // 연달아 누르면 앞의 전환은 건너뛰어지며 ready가 reject된다. 정상 동작이라 조용히 넘긴다.
  transition.ready.catch(() => undefined);
  transition.finished
    .catch(() => undefined)
    .finally(() => {
      if (root.dataset.vt === kind) delete root.dataset.vt;
    });
  return transition;
}

/**
 * 스크롤 등장 애니메이션: 화면에 들어온 요소에 data-revealed를 붙인다.
 * 같은 순간에 들어온 요소끼리는 화면 위치 순서대로 60ms씩 늦춘다.
 */
let revealObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver {
  if (revealObserver) return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);

      visible.forEach((entry, i) => {
        const el = entry.target as HTMLElement;
        el.style.setProperty('--reveal-delay', `${Math.min(i, 7) * 60}ms`);
        el.dataset.revealed = 'true';
        revealObserver?.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  );
  return revealObserver;
}

export function observeReveal(el: HTMLElement | null): () => void {
  if (!el) return () => {};
  // 필터 전환 중에 새로 생긴 카드는 View Transition이 등장을 맡는다
  if (document.documentElement.dataset.vt === 'filter' || !('IntersectionObserver' in window)) {
    el.dataset.revealed = 'true';
    return () => {};
  }
  const observer = getRevealObserver();
  observer.observe(el);
  return () => observer.unobserve(el);
}
