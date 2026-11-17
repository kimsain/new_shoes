export default function Loading() {
  return (
    <main className="min-h-screen bg-canvas" aria-busy="true" aria-label="불러오는 중">
      {/* 헤더 자리 */}
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2.5 px-4 sm:px-6">
        <div className="skeleton h-8 w-8 rounded-[9px]" />
        <div className="skeleton h-4 w-20 rounded-full" />
      </div>

      {/* 히어로 */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:pt-24">
        <div className="skeleton h-8 w-64 rounded-full" />
        <div className="mt-6 space-y-3">
          <div className="skeleton h-[clamp(40px,8.6vw,92px)] w-[min(90%,640px)] rounded-2xl" />
          <div className="skeleton h-[clamp(40px,8.6vw,92px)] w-[min(75%,540px)] rounded-2xl" />
        </div>
        <div className="mt-6 space-y-2">
          <div className="skeleton h-4 w-[min(90%,480px)] rounded-full" />
          <div className="skeleton h-4 w-[min(70%,360px)] rounded-full" />
        </div>
        <div className="mt-8 flex gap-3">
          <div className="skeleton h-12 w-32 rounded-full" />
          <div className="skeleton h-12 w-32 rounded-full" />
        </div>
      </section>

      {/* 목록 */}
      <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6">
        <div className="skeleton h-11 w-full rounded-full" />
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="skeleton m-1.5 aspect-[4/3] rounded-[15px]" />
              <div className="space-y-2.5 px-4 pb-5 pt-3">
                <div className="skeleton h-3 w-1/3 rounded-full" />
                <div className="skeleton h-4 w-4/5 rounded-full" />
                <div className="skeleton mt-5 h-[3px] w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
