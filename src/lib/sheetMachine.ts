/**
 * 필터 패널(바텀시트/서랍)의 상태 기계. 화면 조작과 무관한 순수 함수라 테스트하기 쉽다.
 *
 *   entering --DRAG_START--> dragging --DRAG_MOVE--> dragging
 *   dragging --DRAG_END (offset < 기준)--> resting   (인라인 transition으로 제자리에 돌아간다)
 *   dragging --DRAG_END (offset >= 기준)--> closing
 *   entering | resting | dragging --CLOSE--> closing
 *   resting --DRAG_START--> dragging
 *
 * entering일 때만 panel-in 애니메이션 클래스를 붙인다. 이 애니메이션은 fill-mode가 both라서
 * 붙어 있으면 인라인 transform(끌기)을 덮어쓰고, 다시 붙이면 등장 애니메이션이 처음부터 다시 돈다.
 * closing은 한 번만 들어가므로 닫기 타이머와 onClose도 한 번만 돈다.
 */

export const SWIPE_DISMISS_THRESHOLD = 100;

export type SheetState =
  | { phase: 'entering' }
  | { phase: 'resting' }
  | { phase: 'dragging'; startY: number; offset: number }
  | { phase: 'closing'; offset: number };

export type SheetEvent =
  | { type: 'DRAG_START'; y: number }
  | { type: 'DRAG_MOVE'; y: number }
  | { type: 'DRAG_END' }
  | { type: 'CLOSE' };

export const initialSheetState: SheetState = { phase: 'entering' };

export function sheetReducer(state: SheetState, event: SheetEvent): SheetState {
  switch (event.type) {
    case 'DRAG_START':
      return state.phase === 'entering' || state.phase === 'resting'
        ? { phase: 'dragging', startY: event.y, offset: 0 }
        : state;
    case 'DRAG_MOVE':
      return state.phase === 'dragging' ? { ...state, offset: Math.max(0, event.y - state.startY) } : state;
    case 'DRAG_END':
      if (state.phase !== 'dragging') return state;
      return state.offset >= SWIPE_DISMISS_THRESHOLD ? { phase: 'closing', offset: state.offset } : { phase: 'resting' };
    case 'CLOSE':
      if (state.phase === 'closing') return state;
      return { phase: 'closing', offset: state.phase === 'dragging' ? state.offset : 0 };
  }
}

/** 손가락을 따라 내려간 거리(px). 끌거나 끌어서 닫는 중이 아니면 0 */
export function getSheetOffset(state: SheetState): number {
  return state.phase === 'dragging' || state.phase === 'closing' ? state.offset : 0;
}
