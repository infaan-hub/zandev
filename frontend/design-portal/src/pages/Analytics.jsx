import PageLayout from '../components/PageLayout'

const metrics = [
  { label: 'Total Designs Viewed', value: '2.4M', change: '+18%', up: true },
  { label: 'Code Exports', value: '180K', change: '+24%', up: true },
  { label: 'Active Users', value: '45K', change: '+12%', up: true },
  { label: 'Avg. Session', value: '4m 32s', change: '+8%', up: true },
]

const topDesigns = [
  { name: 'SaaS Landing Page', views: '48.2K', exports: '12.1K' },
  { name: 'Dashboard Pro', views: '35.8K', exports: '9.4K' },
  { name: 'E-Commerce Kit', views: '28.1K', exports: '7.2K' },
  { name: 'Portfolio Starter', views: '22.6K', exports: '5.8K' },
  { name: 'Blog Template', views: '18.3K', exports: '4.1K' },
]

export default function Analytics() {
  return (
    <PageLayout title="">
      <div className="mb-[40px]">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
          Analytics
        </h1>
        <p className="text-[#666] text-[12px] leading-[1.7] mt-[10px]">
          Platform usage metrics and engagement data.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px] mb-[40px]">
        {metrics.map((m) => (
          <div key={m.label} className="p-[20px] rounded-[14px] border border-white/[0.10] bg-[#080808]">
            <div className="text-[#555] text-[8px] uppercase tracking-[0.08em] mb-[10px]">{m.label}</div>
            <div className="text-[28px] tracking-[-0.05em] font-bold">{m.value}</div>
            <div className="text-[#4ade80] text-[9px] mt-[4px]">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808] mb-[40px]">
        <div className="text-[#6c6c6c] text-[9px] mb-[20px]">TRAFFIC OVERVIEW</div>
        <div className="h-[200px] flex items-end gap-[6px]">
          {[40, 55, 35, 70, 60, 80, 45, 90, 65, 85, 75, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[4px] bg-gradient-to-t from-white/[0.06] to-white/[0.02] border border-white/[0.06]" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-[#555] text-[7px] mt-[10px]">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      {/* Top designs */}
      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
        <div className="text-[#6c6c6c] text-[9px] mb-[20px]">TOP DESIGNS</div>
        <div className="flex flex-col gap-[8px]">
          {topDesigns.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05]">
              <div className="flex items-center gap-[12px]">
                <span className="text-[#555] text-[9px] w-[16px]">{i + 1}</span>
                <span className="text-[12px] font-medium">{d.name}</span>
              </div>
              <div className="flex gap-[20px] text-[10px]">
                <span className="text-[#888]">{d.views} views</span>
                <span className="text-[#aaa] font-semibold">{d.exports} exports</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
