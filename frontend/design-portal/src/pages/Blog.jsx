import PageLayout from '../components/PageLayout'

const posts = [
  { title: 'How We Built a 2,400+ Design Library', date: 'Jan 15, 2026', category: 'Engineering', excerpt: 'A deep dive into our design system, component architecture, and the tools we use to maintain consistency across thousands of templates.' },
  { title: 'The State of Design-to-Code in 2026', date: 'Jan 8, 2026', category: 'Industry', excerpt: 'From Figma plugins to AI-powered code generation, the design-to-code landscape is evolving fast. Here\'s where we see it heading.' },
  { title: '5 Tips for Better Component Architecture', date: 'Dec 20, 2025', category: 'Tutorial', excerpt: 'Clean, maintainable components are the foundation of any great frontend. These patterns will help you build better UIs.' },
  { title: 'Why We Chose Inter as Our Default Font', date: 'Dec 12, 2025', category: 'Design', excerpt: 'Typography matters. Learn why Inter is the perfect font for modern web applications and how to use it effectively.' },
  { title: 'Shipping Faster with Copy-Paste Components', date: 'Dec 5, 2025', category: 'Product', excerpt: 'How our copy-paste workflow helps developers go from idea to production in minutes, not hours.' },
  { title: 'Behind the Scenes: Our Quality Process', date: 'Nov 28, 2025', category: 'Engineering', excerpt: 'Every design goes through a rigorous quality check before it goes live. Here\'s what that process looks like.' },
]

export default function Blog() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Blog
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Latest <span className="text-[#858585]">insights.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[400px] mx-auto">
          Tutorials, release notes, and deep dives on design-to-code workflows from the ZanDev team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] max-w-[1180px] mx-auto">
        {posts.map((p) => (
          <article key={p.title} className="p-[24px] rounded-[18px] border border-white/[0.10] bg-[#080808] hover:border-white/[0.18] transition-colors cursor-pointer">
            <div className="text-[#555] text-[8px] mb-[12px]">{p.category} · {p.date}</div>
            <h3 className="text-[16px] tracking-[-0.03em] font-semibold leading-tight mb-[10px]">{p.title}</h3>
            <p className="text-[#666] text-[10px] leading-[1.7]">{p.excerpt}</p>
            <div role="button" tabIndex={0} className="mt-[16px] text-[9px] text-[#888] font-medium cursor-pointer hover:text-white transition-colors">Read more →</div>
          </article>
        ))}
      </div>
    </PageLayout>
  )
}
