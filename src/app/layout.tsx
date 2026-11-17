import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#0A0B0C',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: "Development Shoes | World Athletics",
  description: "World Athletics 인증 목록에 오른 개발 신발(프로토타입)을 한곳에서 확인하세요",
  keywords: ["running shoes", "prototype", "development shoes", "World Athletics", "러닝화", "개발 신발"],
};

// JS가 켜진 경우에만 스크롤 등장 애니메이션의 시작 상태(숨김)를 적용한다.
const JS_FLAG_SCRIPT = "document.documentElement.classList.add('js')";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
