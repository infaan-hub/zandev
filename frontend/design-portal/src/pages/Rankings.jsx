import PageLayout from '../components/PageLayout'

const designs = [
  { rank: 1, name: 'SaaS Landing Page', framework: 'React', category: 'Landing', score: 98 },
  { rank: 2, name: 'Dashboard Pro', framework: 'Next.js', category: 'Dashboard', score: 96 },
  { rank: 3, name: 'E-Commerce Kit', framework: 'React', category: 'E-Commerce', score: 95 },
  { rank: 4, name: 'Portfolio Starter', framework: 'Vue', category: 'Portfolio', score: 93 },
  { rank: 5, name: 'Blog Template', framework: 'Astro', category: 'Blog', score: 92 },
  { rank: 6, name: 'Admin Panel', framework: 'React', category: 'Admin', score: 91 },
  { rank: 7, name: 'Mobile App UI', framework: 'React Native', category: 'Mobile', score: 90 },
  { rank: 8, name: 'Pricing Page', framework: 'Next.js', category: 'Landing', score: 89 },
  { rank: 9, name: 'Auth Pages', framework: 'React', category: 'Auth', score: 88 },
  { rank: 10, name: 'Contact Form', framework: 'Svelte', category: 'Form', score: 87 },
]

export default function Rankings() {
  return (
    <PageLayout title="">
      <div className="mb-[40px]">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
          Rankings
        </h1>
        <p className="text-[#666] text-[12px] leading-[1.7] mt-[10px]">
          The most popular and highest-rated designs on ZanDev.
        </p>
      </div>

      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
        <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-[12px] text-[#555] text-[8px] uppercase tracking-[0.08em] mb-[16px] px-[14px]">
          <span>#</span>
          <span>Design</span>
          <span>Framework</span>
          <span>Category</span>
          <span>Score</span>
        </div>
        <div className="flex flex-col gap-[4px]">
          {designs.map((d) => (
            <div key={d.name} className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-[12px] items-center p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05] hover:border-white/[0.12] transition-colors cursor-pointer">
              <span className={`text-[12px] font-bold ${d.rank <= 3 ? 'text-white' : 'text-[#555]'}`}>{d.rank}</span>
              <span className="text-[12px] font-medium">{d.name}</span>
              <span className="text-[10px] text-[#888]">{d.framework}</span>
              <span className="text-[10px] text-[#666]">{d.category}</span>
              <span className="text-[12px] font-semibold text-right">{d.score}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
