import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from './DashboardContext'
import { api } from '../lib/api'
import { Download, FolderOpen, Code2, TrendingUp, ArrowUpRight, Zap, ExternalLink, Heart, Eye, Star } from 'lucide-react'

export default function DashboardOverview() {
  const { downloads, projects, exportDownload, toggleFavorite, isLight } = useDashboard()
  const [designs, setDesigns] = useState([])
  const [loadingDesigns, setLoadingDesigns] = useState(true)

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoadingDesigns(true)
        const data = await api.getDesigns({ limit: 8, sort: '-score' })
        setDesigns(data?.results || [])
      } catch (err) {
        console.error('Failed to fetch designs:', err)
      } finally {
        setLoadingDesigns(false)
      }
    }
    fetchDesigns()
  }, [])

  const totalDownloads = downloads.length
  const totalExports = downloads.reduce((a, d) => a + (d.exports || 0), 0)
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
    designCard: isLight ? 'bg-white border-black/[0.06] hover:border-black/[0.12]' : 'bg-[#080808] border-white/[0.08] hover:border-white/[0.15]',
    preview: isLight ? 'bg-[#f5f5f5]' : 'bg-[#0a0a0a]',
  }

  const monthlyUsage = [120, 180, 145, 210, 195, 240, 220, 280, 260, 310, 290, downloads.length * 28]
  const maxUsage = Math.max(...monthlyUsage)

  const frameworks = [
    { name: 'React', count: downloads.filter(d => d.framework === 'React').length || designs.filter(d => d.framework === 'React').length, color: '#61dafb' },
    { name: 'Next.js', count: downloads.filter(d => d.framework === 'Next.js').length || designs.filter(d => d.framework === 'Next.js').length, color: isLight ? '#111' : '#fff' },
    { name: 'Vue', count: downloads.filter(d => d.framework === 'Vue').length || designs.filter(d => d.framework === 'Vue').length, color: '#42b883' },
    { name: 'Svelte', count: downloads.filter(d => d.framework === 'Svelte').length || designs.filter(d => d.framework === 'Svelte').length, color: '#ff3e00' },
    { name: 'Astro', count: downloads.filter(d => d.framework === 'Astro').length || designs.filter(d => d.framework === 'Astro').length, color: '#ff5d01' },
  ]
  const maxFramework = Math.max(...frameworks.map(f => f.count), 1)

  return (
    <div>
      {/* Designs Grid - Top Section */}
      <div className="mb-[32px]">
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <h2 className={`${c.text} text-[18px] font-bold tracking-[-0.03em]`}>Browse Designs</h2>
            <p className={`${c.body} text-[11px] mt-[4px]`}>Explore production-ready components</p>
          </div>
          <Link to="/tools" className={`${c.body} text-[10px] hover:${c.text} transition-colors flex items-center gap-1`}>
            View all <ExternalLink size={10} />
          </Link>
        </div>
        
        {loadingDesigns ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`rounded-[14px] border ${c.border} overflow-hidden animate-pulse`}>
                <div className={`h-[140px] ${c.preview}`} />
                <div className="p-[14px]">
                  <div className={`h-[14px] w-[60%] rounded ${c.bar} mb-[8px]`} />
                  <div className={`h-[10px] w-[40%] rounded ${c.bar}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
            {designs.map((design) => (
              <Link
                key={design.id}
                to={`/tools/${design.id}`}
                className={`group rounded-[14px] border overflow-hidden transition-all hover:-translate-y-1 ${c.designCard}`}
              >
                {/* Preview */}
                <div className={`h-[140px] ${c.preview} relative overflow-hidden`}>
                  {design.preview ? (
                    <img 
                      src={design.preview} 
                      alt={design.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-[32px] opacity-20">🎨</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-1 rounded text-[8px] font-medium bg-white/20 text-white backdrop-blur-sm">{design.framework}</span>
                    <span className="px-2 py-1 rounded text-[8px] font-medium bg-white/20 text-white backdrop-blur-sm">{design.category}</span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-[14px]">
                  <h3 className={`${c.text} text-[12px] font-semibold mb-[4px] truncate`}>{design.name}</h3>
                  <div className={`flex items-center gap-[12px] text-[9px] ${c.body}`}>
                    <span className="flex items-center gap-[4px]">
                      <Eye size={10} />
                      {design.views || 0}
                    </span>
                    <span className="flex items-center gap-[4px]">
                      <Download size={10} />
                      {design.exports || 0}
                    </span>
                    <span className="flex items-center gap-[4px]">
                      <Star size={10} />
                      {design.score || 0}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
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

      {/* Charts Row */}
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
                <span className={`font-medium ${c.text}`}>{[...new Set([...downloads.map(d => d.category), ...designs.map(d => d.category)])].length}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className={c.body}>Total designs</span>
                <span className={`font-medium ${c.text}`}>{designs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Downloads + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.6fr_0.4fr] gap-[12px] mb-[32px]">
        <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
          <div className="flex items-center justify-between mb-[20px]">
            <div className={`${c.muted} text-[9px]`}>RECENT DOWNLOADS</div>
            <Link to="/dashboard/downloads" className={`${c.body} text-[9px] hover:${c.text} transition-colors`}>View all →</Link>
          </div>
          {recentDownloads.length === 0 ? (
            <div className="text-center py-[40px]">
              <Download size={24} className={`${c.subtle} mx-auto mb-[12px]`} />
              <p className={`${c.body} text-[11px]`}>No downloads yet</p>
              <p className={`${c.subtle} text-[9px] mt-[4px]`}>Browse designs to get started</p>
            </div>
          ) : (
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
          )}
        </div>

        <div className="flex flex-col gap-[12px]">
          {[
            { label: 'Browse Designs', desc: 'Explore production-ready designs', href: '/tools', icon: Zap },
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
