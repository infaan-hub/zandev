import { Link } from 'react-router-dom'
import { useDashboard } from './DashboardContext'
import { Download, FolderOpen, Code2, TrendingUp, ArrowUpRight, Zap, ExternalLink, Heart } from 'lucide-react'

export default function DashboardOverview() {
  const { downloads, projects, exportDownload, toggleFavorite, isLight } = useDashboard()

  const totalDownloads = downloads.length
  const totalExports = downloads.reduce((a, d) => a + d.exports, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const recentDownloads = downloads.slice(0, 5)

  const c = {
    card: isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.1]' : 'bg-[#080808] border-white/[0.10] hover:bg-white/[0.03]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    row: isLight ? 'bg-black/[0.02] border-black/[0.04] hover:bg-black/[0.04]' : 'bg-white/[0.025] border-white/[0.05] hover:bg-white/[0.04]',
    bar: isLight ? 'bg-black/[0.05]' : 'bg-white/[0.05]',
    barFill: isLight ? 'bg-gradient-to-t from-black/[0.08] to-black/[0.02]' : 'bg-gradient-to-t from-white/[0.08] to-white/[0.02]',
    barBorder: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    barHover: isLight ? 'hover:from-[#4ade80]/20 hover:to-[#4ade80]/5 hover:border-[#4ade80]/20' : 'hover:from-[#4ade80]/30 hover:to-[#4ade80]/10 hover:border-[#4ade80]/20',
    tooltip: isLight ? 'bg-white border-black/[0.1] text-[#1a1a1a]' : 'bg-[#1a1a1a] border-white/[0.1] text-white',
    quickCard: isLight ? 'bg-white border-black/[0.06] hover:bg-black/[0.02]' : 'bg-[#080808] border-white/[0.10] hover:bg-white/[0.035]',
    quickIcon: isLight ? 'bg-black/[0.04] border-black/[0.06]' : 'bg-white/[0.05] border-white/[0.08]',
  }

  const monthlyUsage = [120, 180, 145, 210, 195, 240, 220, 280, 260, 310, 290, downloads.length * 28]
  const maxUsage = Math.max(...monthlyUsage)

  const frameworks = [
    { name: 'React', count: downloads.filter(d => d.framework === 'React').length, color: '#61dafb' },
    { name: 'Next.js', count: downloads.filter(d => d.framework === 'Next.js').length, color: isLight ? '#111' : '#fff' },
    { name: 'Vue', count: downloads.filter(d => d.framework === 'Vue').length, color: '#42b883' },
    { name: 'Svelte', count: downloads.filter(d => d.framework === 'Svelte').length, color: '#ff3e00' },
    { name: 'Astro', count: downloads.filter(d => d.framework === 'Astro').length, color: '#ff5d01' },
  ]
  const maxFramework = Math.max(...frameworks.map(f => f.count), 1)

  return (
    <div>
      <Link to="/tools" className={`block mb-[32px] p-[28px] rounded-[18px] border transition-all group cursor-pointer ${isLight ? 'border-black/[0.06] bg-gradient-to-br from-black/[0.02] to-transparent hover:from-black/[0.04]' : 'border-white/[0.10] bg-gradient-to-br from-white/[0.045] to-white/[0.012] hover:from-white/[0.06] hover:to-white/[0.02]'}`}>
        <div className={`${c.muted} text-[9px] font-semibold uppercase tracking-[0.15em] mb-[12px]`}>
          Design-to-Code Marketplace
        </div>
        <h1 className={`${c.text} text-[clamp(28px,4vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold mb-[12px]`}>
          Browse. Copy. Ship.
        </h1>
        <p className={`${c.body} text-[12px] leading-[1.7] max-w-[480px] mb-[16px]`}>
          Access 2,400+ production-ready designs. Select any design to view source code and export directly to your project.
        </p>
        <div className="inline-flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] bg-white text-black text-[11px] font-semibold group-hover:-translate-y-[2px] transition-transform duration-200 shadow-sm">
          <Zap size={14} />
          Browse Designs
          <ExternalLink size={12} />
        </div>
      </Link>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] mb-[32px]">
        {[
          { label: 'Total Downloads', value: totalDownloads, sub: `${downloads.filter(d => d.favorited).length} favorited`, href: '/dashboard/downloads', icon: Download },
          { label: 'Active Projects', value: activeProjects, sub: `${projects.length} total`, href: '/dashboard/projects', icon: FolderOpen },
          { label: 'Code Exports', value: totalExports, sub: 'All time', href: null, icon: Code2 },
          { label: 'Plan Usage', value: 'Pro', sub: 'Active subscription', href: '/dashboard/settings', icon: TrendingUp },
        ].map((s) => {
          const Icon = s.icon
          const Wrapper = s.href ? Link : 'div'
          return (
            <Wrapper key={s.label} to={s.href || undefined} className={`p-[20px] rounded-[14px] border transition-colors ${c.card}`}>
              <div className="flex items-center justify-between mb-[12px]">
                <div className={`${c.subtle} text-[8px] uppercase tracking-[0.08em]`}>{s.label}</div>
                <Icon size={14} className={c.subtle} />
              </div>
              <div className={`${c.text} text-[28px] tracking-[-0.05em] font-bold`}>{s.value}</div>
              <div className="text-[#4ade80] text-[9px] mt-[4px]">{s.sub}</div>
            </Wrapper>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-[12px] mb-[32px]">
        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className={`${c.muted} text-[9px] mb-[20px]`}>MONTHLY DOWNLOADS</div>
          <div className="h-[180px] flex items-end gap-[8px]">
            {monthlyUsage.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-[4px] group">
                <div className={`w-full rounded-t-[4px] border transition-all cursor-pointer relative ${c.barFill} ${c.barBorder} ${c.barHover}`} style={{ height: `${(h / maxUsage) * 100}%` }}>
                  <div className={`absolute -top-[24px] left-1/2 -translate-x-1/2 text-[9px] px-[6px] py-[2px] rounded-[4px] border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${c.tooltip}`}>
                    {h} downloads
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`flex justify-between ${c.subtle} text-[7px] mt-[10px]`}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className={`${c.muted} text-[9px] mb-[20px]`}>FRAMEWORKS USED</div>
          <div className="flex flex-col gap-[10px]">
            {frameworks.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-[10px] mb-[6px]">
                  <span className={`font-medium ${c.text}`}>{f.name}</span>
                  <span className={c.body}>{f.count} downloads</span>
                </div>
                <div className={`h-[4px] rounded-full ${c.bar}`}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(f.count / maxFramework) * 100}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-[20px] pt-[16px] border-t ${c.border}`}>
            <div className={`${c.muted} text-[9px] mb-[10px]`}>QUICK STATS</div>
            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between text-[10px]">
                <span className={c.body}>Most used</span>
                <span className={`font-medium ${c.text}`}>{frameworks.sort((a, b) => b.count - a.count)[0]?.name || 'React'}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className={c.body}>Categories</span>
                <span className={`font-medium ${c.text}`}>{[...new Set(downloads.map(d => d.category))].length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className={c.body}>Total size</span>
                <span className={`font-medium ${c.text}`}>{downloads.reduce((a, d) => a + parseInt(d.size), 0)} KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_0.4fr] gap-[12px] mb-[32px]">
        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className="flex items-center justify-between mb-[20px]">
            <div className={`${c.muted} text-[9px]`}>RECENT DOWNLOADS</div>
            <Link to="/dashboard/downloads" className={`${c.body} text-[9px] hover:${c.text} transition-colors`}>View all →</Link>
          </div>
          <div className="flex flex-col gap-[6px]">
            {recentDownloads.map((d) => (
              <div key={d.id} className={`flex items-center justify-between p-[12px] rounded-[10px] border transition-colors ${c.row}`}>
                <div className="flex items-center gap-[12px]">
                  <div className={`w-[32px] h-[32px] rounded-[8px] border grid place-items-center ${c.quickIcon}`}>
                    <Download size={12} className={c.body} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-medium ${c.text}`}>{d.name}</div>
                    <div className={`flex items-center gap-[6px] text-[9px] mt-[2px] ${c.body}`}>
                      <span>{d.framework}</span>
                      <span>·</span>
                      <span>{d.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <button onClick={(e) => { e.preventDefault(); toggleFavorite(d.id) }} className={`${c.subtle} hover:text-[#f472b6] transition-colors`}>
                    <Heart size={13} fill={d.favorited ? '#f472b6' : 'none'} className={d.favorited ? 'text-[#f472b6]' : ''} />
                  </button>
                  <button onClick={(e) => { e.preventDefault(); exportDownload(d) }} className={`${c.subtle} hover:${c.text} transition-colors`}>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          {[
            { label: 'Browse Designs', desc: 'Explore 2,400+ production-ready designs', href: '/tools', icon: Zap },
            { label: 'View Analytics', desc: 'Track your downloads and usage trends', href: '/dashboard/analytics', icon: TrendingUp },
            { label: 'Manage Projects', desc: 'Organize your exported components', href: '/dashboard/projects', icon: FolderOpen },
          ].map((a) => {
            const Icon = a.icon
            return (
              <Link key={a.label} to={a.href} className={`group p-[20px] rounded-[18px] border transition-colors ${c.quickCard}`}>
                <div className="flex items-start justify-between">
                  <div className={`w-[36px] h-[36px] rounded-[10px] border grid place-items-center mb-[12px] ${c.quickIcon}`}>
                    <Icon size={16} className={c.body} />
                  </div>
                  <ArrowUpRight size={14} className={`${c.subtle} group-hover:${c.text} transition-colors`} />
                </div>
                <div className={`text-[12px] font-semibold mb-[4px] ${c.text}`}>{a.label}</div>
                <div className={`${c.body} text-[10px]`}>{a.desc}</div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
