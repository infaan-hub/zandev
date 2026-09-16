import PageLayout from '../components/PageLayout'

export default function Careers() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Careers
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Join the team<br />
          <span className="text-[#858585]">building the future.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          We&apos;re a small, focused team building design-to-code tools for developers. Remote-first, async-friendly.
        </p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] max-w-[920px] mx-auto mb-[60px]">
        {[
          { title: 'Remote First', desc: 'Work from anywhere. We\'re a distributed team across time zones.' },
          { title: 'Competitive Pay', desc: 'Top-of-market compensation with equity options.' },
          { title: 'Learning Budget', desc: '$2,000/year for courses, conferences, and books.' },
        ].map((p) => (
          <div key={p.title} className="p-[22px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
            <div className="text-[14px] font-semibold mb-[6px]">{p.title}</div>
            <div className="text-[#666] text-[10px] leading-[1.6]">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Openings */}
      <div className="max-w-[920px] mx-auto text-center py-[60px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
        <h2 className="text-[22px] tracking-[-0.04em] font-semibold mb-[12px]">Open Positions</h2>
        <p className="text-[#666] text-[12px] mb-[20px]">No open positions at the moment.</p>
        <p className="text-[#555] text-[11px]">We&apos;re always interested in talented people. Send your resume to <a href="mailto:careers@zandeveloper.vercel.app" className="text-white hover:underline">careers@zandeveloper.vercel.app</a></p>
      </div>
    </PageLayout>
  )
}
