import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      // 리팩터링 안전망 측정 대상: 화면과 무관한 순수 로직
      include: ['src/utils/**', 'src/lib/api.ts', 'src/lib/*Machine.ts', 'src/hooks/useFilters.ts'],
      reporter: ['text'],
      // 목표선: 이 아래로 떨어지면 test:coverage가 실패한다
      thresholds: { lines: 90 },
    },
  },
});
