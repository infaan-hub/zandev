import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex justify-center items-start overflow-hidden" style={{ paddingTop: '150px', paddingBottom: '90px' }}>
      <div className="absolute left-1/2 -translate-x-1/2 -top-[500px] border border-white/[0.06] rounded-full pointer-events-none" style={{ width: '900px', height: '900px' }} />

      <div className="star one hidden md:block" />
      <div className="star two hidden md:block" />
      <div className="star three hidden md:block" />

      <div className="relative z-[2] w-full max-w-[700px] mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Design-to-Code Marketplace
        </div>

        <h1 className="text-[clamp(48px,7vw,88px)] leading-[0.92] tracking-[-0.075em] font-bold max-w-[780px] mx-auto">
          Ship designs as<br />
          <span className="text-[#858585]">production code.</span>
        </h1>

        <p className="max-w-[480px] mx-auto mt-[25px] text-[#858585] text-[13px] leading-[1.7]">
          Browse pixel-perfect designs, view the source code,
          and paste production-ready components directly into
          your project. Free and premium templates.
        </p>

        <div className="flex justify-center gap-[10px] mt-[28px]">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold border border-white/[0.1] bg-white text-black hover:-translate-y-[2px] transition-transform duration-200"
          >
            Start a Free Trial <span>↗</span>
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center justify-center gap-2 min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold border border-white/[0.1] bg-white/[0.035] text-[#bbb] hover:-translate-y-[2px] transition-transform duration-200"
          >
            Browse Designs <span>▶</span>
          </Link>
        </div>

        <div className="mt-[75px] flex justify-center items-center gap-[45px] flex-wrap text-[#555] text-[11px] font-bold">
          {['React', 'Next.js', 'Vue', 'Tailwind', 'TypeScript', 'Svelte'].map((logo) => (
            <span key={logo} className="flex items-center gap-[5px] whitespace-nowrap">
              <span className="w-[10px] h-[10px] rounded-[2px] bg-[#777] opacity-55" />
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
