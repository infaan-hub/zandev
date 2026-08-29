import PageLayout from '../components/PageLayout'

const team = [
  { name: 'Alex Morgan', role: 'Founder & CEO', desc: 'Previously built design tools used by 100K+ developers.' },
  { name: 'Sarah Kim', role: 'Head of Product', desc: 'Former lead designer at a YC-backed startup.' },
  { name: 'Marcus Rivera', role: 'CTO', desc: 'Full-stack engineer with a passion for developer experience.' },
  { name: 'Priya Sharma', role: 'Head of Design', desc: 'Creates the visual systems behind our design library.' },
]

const values = [
  { title: 'Developer First', desc: 'Every feature is built with the developer workflow in mind. Clean code, fast iteration, zero friction.' },
  { title: 'Quality Over Quantity', desc: 'Each design in our library is hand-crafted and production-tested before it goes live.' },
  { title: 'Open & Transparent', desc: 'We believe in building in the open. Our roadmap, pricing, and processes are always visible.' },
  { title: 'Ship Faster', desc: 'Our mission is to eliminate the gap between design and code. Browse, copy, ship.' },
]

export default function About() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[80px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          About Us
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold max-w-[700px] mx-auto">
          We help developers<br />
          <span className="text-[#858585]">ship UIs faster.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          ZanDev was founded to bridge the gap between design and code.
          We build tools that let developers browse, inspect, and copy
          production-ready components.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] max-w-[920px] mx-auto mb-[80px]">
        {values.map((v) => (
          <div key={v.title} className="p-[28px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
            <h3 className="text-[18px] tracking-[-0.03em] font-semibold mb-[8px]">{v.title}</h3>
            <p className="text-[#666] text-[11px] leading-[1.7]">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Team */}
      <div className="text-center mb-[40px]">
        <h2 className="text-[clamp(28px,4vw,48px)] leading-[0.98] tracking-[-0.06em] font-bold">
          The team behind<br />
          <span className="text-[#858585]">ZanDev.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px] max-w-[920px] mx-auto">
        {team.map((m) => (
          <div key={m.name} className="p-[22px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
            <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#333] to-[#101010] border border-[#333] mb-[16px]" />
            <div className="text-[12px] font-semibold mb-[2px]">{m.name}</div>
            <div className="text-[#555] text-[9px] mb-[8px]">{m.role}</div>
            <div className="text-[#666] text-[10px] leading-[1.6]">{m.desc}</div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
