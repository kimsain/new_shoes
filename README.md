# Development Shoes

World Athletics에서 승인 대기 중인 개발 신발(프로토타입)을 보여주는 웹사이트입니다.

## 기능

- World Athletics Shoe Checker에서 개발 신발 데이터를 자동으로 가져옴
- 브랜드별 그룹화 및 필터링
- 신발명, 브랜드, 모델번호로 검색
- 상세 정보 모달 (이미지, 승인 기간, 사용 가능 종목 등)
- 승인 만료일까지 남은 기간 표시 (D-Day)
- 매시간 자동 데이터 갱신 (ISR)

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 배포

Vercel에 자동 배포됩니다. `main` 브랜치에 푸시하면 자동으로 배포가 시작됩니다.

## 데이터 출처

[World Athletics Shoe Checker](https://certcheck.worldathletics.org/FullList)

## 주의사항

개발 신발(Development Shoes)은:
- 지정된 기간 내에만 사용 가능
- WAS Events 또는 Olympic Games에서는 사용 불가
