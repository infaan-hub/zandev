import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative flex justify-center items-center overflow-hidden min-h-screen pt-[72px]">
      <div className="relative z-[2] w-full max-w-[700px] mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-5">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Design-to-Code Platform
        </div>

        <h1 className="text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-0.06em] font-bold max-w-[600px] mx-auto">
          Turn designs into<br />
          <span className="text-[#858585]">working code.</span>
        </h1>

        <p className="max-w-[480px] mx-auto mt-5 text-[#858585] text-[13px] leading-[1.7]">
          Browse production-ready component designs, inspect the source code,
          and export clean implementations for your framework.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <Link
            to="/tools"
            className="inline-flex items-center justify-center gap-2 min-h-[38px] px-5 rounded-lg text-[10px] font-semibold border border-white/[0.1] bg-white text-black hover:-translate-y-[2px] transition-transform duration-200"
          >
            Browse Designs <span>▶</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
