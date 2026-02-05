# UI 전면 리디자인 - Linear/Vercel 스타일

> **작성일**: 2026-02-06
> **목표**: 세계 최고 수준의 UI로 업그레이드
> **스타일**: Linear/Vercel + 스포츠 감성

---

## 1. 디자인 시스템

### 1.1 컬러 시스템

#### 배경 레이어 (깊이감 표현)

| Level | 용도 | 값 |
|-------|------|-----|
| Level 0 | 페이지 배경 | `#000000` |
| Level 1 | 카드 배경 | `#0a0a0a` → `#111111` 그라데이션 |
| Level 2 | 호버 상태 | `#161616` |
| Level 3 | 모달 배경 | `#0d0d0d` + 글로우 테두리 |

#### 악센트 컬러 (Linear 스타일)

| 용도 | 값 |
|------|-----|
| Primary Gradient | `#6366f1` → `#8b5cf6` (인디고 → 바이올렛) |
| Glow | `rgba(99, 102, 241, 0.4)` blur 처리 |
| Text Gradient | `bg-gradient-to-r from-indigo-400 to-violet-400` |

#### 상태 컬러 (유지)

| 상태 | 컬러 |
|------|------|
| Safe (>90일) | Emerald `#10b981` |
| Warning (≤90일) | Sky `#0ea5e9` |
| Urgent (≤30일) | Amber `#f59e0b` |
| Expired (≤0일) | Red `#ef4444` |

### 1.2 타이포그래피

```css
/* Hero 타이틀 */
.hero-title {
  font-size: 72px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

/* 섹션 타이틀 */
.section-title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* 카드 타이틀 */
.card-title {
  font-size: 18px;
  font-weight: 500;
}

/* 본문 */
.body {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

/* 캡션 */
.caption {
  font-size: 12px;
  font-weight: 400;
  color: theme('colors.zinc.500');
}

/* 라벨 */
.label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: theme('colors.zinc.500');
}
```

### 1.3 여백 시스템

| 용도 | 현재 | 새 값 |
|------|------|-------|
| 섹션 간격 | 80px | 120px ~ 160px |
| 카드 내부 패딩 | 16px ~ 24px | 24px ~ 32px |
| 카드 간격 (gap) | 16px | 24px |
| 컨테이너 최대 너비 | 1280px | 1400px |

---

## 2. Hero 섹션

### 2.1 구조

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ◉ ◉ ◉  (애니메이션 글로우 오브 - 배경)          │
│                                                 │
│  ✦ DEVELOPMENT SHOES                           │
│                                                 │
│  The Future of                                  │  ← font-light
│  Running Shoes                                  │  ← gradient text, font-bold
│                                                 │
│  World Athletics 승인 대기 중인                  │
│  프로토타입을 실시간으로 추적하세요               │
│                                                 │
│         42 shoes · 8 brands                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 2.2 글로우 오브 스펙

```css
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: orb-float 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: rgba(99, 102, 241, 0.15); /* 인디고 */
  top: -200px;
  left: 20%;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(139, 92, 246, 0.12); /* 바이올렛 */
  top: 100px;
  right: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: rgba(6, 182, 212, 0.10); /* 시안 */
  bottom: -100px;
  left: 40%;
  animation-delay: -14s;
}

@keyframes orb-float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
```

### 2.3 그라데이션 텍스트

```css
.gradient-text {
  background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. 카드 디자인

### 3.1 구조

```
┌─────────────────────────────────────┐
│                                     │
│         🏃 신발 이미지               │  aspect-ratio: 16/10
│      (호버 시 scale + rotate)       │
│                                     │
│───────── 글로우 라인 ─────────────── │  height: 1px, gradient
│                                     │
│  Nike                          NEW  │
│  AlphaFly 3 Proto                   │  font-size: 20px
│                                     │
│  Road Racing Shoes                  │  color: zinc-500
│                                     │
│  ┌─────────────────────────────┐   │
│  │ D-32                    🟢  │   │
│  │ ━━━━━━━━━━━━━━━━━━░░░░░░░░ │   │  progress bar
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### 3.2 호버 효과

