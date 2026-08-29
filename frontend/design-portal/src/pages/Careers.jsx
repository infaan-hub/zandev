import PageLayout from '../components/PageLayout'

const openings = [
  { title: 'Senior Frontend Engineer', team: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Design Engineer', team: 'Design', location: 'Remote', type: 'Full-time' },
  { title: 'Content Writer', team: 'Marketing', location: 'Remote', type: 'Full-time' },
  { title: 'DevRel Lead', team: 'Developer Relations', location: 'Remote', type: 'Full-time' },
]

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
          We&apos;re a small, focused team working on tools that
          help developers ship faster. Remote-first, async-friendly.
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
      <div className="max-w-[920px] mx-auto">
        <h2 className="text-[22px] tracking-[-0.04em] font-semibold mb-[24px]">Open Positions</h2>
        <div className="flex flex-col gap-[8px]">
          {openings.map((o) => (
            <div key={o.title} className="flex flex-col md:flex-row md:items-center justify-between p-[20px] rounded-[14px] border border-white/[0.10] bg-[#080808] gap-[12px]">
              <div>
                <div className="text-[13px] font-semibold">{o.title}</div>
                <div className="text-[#555] text-[10px] mt-[4px]">{o.team} · {o.location} · {o.type}</div>
              </div>
              <div className="px-[16px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-white hover:bg-white/[0.08] transition-colors cursor-pointer whitespace-nowrap">
                Apply
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
