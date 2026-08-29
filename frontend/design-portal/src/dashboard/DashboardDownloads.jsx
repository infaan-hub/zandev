import { Download, ExternalLink, Search, ArrowUpDown, Calendar, FileCode2, Heart, Trash2, Copy, FolderOpen } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useDashboard } from './DashboardContext'
import { Link } from 'react-router-dom'

export default function DashboardDownloads() {
  const { downloads, toggleFavorite, deleteDownload, exportDownload, projects, addToProject, isLight } = useDashboard()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [showAddToProject, setShowAddToProject] = useState(null)

  const c = {
    card: isLight ? 'bg-white border-black/[0.06]' : 'bg-[#080808] border-white/[0.10]',
    muted: isLight ? 'text-[#888]' : 'text-[#6c6c6c]',
    subtle: isLight ? 'text-[#666]' : 'text-[#555]',
    body: isLight ? 'text-[#333]' : 'text-[#888]',
    text: isLight ? 'text-[#1a1a1a]' : 'text-white',
    border: isLight ? 'border-black/[0.06]' : 'border-white/[0.06]',
    row: isLight ? 'bg-black/[0.02] border-black/[0.04] hover:bg-black/[0.04]' : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]',
    input: isLight ? 'bg-black/[0.03] border-black/[0.06] text-[#1a1a1a] placeholder:text-[#999] focus:border-black/[0.15]' : 'bg-white/[0.025] border-white/[0.06] text-white placeholder:text-[#555] focus:border-white/[0.2]',
    btn: isLight ? 'bg-black/[0.04] text-[#555] border-black/[0.08] hover:text-[#1a1a1a] hover:bg-black/[0.06]' : 'bg-white/[0.03] text-[#888] border-white/[0.08] hover:text-white hover:bg-white/[0.06]',
    tag: isLight ? 'bg-black/[0.04] border-black/[0.06] text-[#333]' : 'bg-white/[0.04] border-white/[0.06] text-[#aaa]',
    menu: isLight ? 'bg-white border-black/[0.1] shadow-xl' : 'bg-[#1a1a1a] border-white/[0.1] shadow-xl',
    menuHover: isLight ? 'hover:bg-black/[0.04] hover:text-[#1a1a1a]' : 'hover:bg-white/[0.06] hover:text-white',
  }

  const frameworks = ['All', ...new Set(downloads.map(d => d.framework))]

  const filtered = useMemo(() => {
    let result = downloads
    if (filter !== 'All') result = result.filter(d => d.framework === filter)
    if (search) result = result.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.framework.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
    )
    result.sort((a, b) => {
      if (sortKey === 'date') return sortDir === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
      if (sortKey === 'name') return sortDir === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
      if (sortKey === 'exports') return sortDir === 'desc' ? b.exports - a.exports : a.exports - b.exports
      return 0
    })
    return result
  }, [downloads, filter, search, sortKey, sortDir])

  const totalSize = filtered.reduce((acc, d) => acc + parseInt(d.size), 0)
  const totalExports = filtered.reduce((acc, d) => acc + d.exports, 0)

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <div>
      <div className="mb-[32px]">
        <h1 className={`${c.text} text-[clamp(28px,4vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold`}>Downloads</h1>
        <p className={`${c.body} text-[12px] leading-[1.7] mt-[8px]`}>All components you&apos;ve exported to your projects.</p>
      </div>

      <div className="grid grid-cols-3 gap-[12px] mb-[24px]">
        {[
          { label: 'Total Components', value: filtered.length },
          { label: 'Total Size', value: `${totalSize} KB` },
          { label: 'Total Exports', value: totalExports },
        ].map((s) => (
          <div key={s.label} className={`p-[16px] rounded-[12px] border ${c.card}`}>
            <div className={`${c.subtle} text-[8px] uppercase tracking-[0.08em] mb-[6px]`}>{s.label}</div>
            <div className={`${c.text} text-[22px] font-bold`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[12px] mb-[24px]">
        <div className={`flex items-center gap-[10px] p-[10px] rounded-[10px] border flex-1 w-full sm:w-auto ${c.input}`}>
          <Search size={14} className={c.subtle} />
          <input
            type="text"
            placeholder="Search by name, framework, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-[11px] outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-[6px] flex-wrap">
          {frameworks.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-[12px] py-[6px] rounded-[8px] text-[10px] font-medium border transition-colors ${
                filter === f ? 'bg-white text-black border-white' : c.btn
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-[24px] rounded-[18px] border ${c.card}`}>
        <div className={`hidden md:grid grid-cols-[1fr_90px_90px_70px_70px_100px] gap-[12px] px-[14px] py-[10px] text-[8px] uppercase tracking-[0.08em] border-b mb-[8px] ${c.subtle} ${c.border}`}>
          <button onClick={() => toggleSort('name')} className={`flex items-center gap-[4px] hover:${c.text} transition-colors text-left`}>
            Component <ArrowUpDown size={10} />
          </button>
          <button onClick={() => toggleSort('date')} className={`flex items-center gap-[4px] hover:${c.text} transition-colors text-left`}>
            Date <ArrowUpDown size={10} />
          </button>
          <span>Category</span>
          <span>Size</span>
          <button onClick={() => toggleSort('exports')} className={`flex items-center gap-[4px] hover:${c.text} transition-colors text-left`}>
            Exports <ArrowUpDown size={10} />
          </button>
          <span>Actions</span>
        </div>

        <div className="flex flex-col gap-[4px]">
          {filtered.map((d) => (
            <div key={d.id} className={`group p-[12px] rounded-[10px] border transition-colors ${c.row}`}>
              <div className="flex items-center justify-between md:grid md:grid-cols-[1fr_90px_90px_70px_70px_100px] md:gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <div className={`w-[32px] h-[32px] rounded-[8px] border grid place-items-center shrink-0 ${isLight ? 'bg-black/[0.03] border-black/[0.06]' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                    <FileCode2 size={14} className={c.body} />
                  </div>
                  <div>
                    <div className={`text-[11px] font-medium ${c.text}`}>{d.name}</div>
                    <div className={`text-[9px] ${c.body}`}>{d.framework} · v{d.version}</div>
                  </div>
                </div>
                <div className={`hidden md:flex items-center gap-[6px] text-[9px] ${c.body}`}>
                  <Calendar size={10} />
                  {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <span className={`hidden md:inline text-[10px] px-[8px] py-[3px] rounded-full border w-fit ${c.tag}`}>{d.category}</span>
                <span className={`hidden md:inline text-[10px] ${c.body}`}>{d.size}</span>
                <span className={`hidden md:inline text-[10px] font-medium ${c.text}`}>{d.exports}</span>
                <div className="flex items-center gap-[6px] justify-end md:justify-start">
                  <button onClick={() => toggleFavorite(d.id)} className={`${c.subtle} hover:text-[#f472b6] transition-colors p-[4px]`} title={d.favorited ? 'Remove from favorites' : 'Add to favorites'}>
                    <Heart size={13} fill={d.favorited ? '#f472b6' : 'none'} className={d.favorited ? 'text-[#f472b6]' : ''} />
                  </button>
                  <div className="relative">
                    <button onClick={() => setShowAddToProject(showAddToProject === d.id ? null : d.id)} className={`${c.subtle} hover:${c.text} transition-colors p-[4px]`} title="Add to project">
                      <Copy size={13} />
                    </button>
                    {showAddToProject === d.id && (
                      <div className={`absolute right-0 top-[28px] z-20 w-[180px] p-[4px] rounded-[10px] border ${c.menu}`}>
                        <div className={`${c.subtle} text-[8px] uppercase px-[10px] py-[4px] mb-[2px]`}>Add to project</div>
                        {projects.map((p) => (
                          <button key={p.id} onClick={() => { addToProject(p.id, d.id); setShowAddToProject(null) }} className={`flex items-center gap-[8px] w-full px-[10px] py-[7px] rounded-[6px] text-[10px] transition-colors text-left ${c.menuHover}`}>
                            <FolderOpen size={11} />
                            {p.name}
                          </button>
                        ))}
                        {projects.length === 0 && <div className={`px-[10px] py-[7px] text-[10px] ${c.subtle}`}>No projects yet</div>}
                      </div>
                    )}
                  </div>
                  <button onClick={() => exportDownload(d)} className={`${c.subtle} hover:${c.text} transition-colors p-[4px]`} title="Export component">
                    <ExternalLink size={13} />
                  </button>
                  <button onClick={() => deleteDownload(d.id)} className={`${c.subtle} hover:text-[#ef4444] transition-colors p-[4px]`} title="Remove download">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-[40px]">
            <div className={`${c.subtle} text-[11px] mb-[8px]`}>No downloads found</div>
            <Link to="/tools" className={`${c.body} text-[10px] hover:${c.text} transition-colors`}>Browse designs →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
