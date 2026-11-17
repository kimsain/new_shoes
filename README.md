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

- **실시간 동기화**: World Athletics 데이터를 1시간마다 다시 가져옵니다(ISR).
- **필터링**: 브랜드 레일, 인증 상태, 종목, 유형으로 좁힙니다. 데스크톱은 오른쪽 서랍, 모바일은 바텀시트에서 고릅니다.
- **D-Day**: 인증 만료까지 남은 일수와, 각 신발의 실제 인증 기간 대비 남은 비율을 막대로 보여 줍니다.
- **검색과 정렬**: 디바운스 검색(`/` 키로 바로 입력), 최신순, 만료 임박순, 이름순을 지원합니다.
- **상세 화면**: 카드 사진이 상세 화면으로 날아가 커지고, 인증 기간 막대에 오늘 위치를 표시합니다. 사진 확대, 키보드 이동(좌우 방향키, ESC), 모바일 스와이프를 지원합니다.

## 디자인

검은 바탕에 신발 사진을 주인공으로 두고 강조색은 볼트 라임 하나만 씁니다. 다크 뉴트럴 단계와 Pretendard 타이포는 치지직(getdesign.kr), 제품 하나를 어둠 위에 띄우는 방식은 ORYZO AI(styles.refero.design)를 참고했습니다. 자세한 계획은 [docs/plans/2026-11-17-web-redesign.md](docs/plans/2026-11-17-web-redesign.md)에 있습니다.

| 요소 | 값 |
|------|-----|
| 바탕 | `#0A0B0C` 페이지, `#111214` 카드, `#17191B` 떠 있는 면 |
| 강조 | 볼트 라임 `#D4FA3C` |
| 글꼴 | Pretendard Variable |

### 애니메이션

- **히어로**: 제목이 한 줄씩 올라오고, 지표 숫자가 0부터 올라가며, 최신 신발 사진 벽이 3D로 기울어진 채 흐릅니다. 스크롤하면 제목이 올라가며 흐려집니다.
- **카드**: 화면에 들어올 때 순서대로 나타나고, 마우스를 올리면 떠오르며 커서를 따라 빛이 움직입니다.
- **필터 변경**: 카드가 새 자리로 미끄러집니다(View Transitions).
- **상세 열기와 닫기**: 카드 사진이 상세 사진 자리로 이동합니다. 지원하지 않는 브라우저에서는 Fade와 Scale로 열립니다.
- `prefers-reduced-motion`이 켜져 있으면 이동과 크기 변화를 빼고 짧은 Fade만 남깁니다.

### D-Day 상태 색상

| D-Day | 색상 | 상태 |
|-------|------|------|
| ≤ 0 | 회색 | 만료 |
| ≤ 30 | `#FF6A3D` | 30일 이내 |
| ≤ 90 | `#FFB224` | 90일 이내 |
| > 90 | 볼트 라임 | 유효 |

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
│   ├── layout.tsx         # 루트 레이아웃 (Pretendard, viewport-fit: cover)
│   ├── loading.tsx        # 로딩 스켈레톤
│   └── globals.css        # 디자인 토큰(@theme), 애니메이션, View Transitions
├── components/
│   ├── Header.tsx         # 고정 헤더 (모바일에서 아래로 스크롤하면 숨김)
│   ├── HeroSection.tsx    # 제목, 지표, 3D 사진 벽
│   ├── CountUp.tsx        # 숫자 올라가는 애니메이션
│   ├── ShoeGrid.tsx       # 목록: 도구 막대, 브랜드 레일, 그리드, 상세와 필터 연결
│   ├── ShoeCard.tsx       # 카드 (React.memo)
│   ├── ShoeModal.tsx      # 상세 화면 (사진 확대, 키보드 이동, 포커스 가둠)
│   ├── SearchBar.tsx      # 검색
│   ├── StatusSegment.tsx  # 인증 상태 선택
│   ├── SortMenu.tsx       # 정렬 메뉴
│   ├── BrandRail.tsx      # 가로 브랜드 칩
│   ├── EmptyState.tsx     # 검색 결과 없음
│   ├── Footer.tsx         # 푸터
│   ├── ScrollToTop.tsx    # 맨 위로 (스크롤 진행 링)
│   ├── icons.tsx          # 공용 아이콘
│   └── filters/           # FilterPanel (데스크톱 서랍, 모바일 바텀시트)
├── styles/
│   └── tokens.ts          # 상태색 클래스와 모션 시간
├── hooks/                 # 커스텀 훅 (useFilters, useSearch)
├── lib/                   # API, 화면 전환 도우미(motion.ts)
├── types/                 # TypeScript 인터페이스
├── utils/                 # 유틸리티 (date, progress, displayNames)
└── constants/             # 상수 (URL, 브랜드, 이미지 sizes)
```

## 반응형 레이아웃

**데스크톱 (≥1024px)**
```
┌──────────────────────────────────────────┐
│ 검색 │ 인증 상태 │ 정렬 │ 필터            │ (상단 고정)
├──────────────────────────────────────────┤
│ 브랜드 레일                               │
├──────────────────────────────────────────┤
│ 카드 그리드 (3열, 1280px 이상 4열)         │
└──────────────────────────────────────────┘
필터 → 오른쪽 서랍
```

**모바일 (<1024px)**
```
┌────────────────────────┐
│ 검색 │ 정렬 │ 필터      │ (상단 고정)
├────────────────────────┤
│ 브랜드 레일             │
├────────────────────────┤
│ 카드 그리드 (2열)        │
└────────────────────────┘
필터 → 바텀시트, 상세 → 전체 화면
```

## 키보드 단축키

| 키 | 동작 |
|----|------|
| `/` | 검색창으로 이동 |
| `←` `→` | 상세 화면에서 이전, 다음 신발 |
| `ESC` | 상세, 확대, 필터, 정렬 메뉴 닫기 |
| `Enter` `Space` | 카드 열기 |

## 접근성

- Focus-visible 링 (모든 인터랙티브 요소, 카드는 카드 전체에 표시)
- 최소 44px 터치 타겟 (WCAG 2.5.5)
- `prefers-reduced-motion` 지원
- ARIA 라벨 (버튼, 모달), 상세 화면 포커스 가둠과 닫은 뒤 카드로 포커스 복귀
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