```css
.card {
  background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.2),
    0 20px 40px -20px rgba(0, 0, 0, 0.5),
    0 0 60px -20px rgba(99, 102, 241, 0.4);
}

.card:hover .card-image {
  transform: scale(1.05) rotate(1deg);
}

.card:hover .glow-line {
  opacity: 1;
  background: linear-gradient(90deg,
    transparent,
    rgba(99, 102, 241, 0.6),
    transparent
  );
}
```

### 3.3 프로그레스 바

```css
.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease-out;
}

/* 상태별 색상 */
.progress-bar-fill.safe { background: #10b981; }
.progress-bar-fill.warning { background: #0ea5e9; }
.progress-bar-fill.urgent { background: #f59e0b; }
.progress-bar-fill.expired { background: #ef4444; }
```

---

## 4. 사이드바 필터

### 4.1 구조

```
┌─────────────────────┐
│                     │
│  Filters            │
│                     │
│  Status             │  ← 라벨 (11px, uppercase)
│  ┌─────────────────┐│
│  │ All  │Valid│Exp ││  ← 세그먼트 컨트롤
│  └─────────────────┘│
│                     │
│  Brand              │
│  ┌─────┐ ┌─────┐   │
│  │Nike │ │Adi  │   │  ← 토글 칩 (2열 그리드)
│  └─────┘ └─────┘   │
│  ┌─────┐ ┌─────┐   │
│  │Puma │ │Asics│   │
│  └─────┘ └─────┘   │
│                     │
│  Discipline         │
│  ┌─────────────────┐│
│  │ Select...     ▼ ││  ← 드롭다운
│  └─────────────────┘│
│                     │
│  ─────────────────  │
│                     │
│  ┌─────────────────┐│
│  │  ✕ Clear all   ││
│  └─────────────────┘│
│                     │
└─────────────────────┘
```

### 4.2 토글 칩 스타일

```css
.toggle-chip {
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: theme('colors.zinc.400');
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.toggle-chip:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.toggle-chip.active {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.5);
  color: #a5b4fc;
  box-shadow: 0 0 20px -5px rgba(99, 102, 241, 0.4);
}
```

### 4.3 세그먼트 컨트롤

```css
.segment-control {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 4px;
  gap: 4px;
}

.segment-item {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: theme('colors.zinc.500');
  transition: all 0.2s ease;
}

.segment-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
```

---

## 5. 모달 디자인

### 5.1 구조

```
┌─────────────────────────────────────────────────┐
│  ←  Nike AlphaFly 3 Proto                   ✕  │  ← 상단 네비 바
├─────────────────────────────────────────────────┤
│                                                 │
│              🏃 대형 이미지 (400px)              │
│                                                 │
│─────────────── 글로우 라인 ─────────────────────│
│                                                 │
│     Road Racing Shoes                           │
│                                                 │
│     ┌───────────────────────────────────┐      │
│     │   D-32                       🟢   │      │
│     │   ━━━━━━━━━━━━━━━━━━░░░░░░░░░░░  │      │
│     │   2024.03.15 → 2025.04.17        │      │
│     └───────────────────────────────────┘      │
│                                                 │
│     Details                                     │
│     ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│     │Model    │ │Status   │ │Release  │       │
│     │ABC-123  │ │Approved │ │2024.03  │       │
│     └─────────┘ └─────────┘ └─────────┘       │
│                                                 │
│     Disciplines                                 │
│     ┌──────┐ ┌───────┐ ┌─────┐ ┌──────┐      │
│     │Road  │ │Track  │ │Cross│ │Trail │      │
│     └──────┘ └───────┘ └─────┘ └──────┘      │
│                                                 │
│     ↗ View on World Athletics                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.2 트랜지션

```css
/* 배경 */
.modal-backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(16px);
  animation: backdrop-in 0.2s ease-out;
}

@keyframes backdrop-in {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(16px); }
}

