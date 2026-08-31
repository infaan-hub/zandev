import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import SEO from '../components/SEO'
import LivePreview from '../tools/LivePreview'
import { api } from '../lib/api'

export default function DesignCompare() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [designs, setDesigns] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)

  const ids = searchParams.get('ids') || ''

  useEffect(() => {
    if (ids) {
      api.getDesigns({ ids }).then(data => setDesigns(data.designs || [])).catch(() => {})
    }
  }, [ids])

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    try {
      const data = await api.getDesigns({ search: q })
      setSearchResults((data.results || []).filter(d => !designs.find(x => x.id === d.id)).slice(0, 5))
    } catch {}
  }

  const addDesign = (d) => {
    const newIds = [...designs.map(x => x.id), d.id].join(',')
    navigate(`/compare?ids=${newIds}`, { replace: true })
    setDesigns([...designs, d])
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const removeDesign = (id) => {
    const newIds = designs.filter(x => x.id !== id).map(x => x.id).join(',')
    navigate(`/compare?ids=${newIds}`, { replace: true })
    setDesigns(designs.filter(x => x.id !== id))
  }

  return (
    <PageLayout title="">
      <SEO title="Compare Designs" description="Compare designs side by side" />
      <div className="max-w-[1400px] mx-auto py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#666] hover:text-white text-xs transition-colors mb-6">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Compare Designs</h1>
          {designs.length < 5 && (
            <button onClick={() => setShowSearch(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold">
              <Plus size={12} /> Add Design
            </button>
          )}
        </div>

        {showSearch && (
          <div className="mb-6 p-4 rounded-xl border border-white/[0.1] bg-[#080808]">
            <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} autoFocus
              className="w-full h-9 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm outline-none placeholder-[#444]"
              placeholder="Search designs to compare..." />
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.map(d => (
                  <button key={d.id} onClick={() => addDesign(d)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#aaa] hover:bg-white/[0.05] hover:text-white transition-colors">
                    {d.name} <span className="text-[#555] text-xs ml-2">{d.framework}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {designs.length === 0 ? (
          <div className="text-center py-32 text-[#444] text-sm">
            <p>No designs to compare. Search and add designs above.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${designs.length === 1 ? 'grid-cols-1 max-w-[600px]' : designs.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {designs.map(d => (
              <div key={d.id} className="rounded-xl border border-white/[0.06] bg-[#080808] overflow-hidden">
                <div className="relative">
                  <button onClick={() => removeDesign(d.id)} className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-[#888] hover:text-white">
                    <X size={12} />
                  </button>
                  <div className="h-[200px] overflow-hidden">
                    {d.has_code ? (
                      <LivePreview html={d.html_code} css={d.css_code} js={d.js_code} className="w-full h-full" title={d.name} />
                    ) : (
                      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center text-[#444] text-xs">{d.name}</div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-1">{d.name}</h3>
                  <div className="flex gap-2 text-xs text-[#666] mb-3">
                    <span>{d.framework}</span>
                    <span>{d.category}</span>
                    <span>Score: {d.score}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-white/[0.03]">
                      <div className="text-xs font-semibold text-white">{d.views || 0}</div>
                      <div className="text-[9px] text-[#555]">Views</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.03]">
                      <div className="text-xs font-semibold text-white">{d.exports || 0}</div>
                      <div className="text-[9px] text-[#555]">Exports</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/[0.03]">
                      <div className="text-xs font-semibold text-white">{d.avg_rating ? d.avg_rating.toFixed(1) : '-'}</div>
                      <div className="text-[9px] text-[#555]">Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
