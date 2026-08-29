import PageLayout from '../components/PageLayout'
import { useCountUp } from '../lib/useCountUp'

export default function ResultsPage() {
  const designs = useCountUp(2400, 2200, false)
  const exports_ = useCountUp(180, 2000, false)
  const devs = useCountUp(45, 1800, false)
  const frameworks = useCountUp(12, 1500, false)

  return (
    <PageLayout title="">
      <div className="text-center mb-[80px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Traction
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold max-w-[700px] mx-auto">
          Trusted by developers<br />
          <span className="text-[#858585]">worldwide.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          From solo founders to enterprise teams, developers use ZanDev
          to ship production-ready UIs faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-[12px] max-w-[920px] mx-auto mb-[80px]">
        <div ref={designs.ref} className="relative min-h-[360px] border border-white/[0.10] rounded-[18px] bg-[#080808] p-[22px] overflow-hidden">
          <div className="text-[#6c6c6c] text-[9px] mb-[25px]">DEVELOPER GROWTH</div>
          <div className="text-[60px] leading-none tracking-[-0.08em] font-bold">10x</div>
          <div className="text-[#626262] mt-[7px] text-[9px]">
            Faster than building from scratch
          </div>
          <div className="absolute right-[25px] top-[35px] p-[17px_20px] rounded-[12px] bg-gradient-to-br from-[#191919] to-[#080808] border border-white/[0.08] rotate-[7deg] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <strong className="block text-[26px]">{devs.count}K+</strong>
            <small className="text-[#5d5d5d] text-[7px]">ACTIVE DEVELOPERS</small>
          </div>
          <div className="absolute left-[22px] right-[22px] bottom-[25px] h-[100px]">
            <svg width="100%" height="100%" viewBox="0 0 500 100" preserveAspectRatio="none">
              <path d="M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5" fill="none" stroke="#666" strokeWidth="2">
                <animate attributeName="d" dur="3s" repeatCount="indefinite"
                  values="M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5;
                          M0 80 C50 75,70 85,110 70 S170 50,210 62 S270 40,310 50 S380 22,420 32 S470 12,500 8;
                          M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5"
                />
              </path>
              <path d="M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5" fill="none" stroke="#444" strokeWidth="1" opacity="0.4">
                <animate attributeName="d" dur="3s" repeatCount="indefinite"
                  values="M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5;
                          M0 90 C50 85,70 75,110 80 S170 50,210 63 S270 38,310 48 S380 15,420 25 S470 5,500 3;
                          M0 85 C50 80,70 70,110 75 S170 45,210 58 S270 35,310 45 S380 18,420 28 S470 8,500 5"
                />
              </path>
            </svg>
          </div>
        </div>

        <div className="min-h-[360px] border border-white/[0.10] rounded-[18px] bg-[#080808] p-[22px]">
          <div className="text-[#6c6c6c] text-[9px] mb-[25px]">PLATFORM METRICS</div>
          <div className="grid grid-cols-2 gap-[8px]">
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Designs</div>
              <div className="mt-[8px] text-[18px] font-semibold">{designs.count.toLocaleString()}+</div>
            </div>
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Code exports</div>
              <div className="mt-[8px] text-[18px] font-semibold">{exports_.count}K+</div>
            </div>
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Developers</div>
              <div className="mt-[8px] text-[18px] font-semibold">{devs.count}K+</div>
            </div>
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Frameworks</div>
              <div className="mt-[8px] text-[18px] font-semibold">{frameworks.count}+</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
