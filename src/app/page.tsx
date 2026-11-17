import ShoeGrid from '@/components/ShoeGrid';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { ImageOffIcon } from '@/components/icons';
import { fetchDevelopmentShoes } from '@/lib/api';

export default async function Home() {
  const shoes = await fetchDevelopmentShoes();
  const renderedAt = new Date();
  const lastUpdated = renderedAt.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

  return (
    <main className="min-h-screen bg-canvas">
      <Header />
      <HeroSection shoes={shoes} />

      {shoes.length === 0 ? <EmptyDataState /> : <ShoeGrid shoes={shoes} renderedAt={renderedAt.getTime()} />}

      <Footer lastUpdated={lastUpdated} />
      <ScrollToTop />
    </main>
  );
}

// 빌드 중에 원본을 불러오지 못했을 때 (실행 중의 실패는 마지막 정상 페이지가 대신한다)
function EmptyDataState() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-24 pt-10 sm:px-6">
      <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong px-6 py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-control text-fg-3">
          <ImageOffIcon className="h-6 w-6" />
        </span>
        <p className="mt-6 text-[20px] font-bold tracking-[-0.03em] text-fg">데이터를 불러올 수 없습니다</p>
        <p className="mt-2 text-[15px] text-fg-3">잠시 후 다시 시도해 주세요.</p>
      </div>
    </section>
  );
}
