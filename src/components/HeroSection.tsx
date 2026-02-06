export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-8 lg:pt-28 lg:pb-14 px-4 overflow-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
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
        {/* Badge - responsive sizing */}
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-sm">
          <span className="text-[10px] lg:text-xs font-medium uppercase tracking-[0.15em] text-indigo-300">
            ✦ Development Shoes
          </span>
        </div>

        {/* Activation Beam */}
        <div className="hero-beam" aria-hidden="true" />

        {/* Description */}
        <p className="hero-description text-sm sm:text-base lg:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          World Athletics 승인 대기 중인 프로토타입을 실시간으로 추적하세요
        </p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
