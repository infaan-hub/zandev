import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function FreeTrial() {
  return (
    <PageLayout title="">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 250px)' }}>
        <div className="w-full max-w-[700px] text-center">
          <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
            <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            14-day free trial
          </div>

          <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
            Start building with<br />
            <span className="text-[#858585]">production-ready designs.</span>
          </h1>

          <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
            No credit card required. Get instant access to 2,400+ designs,
            source code, and all frameworks. Cancel anytime.
          </p>

          <div className="flex justify-center gap-[12px] mt-[32px]">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-[22px] rounded-[8px] text-[11px] font-semibold bg-white text-black border border-white/[0.1] hover:-translate-y-[2px] transition-transform duration-200"
            >
              Start Free Trial <span>↗</span>
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-[22px] rounded-[8px] text-[11px] font-semibold bg-white/[0.035] text-[#bbb] border border-white/[0.1] hover:-translate-y-[2px] transition-transform duration-200"
            >
              See Features <span>▶</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mt-[60px]">
            {[
              { title: '2,400+ Designs', desc: 'Production-ready templates across all frameworks.' },
              { title: 'Source Code', desc: 'View and copy clean, well-structured code.' },
              { title: 'No Limits', desc: 'Use in personal and commercial projects.' },
            ].map((f) => (
              <div key={f.title} className="p-[22px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008] text-left">
                <div className="text-[14px] font-semibold mb-[6px]">{f.title}</div>
                <div className="text-[#666] text-[10px] leading-[1.6]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