/* 모달 컨테이너 */
.modal-container {
  animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 내부 요소 stagger */
.modal-content > * {
  animation: content-in 0.4s ease-out backwards;
}

.modal-content > *:nth-child(1) { animation-delay: 0.1s; }
.modal-content > *:nth-child(2) { animation-delay: 0.15s; }
.modal-content > *:nth-child(3) { animation-delay: 0.2s; }
.modal-content > *:nth-child(4) { animation-delay: 0.25s; }

@keyframes content-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 6. 마이크로 인터랙션

### 6.1 페이지 로드 시퀀스

```
Timeline:
─────────────────────────────────────────────
0ms     글로우 오브 fade-in (opacity 0→1, 800ms)
200ms   Hero 타이틀 mask reveal (clip-path, 600ms)
400ms   Hero 서브텍스트 fade-up (Y: 20→0, 400ms)
600ms   통계 숫자 count-up (0→42, 800ms, ease-out)
800ms   카드 그리드 stagger (각 50ms 간격, fade-up)
```

### 6.2 스크롤 인터랙션

```javascript
// Hero 패럴랙스
const scrollY = window.scrollY;
orbs.style.transform = `translateY(${scrollY * 0.5}px)`;
heroTitle.style.transform = `translateY(${scrollY * 0.2}px)`;
heroSection.style.opacity = 1 - (scrollY / 500);

// 카드 뷰포트 진입
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
```

### 6.3 글로우 애니메이션

```css
/* 호버 시 테두리 글로우 펄스 */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
  }
}

/* 버튼 클릭 ripple */
@keyframes ripple {
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

---

## 7. 검색 & 커맨드 팔레트

### 7.1 검색바

```css
.search-bar {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px 20px;
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.search-bar .shortcut {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  font-size: 12px;
  color: theme('colors.zinc.500');
}
```

### 7.2 커맨드 팔레트

```
구조:
┌─────────────────────────────────────────┐
│  🔍  Type to search...                  │
├─────────────────────────────────────────┤
│  Recent                    ← 섹션 라벨  │
│  ├─ Nike AlphaFly 3                    │
│  └─ Adidas Adizero Prime              │
│                                         │
│  Quick Filters                          │
│  ├─ → Expiring soon                    │
│  └─ → Nike only                        │
│                                         │
│  Actions                                │
│  └─ ↗ Open World Athletics            │
└─────────────────────────────────────────┘

단축키: ⌘K (Mac) / Ctrl+K (Windows)
```

---

## 8. 푸터

### 8.1 구조

```
┌─────────────────────────────────────────────┐
│                                             │
│  ───────── 글로우 그라데이션 라인 ─────────  │
│                                             │
│              DEVELOPMENT SHOES              │
│                                             │
│     Synced · 42 shoes · Updated 1h ago     │
│                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │ GitHub │  │ Source │  │  API   │       │
│  └────────┘  └────────┘  └────────┘       │
│                                             │
│     Development shoes are prototypes        │
│     awaiting World Athletics approval       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 9. 구현 우선순위

| 순서 | 항목 | 예상 시간 |
|------|------|----------|
| 1 | 디자인 토큰 재구축 (tokens.ts, globals.css) | 2h |
| 2 | Hero 섹션 리디자인 | 2h |
| 3 | 카드 컴포넌트 리디자인 | 3h |
| 4 | 사이드바 필터 리디자인 | 2h |
| 5 | 모달 리디자인 | 3h |
| 6 | 애니메이션 & 인터랙션 | 4h |
| 7 | 검색바 & 커맨드 팔레트 | 3h |
| 8 | 푸터 리디자인 | 1h |
| **총계** | | **~20h** |

---

## 10. 참고 자료

- [Linear](https://linear.app) - 글로우, 그라데이션, 다크 테마
- [Vercel](https://vercel.com) - 카드 레이아웃, 여백
- [Raycast](https://raycast.com) - 커맨드 팔레트
- [Stripe](https://stripe.com) - 마이크로 인터랙션

---

*이 문서는 브레인스토밍 세션을 통해 작성되었습니다.*
