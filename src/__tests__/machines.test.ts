import { describe, expect, it } from 'vitest';
import { detailReducer, getDetailId, initialDetailState } from '@/lib/detailMachine';
import { getSheetOffset, initialSheetState, sheetReducer, SWIPE_DISMISS_THRESHOLD } from '@/lib/sheetMachine';

describe('detailReducer', () => {
  it('열고, 좌우로 넘기고, 닫는다', () => {
    let s = detailReducer(initialDetailState, { type: 'OPEN', id: 'a', morph: true });
    expect(s).toEqual({ phase: 'open', id: 'a', direction: null, morph: true });
    s = detailReducer(s, { type: 'NAVIGATE', id: 'b', direction: 'right' });
    // 넘겨도 열 때 정한 등장 방식(morph)은 그대로다. 바뀌면 패널 애니메이션이 다시 돌아 깜빡인다
    expect(s).toEqual({ phase: 'open', id: 'b', direction: 'right', morph: true });
    expect(getDetailId(s)).toBe('b');
    s = detailReducer(s, { type: 'EXIT' });
    expect(s.phase).toBe('exiting');
    expect(getDetailId(s)).toBe('b');
    expect(detailReducer(s, { type: 'CLOSED' })).toEqual({ phase: 'closed' });
  });

  it('열려 있을 때 다시 OPEN이 와도 무시한다', () => {
    const open = detailReducer(initialDetailState, { type: 'OPEN', id: 'a', morph: false });
    expect(detailReducer(open, { type: 'OPEN', id: 'z', morph: true })).toBe(open);
  });

  it('닫히는 중에는 좌우 이동과 두 번째 EXIT를 무시한다', () => {
    const exiting = detailReducer(detailReducer(initialDetailState, { type: 'OPEN', id: 'a', morph: false }), { type: 'EXIT' });
    expect(detailReducer(exiting, { type: 'NAVIGATE', id: 'c', direction: 'left' })).toBe(exiting);
    expect(detailReducer(exiting, { type: 'EXIT' })).toBe(exiting);
  });

  it('닫혀 있을 때 좌우 이동은 무시한다', () => {
    expect(detailReducer(initialDetailState, { type: 'NAVIGATE', id: 'c', direction: 'left' })).toBe(initialDetailState);
    expect(getDetailId(initialDetailState)).toBeNull();
  });
});

describe('sheetReducer', () => {
  const drag = (from: number, to: number) =>
    sheetReducer(sheetReducer(initialSheetState, { type: 'DRAG_START', y: from }), { type: 'DRAG_MOVE', y: to });

  it('끈 거리만큼 내려가고 위로는 올라가지 않는다', () => {
    const s = drag(500, 560);
    expect(s).toEqual({ phase: 'dragging', startY: 500, offset: 60 });
    expect(getSheetOffset(s)).toBe(60);
    expect(sheetReducer(s, { type: 'DRAG_MOVE', y: 400 })).toMatchObject({ offset: 0 });
  });

  it('기준보다 덜 끌면 제자리로 돌아가고, 기준 이상이면 닫는다', () => {
    expect(sheetReducer(drag(500, 500 + SWIPE_DISMISS_THRESHOLD - 1), { type: 'DRAG_END' })).toEqual({ phase: 'resting' });
    const closing = sheetReducer(drag(500, 500 + SWIPE_DISMISS_THRESHOLD), { type: 'DRAG_END' });
    expect(closing).toEqual({ phase: 'closing', offset: SWIPE_DISMISS_THRESHOLD });
  });

  it('닫히는 중에는 CLOSE와 끌기를 무시한다', () => {
    const closing = sheetReducer({ phase: 'resting' }, { type: 'CLOSE' });
    expect(closing).toEqual({ phase: 'closing', offset: 0 });
    expect(sheetReducer(closing, { type: 'CLOSE' })).toBe(closing);
    expect(sheetReducer(closing, { type: 'DRAG_START', y: 1 })).toBe(closing);
    expect(getSheetOffset({ phase: 'resting' })).toBe(0);
  });
});
