export default function Loading() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header skeleton spacer */}
      <div className="h-16" />

      {/* Hero Section Skeleton */}
      <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-14 px-4 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge skeleton */}
          <div className="flex justify-center">
            <div className="h-8 lg:h-9 w-44 lg:w-52 rounded-full skeleton" />
          </div>

          {/* Beam line skeleton */}
          <div className="h-px max-w-[260px] lg:max-w-[420px] mx-auto my-4 lg:my-5 skeleton" />

          {/* Description skeleton */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-72 sm:w-96 rounded skeleton" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Main Content Skeleton */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-16">
        <div className="lg:flex lg:gap-6">
          {/* Desktop Sidebar Skeleton */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-20 rounded-2xl border border-white/[0.06] overflow-hidden p-4 space-y-4">
              <div className="h-4 w-12 rounded skeleton" />
              {/* Filter group skeletons */}
              {[1, 2, 3].map((group) => (
                <div key={group} className="space-y-2">
                  <div className="h-3 w-16 rounded skeleton" />
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-8 w-full rounded-lg skeleton" />
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Column */}
          <div className="flex-1 min-w-0">
            {/* Search Bar Skeleton */}
            <div className="hidden lg:block sticky top-16 z-40 py-2 mb-4">
              <div className="rounded-2xl border border-white/[0.06] p-3">
                <div className="h-11 w-full rounded-xl skeleton" />
              </div>
            </div>

            {/* Mobile Search Skeleton */}
            <div className="lg:hidden py-2 mb-4">
              <div className="flex gap-2">
                <div className="flex-1 h-11 rounded-xl skeleton" />
                <div className="w-12 h-11 rounded-xl skeleton" />
              </div>
            </div>

            {/* Results count skeleton */}
            <div className="flex items-center mb-6">
              <div className="h-4 w-20 rounded skeleton" />
            </div>

            {/* Section header skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-5 w-24 rounded skeleton" />
              <div className="h-5 w-10 rounded-full skeleton" />
            </div>

            {/* Card Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-white/[0.06] overflow-hidden"
                >
                  {/* Image area */}
                  <div className="aspect-[16/10] skeleton" />
                  {/* Content area */}
                  <div className="p-4 space-y-3">
                    {/* Brand */}
                    <div className="h-3 w-16 rounded skeleton" />
                    {/* Product name */}
                    <div className="h-5 w-3/4 rounded skeleton" />
                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-16 rounded-full skeleton" />
                      <div className="h-4 w-24 rounded skeleton" />
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 w-full rounded-full skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
