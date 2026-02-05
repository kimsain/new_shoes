<div align="center">

# DevShoes

**World Athletics 개발 신발 트래커**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000?style=flat-square&logo=vercel)](https://vercel.com/)

World Athletics에서 승인 대기 중인 개발 신발(프로토타입)을 한눈에 확인하세요.

[Live Demo](https://new-shoes.vercel.app) · [Report Bug](https://github.com/kimsain/new_shoes/issues) · [Request Feature](https://github.com/kimsain/new_shoes/issues)

</div>

---

## Features

- **실시간 데이터 동기화** - World Athletics 공식 데이터를 매시간 자동 갱신 (ISR)
- **스마트 필터링** - 브랜드, 종목별 필터 + 신발명/모델번호 검색
- **D-Day 시스템** - 승인 만료일까지 남은 기간을 색상으로 구분
- **반응형 디자인** - 데스크탑 사이드바 / 모바일 바텀시트 레이아웃
- **다크 모드** - 눈이 편안한 다크 테마 기본 적용
- **접근성** - 키보드 네비게이션, ARIA 레이블, 최소 44px 터치 타겟

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Runtime | React 19 |
| Deployment | Vercel |
| Data | World Athletics API (ISR) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 저장소 클론
git clone https://github.com/kimsain/new_shoes.git
cd new_shoes

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # 메인 페이지 (데이터 페칭)
│   ├── layout.tsx        # 루트 레이아웃
│   └── globals.css       # 글로벌 스타일
├── components/
│   ├── Header.tsx        # 헤더 (로고, 동기화 상태)
│   ├── ShoeGrid.tsx      # 신발 그리드 + 필터/검색
│   ├── ShoeCard.tsx      # 신발 카드
│   └── ShoeModal.tsx     # 상세 정보 모달
├── types/
│   └── shoe.ts           # TypeScript 인터페이스
└── utils/
    └── displayNames.ts   # 종목명 축약 유틸리티
```

## Data Flow

```mermaid
graph LR
    A[World Athletics API] -->|Fetch HTML| B[page.tsx]
    B -->|Parse JSON| C[Filter Development Shoes]
    C -->|ISR 1h| D[ShoeGrid]
    D --> E[ShoeCard]
    E -->|Click| F[ShoeModal]
```

1. `page.tsx`에서 World Athletics FullList 페이지 HTML 페칭
2. `litProductsDataRaw` 변수에서 JSON 추출
3. `isDevelopmentShoe === true` 또는 `status === 'APPROVED_UNTIL'` 조건으로 필터링
4. 클라이언트 컴포넌트로 데이터 전달

## Status Colors

승인 만료까지 남은 기간에 따른 색상 구분:

| D-Day | Color | Meaning |
|-------|-------|---------|
| ≤ 0 | 🔴 Red | 만료됨 |
| ≤ 30 | 🟠 Amber | 긴급 |
| ≤ 90 | 🔵 Sky | 주의 |
| > 90 | 🟢 Emerald | 안전 |

## Responsive Layout

**Desktop (≥1024px)**
```
┌─────────┬──────────────────────┐
│ Sidebar │ Search + Sort        │
│ Filter  ├──────────────────────┤
│         │ Shoe Grid            │
└─────────┴──────────────────────┘
```

**Mobile (<1024px)**
```
┌────────────────────────┐
│ Search + Filter + Sort │ (sticky)
├────────────────────────┤
│ Shoe Grid              │
└────────────────────────┘
Filter → Bottom Sheet (85vh max)
```

## Data Source

모든 데이터는 [World Athletics Shoe Checker](https://certcheck.worldathletics.org/FullList)에서 제공됩니다.

> **Note**: 개발 신발(Development Shoes)은 지정된 기간 내에만 사용 가능하며, WAS Events 또는 Olympic Games에서는 사용할 수 없습니다.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is for educational purposes. All shoe data belongs to World Athletics.

---

<div align="center">

Made with ❤️ by [kimsain](https://github.com/kimsain)

</div>
