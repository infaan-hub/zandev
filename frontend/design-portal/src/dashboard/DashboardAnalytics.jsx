import { TrendingUp, Download, Eye, Code2, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useDashboard } from './DashboardContext'

export default function DashboardAnalytics() {
  const { downloads, isLight } = useDashboard()
  const [timeRange, setTimeRange] = useState('7d')

  const c = {
    card: isLight ? 'bg-white border-black/[0.06]' : 'bg-[#080808] border-white/[0.10]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    row: isLight ? 'bg-black/[0.02] border-black/[0.04]' : 'bg-white/[0.025] border-white/[0.05]',
    bar: isLight ? 'bg-black/[0.05]' : 'bg-white/[0.05]',
    tooltip: isLight ? 'bg-white border-black/[0.1] text-[#1a1a1a]' : 'bg-[#1a1a1a] border-white/[0.1] text-white',
  }

  const metrics = useMemo(() => {
    const totalDownloads = downloads.length
    const totalExports = downloads.reduce((a, d) => a + d.exports, 0)
    const totalViews = downloads.reduce((a, d) => a + Math.floor(d.exports * 6.5), 0)
    const frameworks = [...new Set(downloads.map(d => d.framework))].length
    return [
      { label: 'Total Components', value: totalDownloads.toString(), change: '+12.4%', up: true, icon: Download },
      { label: 'Total Views', value: totalViews.toLocaleString(), change: '+24.1%', up: true, icon: Eye },
      { label: 'Code Exports', value: totalExports.toString(), change: '+18.7%', up: true, icon: Code2 },
      { label: 'Frameworks Used', value: frameworks.toString(), change: '+2', up: true, icon: Clock },
    ]
  }, [downloads])

  const topDesigns = useMemo(() => {
    return [...downloads].sort((a, b) => b.exports - a.exports).slice(0, 5).map(d => ({
      ...d, views: Math.floor(d.exports * 6.5), trend: `+${Math.floor(Math.random() * 20 + 5)}%`,
    }))
  }, [downloads])

  const categoryBreakdown = useMemo(() => {
    const cats = {}
    downloads.forEach(d => { cats[d.category] = (cats[d.category] || 0) + 1 })
    return Object.entries(cats).map(([name, count]) => ({ name, count, percentage: Math.round((count / downloads.length) * 100) })).sort((a, b) => b.count - a.count)
  }, [downloads])

  const frameworkBreakdown = useMemo(() => {
    const fws = {}
    downloads.forEach(d => { fws[d.framework] = (fws[d.framework] || 0) + 1 })
    return Object.entries(fws).map(([name, count]) => ({ name, count, percentage: Math.round((count / downloads.length) * 100) })).sort((a, b) => b.count - a.count)
  }, [downloads])

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const base = downloads.length
    return days.map((day) => ({
      day, downloads: Math.floor(base * (0.5 + Math.random() * 1.5)), views: Math.floor(base * (3 + Math.random() * 5)), exports: Math.floor(base * (0.3 + Math.random() * 0.8)),
    }))
  }, [downloads])

  const maxViews = Math.max(...weeklyData.map(d => d.views), 1)
  const totalDownloads = weeklyData.reduce((a, d) => a + d.downloads, 0)
  const totalViews = weeklyData.reduce((a, d) => a + d.views, 0)
  const totalExports = weeklyData.reduce((a, d) => a + d.exports, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className={`${c.text} text-[clamp(28px,4vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold`}>Analytics</h1>
          <p className={`${c.body} text-[12px] leading-[1.7] mt-[8px]`}>Your usage statistics and performance trends.</p>
        </div>
        <div className="flex items-center gap-[6px]">
          {['7d', '30d', '90d'].map((r) => (
            <button key={r} onClick={() => setTimeRange(r)} className={`px-[12px] py-[6px] rounded-[8px] text-[10px] font-medium border transition-colors ${timeRange === r ? 'bg-white text-black border-white' : isLight ? 'bg-black/[0.04] text-[#666] border-black/[0.08] hover:text-[#1a1a1a]' : 'bg-white/[0.03] text-[#888] border-white/[0.08] hover:text-white'}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] mb-[32px]">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className={`p-[20px] rounded-[14px] border ${c.card}`}>
              <div className="flex items-center justify-between mb-[12px]">
                <div className={`${c.subtle} text-[8px] uppercase tracking-[0.08em]`}>{m.label}</div>
                <Icon size={14} className={c.subtle} />
              </div>
              <div className={`${c.text} text-[28px] tracking-[-0.05em] font-bold`}>{m.value}</div>
              <div className="flex items-center gap-[4px] text-[9px] mt-[4px]">
                {m.up ? <ArrowUpRight size={10} className="text-[#4ade80]" /> : <ArrowDownRight size={10} className="text-[#ef4444]" />}
                <span className="text-[#4ade80]">{m.change}</span>
                <span className={c.subtle}>vs last period</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.35fr] gap-[12px] mb-[32px]">
        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className="flex items-center justify-between mb-[20px]">
            <div className={`${c.muted} text-[9px]`}>WEEKLY ACTIVITY</div>
            <div className={`flex items-center gap-[14px] text-[9px]`}>
              <div className="flex items-center gap-[6px]"><div className="w-[8px] h-[8px] rounded-[2px]" style={{ background: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)' }} /><span className={c.body}>Views</span></div>
              <div className="flex items-center gap-[6px]"><div className="w-[8px] h-[8px] rounded-[2px] bg-[#4ade80]/40" /><span className={c.body}>Downloads</span></div>
              <div className="flex items-center gap-[6px]"><div className="w-[8px] h-[8px] rounded-[2px] bg-[#60a5fa]/40" /><span className={c.body}>Exports</span></div>
            </div>
          </div>
          <div className="h-[220px] flex items-end gap-[10px]">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-[4px] group">
                <div className="w-full flex gap-[2px] items-end" style={{ height: '180px' }}>
                  <div className="flex-1 rounded-t-[3px] transition-colors relative" style={{ height: `${(d.views / maxViews) * 100}%`, background: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)' }}>
                    <div className={`absolute -top-[24px] left-1/2 -translate-x-1/2 text-[8px] px-[4px] py-[2px] rounded-[3px] border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${c.tooltip}`}>{d.views} views</div>
                  </div>
                  <div className="flex-1 rounded-t-[3px] bg-[#4ade80]/40 hover:bg-[#4ade80]/60 transition-colors" style={{ height: `${(d.downloads / maxViews) * 100}%` }} />
                  <div className="flex-1 rounded-t-[3px] bg-[#60a5fa]/40 hover:bg-[#60a5fa]/60 transition-colors" style={{ height: `${(d.exports / maxViews) * 100}%` }} />
                </div>
                <span className={`${c.subtle} text-[8px]`}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className={`grid grid-cols-3 gap-[12px] mt-[16px] pt-[16px] border-t ${c.border}`}>
            <div className="text-center"><div className={`${c.text} text-[18px] font-bold`}>{totalViews.toLocaleString()}</div><div className={`${c.subtle} text-[8px] uppercase`}>Total Views</div></div>
            <div className="text-center"><div className={`${c.text} text-[18px] font-bold`}>{totalDownloads}</div><div className={`${c.subtle} text-[8px] uppercase`}>Downloads</div></div>
            <div className="text-center"><div className={`${c.text} text-[18px] font-bold`}>{totalExports}</div><div className={`${c.subtle} text-[8px] uppercase`}>Exports</div></div>
          </div>
        </div>

        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className={`${c.muted} text-[9px] mb-[20px]`}>TOP DESIGNS</div>
          <div className="flex flex-col gap-[8px]">
            {topDesigns.map((d, i) => (
              <div key={d.id} className={`p-[12px] rounded-[10px] border ${c.row}`}>
                <div className="flex items-center gap-[10px] mb-[6px]">
                  <span className={`${c.subtle} text-[9px] w-[14px]`}>{i + 1}</span>
                  <div className="flex-1">
                    <div className={`text-[11px] font-medium ${c.text}`}>{d.name}</div>
                    <div className={`${c.body} text-[8px]`}>{d.framework} · {d.category}</div>
                  </div>
                  <span className="text-[#4ade80] text-[9px]">{d.trend}</span>
                </div>
                <div className={`flex gap-[14px] text-[9px] pl-[24px]`}>
                  <span className={c.body}>{d.views.toLocaleString()} views</span>
                  <span className={`font-semibold ${c.text}`}>{d.exports} exports</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_0.5fr] gap-[12px]">
        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className={`${c.muted} text-[9px] mb-[20px]`}>CATEGORY BREAKDOWN</div>
          <div className="flex flex-col gap-[10px]">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-[10px] mb-[6px]">
                  <span className={`font-medium ${c.text}`}>{cat.name}</span>
                  <span className={c.body}>{cat.count} designs · {cat.percentage}%</span>
                </div>
                <div className={`h-[4px] rounded-full ${c.bar}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#60a5fa] transition-all" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className={`${c.muted} text-[9px] mb-[20px]`}>FRAMEWORK USAGE</div>
          <div className="flex flex-col gap-[10px]">
            {frameworkBreakdown.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-[10px] mb-[6px]">
                  <span className={`font-medium ${c.text}`}>{f.name}</span>
                  <span className={c.body}>{f.count} downloads · {f.percentage}%</span>
                </div>
                <div className={`h-[4px] rounded-full ${c.bar}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#f472b6] to-[#a78bfa] transition-all" style={{ width: `${f.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
