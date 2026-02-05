interface HeroSectionProps {
  stats: {
    total: number;
    brandCount: number;
    disciplineCount: number;
  };
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 px-4 overflow-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 - Indigo (center-top, largest) */}
        <div className="glow-orb glow-orb-1" />
        {/* Orb 2 - Violet (right) */}
        <div className="glow-orb glow-orb-2" />
        {/* Orb 3 - Cyan (left-bottom) */}
        <div className="glow-orb glow-orb-3" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 mb-5 backdrop-blur-sm">
          <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-indigo-300">
            ✦ Development Shoes
          </span>
        </div>

        {/* Title - Two lines */}
        <h1 className="hero-title mb-4">
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-[-0.04em] leading-[1.1]">
            The Future of
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.1] bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Running Shoes
          </span>
        </h1>

        {/* Description */}
        <p className="hero-description text-sm sm:text-base text-zinc-400 mb-6 max-w-xl mx-auto leading-relaxed">
          World Athletics 승인 대기 중인 프로토타입을 실시간으로 추적하세요
        </p>

        {/* Minimal Stats */}
        <div className="hero-stats inline-flex items-center gap-2 text-sm text-zinc-500">
          <span className="text-white font-semibold tabular-nums">{stats.total}</span>
          <span>shoes</span>
          <span className="text-zinc-600">·</span>
          <span className="text-white font-semibold tabular-nums">{stats.brandCount}</span>
          <span>brands</span>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
