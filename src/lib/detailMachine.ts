/**
 * 상세 화면(ShoeModal)의 상태 기계. 화면 조작과 무관한 순수 함수라 테스트하기 쉽다.
 *
 *   closed --OPEN--> open --NAVIGATE--> open (방향만 바뀜)
 *   open --EXIT--> exiting (View Transition을 못 쓸 때의 CSS 닫힘 애니메이션)
 *   open | exiting --CLOSED--> closed
 *
 * View Transition으로 닫을 때는 브라우저가 애니메이션을 맡으므로 open에서 바로 CLOSED를 보낸다.
 * morph는 카드 사진이 날아가며 열렸는지다. 패널 등장 애니메이션을 열 때 한 번 정하고 닫을 때까지 바꾸지 않는다
 * (도중에 바꾸면 애니메이션이 처음부터 다시 돌아 패널이 한 번 깜빡인다).
 * 허용되지 않은 이벤트는 무시한다: 닫히는 중에 ←/→나 ESC를 눌러도 다른 신발로 바뀌거나 타이머가 겹치지 않는다.
 */

export type NavDirection = 'left' | 'right';

export type DetailState =
  | { phase: 'closed' }
  | { phase: 'open'; id: string; direction: NavDirection | null; morph: boolean }
  | { phase: 'exiting'; id: string; direction: NavDirection | null; morph: boolean };

export type DetailEvent =
  | { type: 'OPEN'; id: string; morph: boolean }
  | { type: 'NAVIGATE'; id: string; direction: NavDirection }
  | { type: 'EXIT' }
  | { type: 'CLOSED' };

export const initialDetailState: DetailState = { phase: 'closed' };

export function detailReducer(state: DetailState, event: DetailEvent): DetailState {
  switch (event.type) {
    case 'OPEN':
      return state.phase === 'closed' ? { phase: 'open', id: event.id, direction: null, morph: event.morph } : state;
    case 'NAVIGATE':
      return state.phase === 'open' ? { ...state, id: event.id, direction: event.direction } : state;
    case 'EXIT':
      return state.phase === 'open' ? { ...state, phase: 'exiting' } : state;
    case 'CLOSED':
      return state.phase === 'closed' ? state : initialDetailState;
  }
}

/** 열려 있거나 닫히는 중인 신발의 id */
export function getDetailId(state: DetailState): string | null {
  return state.phase === 'closed' ? null : state.id;
}
