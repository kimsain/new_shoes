import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'certcheck.worldathletics.org',
        pathname: '/OpenDocument/**',
      },
    ],
    // 원본 사진은 문서 ID별로 바뀌지 않으므로 변환 결과를 31일 동안 재사용한다.
    // (원본 응답이 Cache-Control: private 이라 이 값이 캐시 기간이 된다)
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
