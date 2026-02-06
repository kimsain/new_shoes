<div align="center">

# DevShoes

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel)](https://vercel.com/)

World Athletics 승인 대기 중인 개발 신발(프로토타입)을 실시간으로 추적합니다.

[Live Demo](https://new-shoes.vercel.app) · [Report Bug](https://github.com/kimsain/new_shoes/issues)

</div>

---

## 주요 기능

- **실시간 동기화** - World Athletics 데이터를 1시간마다 자동 갱신 (ISR)
- **필터링** - 브랜드, 종목, 유형, 상태별 필터 (데스크톱: 사이드바 / 모바일: 바텀시트)
- **D-Day 시스템** - 인증 만료까지 남은 일수를 색상 코드 + 프로그레스바로 표시
- **검색 & 정렬** - 디바운스 검색, 최신순·만료임박순·이름순 정렬
- **모달 상세보기** - 이미지 줌, 키보드 네비게이션 (←→, ESC)

## 디자인

Linear · Vercel 스타일에서 영감을 받은 다크 UI.

| 요소 | 값 |
|------|-----|
| 배경 | Pure Black `#000000` |
| 표면 | `#0a0a0a` → `#111111` 그라데이션 |
| 액센트 | Indigo `#6366f1` → Violet `#8b5cf6` |

### 애니메이션

- **Hero Beam** - 페이지 로드 시 중앙에서 양옆으로 퍼지는 빛줄기 + blur→sharp 텍스트 등장
- **카드 입장** - 순차적 바운스 (stagger-bounce)
- **카드 호버** - 리프트 + 인디고 글로우
- **모달** - 줌인/아웃 + 콘텐츠 순차 등장 (stagger)
- **배경 오브** - 인디고/바이올렛/시안 부유 애니메이션

### D-Day 상태 색상

| D-Day | 색상 | 상태 |
|-------|------|------|
| ≤ 0 | Red | 만료 |
| ≤ 30 | Amber | 긴급 |
| ≤ 90 | Sky | 주의 |
| > 90 | Emerald | 안전 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 |
| 스타일링 | Tailwind CSS 4 |
| 런타임 | React 19 |
| 배포 | Vercel |
| 데이터 | World Athletics (ISR 1시간) |

## 시작하기

```bash
git clone https://github.com/kimsain/new_shoes.git
cd new_shoes
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인하세요.

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 |
| `npm run lint` | ESLint 검사 |

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx           # 메인 페이지 (Server Component)
│   ├── layout.tsx         # 루트 레이아웃 (viewport-fit: cover)
│   └── globals.css        # 글로벌 스타일 + 애니메이션
├── components/
│   ├── Header.tsx         # 고정 헤더
│   ├── HeroSection.tsx    # 히어로 (글로우 오브 + Activation Beam)
│   ├── Footer.tsx         # 푸터 (링크 + 면책조항)
│   ├── ShoeGrid.tsx       # 그리드 + 필터 (단일 렌더 구조)
│   ├── ShoeCard.tsx       # 카드 (프로그레스바, React.memo)
│   ├── ShoeModal.tsx      # 상세 모달 (이미지 줌, 키보드 네비게이션)
│   ├── SearchBar.tsx      # 검색 + 커스텀 드롭다운 정렬
│   ├── BottomSheet.tsx    # 모바일 필터 바텀시트 (닫기 애니메이션)
│   ├── EmptyState.tsx     # 검색 결과 없음
│   └── filters/           # 필터 컴포넌트 (SidebarFilter, MobileFilter, ActiveFilterBadge)
├── styles/
│   └── tokens.ts          # 디자인 토큰
├── hooks/                 # 커스텀 훅 (useFilters, useSearch)
├── lib/                   # API 유틸리티
├── types/                 # TypeScript 인터페이스
├── utils/                 # 유틸리티 (date, progress, displayNames)
└── constants/             # 상수 (URL, 브랜드)
```

## 반응형 레이아웃

**데스크톱 (≥1024px)**
```
┌─────────┬──────────────────────┐
│ Sidebar │ Search + Sort        │
│ Filter  ├──────────────────────┤
│         │ Shoe Grid            │
└─────────┴──────────────────────┘
```

**모바일 (<1024px)**
```
┌────────────────────────┐
│ Search + Filter + Sort │
├────────────────────────┤
│ Shoe Grid              │
└────────────────────────┘
Filter → Bottom Sheet
```

## 키보드 단축키

| 키 | 동작 |
|----|------|
| `←` `→` | 모달에서 신발 이동 |
| `ESC` | 모달/줌 닫기 |
| `Enter` `Space` | 카드 선택 |

## 접근성

- Focus-visible 링 (모든 인터랙티브 요소)
- 최소 44px 터치 타겟 (WCAG 2.5.5)
- `prefers-reduced-motion` 지원
- ARIA 라벨 (버튼, 모달)
- iOS Safe Area (`viewport-fit: cover` + `env(safe-area-inset-bottom)`)

## 데이터 출처

[World Athletics Shoe Checker](https://certcheck.worldathletics.org/FullList)에서 가져옵니다.

> 개발 신발은 승인 대기 중인 프로토타입입니다. WAS 이벤트 및 올림픽에서는 사용할 수 없습니다.

## 라이선스

이 프로젝트는 교육 목적입니다. 모든 신발 데이터는 World Athletics에 귀속됩니다.

---

<div align="center">

Made with ♥ by [kimsain](https://github.com/kimsain)

</div>
