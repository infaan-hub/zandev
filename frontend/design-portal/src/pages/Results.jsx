import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

export default function Results() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Results
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Real impact,<br />
          <span className="text-[#858585]">real numbers.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          See how ZanDev helps developers and teams
          ship faster and build better products.
        </p>
      </div>

      {/* Big metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] max-w-[920px] mx-auto mb-[40px]">
        {[
          { value: '10x', label: 'Faster than building from scratch' },
          { value: '45K+', label: 'Active developers worldwide' },
          { value: '180K+', label: 'Code exports shipped' },
        ].map((m) => (
          <div key={m.label} className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808] text-center">
            <div className="text-[48px] tracking-[-0.06em] font-bold leading-none">{m.value}</div>
            <div className="text-[#666] text-[10px] mt-[10px]">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Case studies */}
      <div className="max-w-[920px] mx-auto">
        <h2 className="text-[22px] tracking-[-0.04em] font-semibold mb-[24px]">Developer Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          {[
            { name: 'Sarah Chen', role: 'Frontend Developer', quote: 'ZanDev saved me 40+ hours on our latest landing page. Found the design, copied the code, and had it running in production the same day.', metric: '40+ hours saved' },
            { name: 'Marcus Rivera', role: 'Full-Stack Engineer', quote: 'The code quality is outstanding. Clean, well-structured components that I could drop directly into our Next.js project without any modifications.', metric: '0 modifications needed' },
            { name: 'Priya Sharma', role: 'Tech Lead', quote: 'Our team ships 3x faster now. Instead of building UIs from scratch, we browse ZanDev, customize, and ship. It changed our entire workflow.', metric: '3x faster shipping' },
            { name: 'Daniel Reed', role: 'Startup Founder', quote: 'As a solo founder, ZanDev is invaluable. I can prototype production-quality UIs in hours instead of weeks.', metric: 'Weeks → Hours' },
          ].map((s) => (
            <div key={s.name} className="p-[24px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
              <div className="text-[#aaa] text-[18px] font-bold mb-[4px]">{s.metric}</div>
              <p className="text-[#747474] text-[11px] leading-[1.7] mt-[12px] mb-[16px]">&ldquo;{s.quote}&rdquo;</p>
              <div className="flex items-center gap-[10px]">
                <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#333] to-[#101010] border border-[#333]" />
                <div>
                  <div className="text-[10px] font-semibold">{s.name}</div>
                  <div className="text-[#555] text-[8px]">{s.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-[50px]">
        <Link to="/signup" className="inline-flex items-center justify-center gap-2 min-h-[42px] px-[22px] rounded-[8px] text-[11px] font-semibold bg-white text-black hover:-translate-y-[2px] transition-transform duration-200">
          Start Free Trial <span>↗</span>
        </Link>
      </div>
    </PageLayout>
  )
}
