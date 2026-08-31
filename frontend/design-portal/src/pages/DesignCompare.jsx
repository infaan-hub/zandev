import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
      api.getDesigns({ ids }).then(data => setDesigns(data.designs || [])).catch(e => console.error('Failed to compare:', e))
    }
  }, [ids])

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    try {
      const data = await api.getDesigns({ search: q })
      setSearchResults((data.results || []).filter(d => !designs.find(x => x.id === d.id)).slice(0, 5))
    } catch (e) { console.error('Failed to compare:', e) }
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
      <SEO title="Compare Designs" description="Compare two design components side by side. Inspect differences in HTML, CSS, and JavaScript source code." />
      <div className="max-w-[1400px] mx-auto py-[32px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-[8px] text-[#666] hover:text-white text-[10px] transition-colors mb-[24px]">
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center justify-between mb-[24px]">
          <h1 className="text-[24px] font-bold text-white">Compare Designs</h1>
          {designs.length < 5 && (
            <button onClick={() => setShowSearch(true)} className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-white text-black text-[10px] font-semibold">
              <Plus size={12} /> Add Design
            </button>
          )}
        </div>

        {showSearch && (
          <div className="mb-[24px] p-[16px] rounded-[12px] border border-white/[0.1] bg-[#080808]">
            <input type="text" value={searchQuery} onChange={e => handleSearch(e.target.value)} autoFocus
              className="w-full h-[36px] px-[12px] rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-[12px] outline-none placeholder-[#444]"
              placeholder="Search designs to compare..." />
            {searchResults.length > 0 && (
              <div className="mt-[8px] space-y-[4px]">
                {searchResults.map(d => (
                  <button key={d.id} onClick={() => addDesign(d)}
                    className="w-full text-left px-[12px] py-[8px] rounded-[8px] text-[12px] text-[#aaa] hover:bg-white/[0.05] hover:text-white transition-colors">
                    {d.name} <span className="text-[#555] text-[10px] ml-[8px]">{d.framework}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {designs.length === 0 ? (
          <div className="text-center py-[128px] text-[#444] text-[12px]">
            <p>No designs to compare. Search and add designs above.</p>
          </div>
        ) : (
          <div className={`grid gap-[16px] ${designs.length === 1 ? 'grid-cols-1 max-w-[600px]' : designs.length === 2 ? 'grid-cols-1 md:grid-cols-[1fr_1fr]' : 'grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1fr_1fr]'}`}>
            {designs.map(d => (
              <div key={d.id} className="rounded-[12px] border border-white/[0.06] bg-[#080808] overflow-hidden">
                <div className="relative">
                  <button onClick={() => removeDesign(d.id)} className="absolute top-[8px] right-[8px] z-10 w-[24px] h-[24px] rounded-full bg-black/60 flex items-center justify-center text-[#888] hover:text-white">
                    <X size={12} />
                  </button>
                  <div className="h-[200px] overflow-hidden">
                    {d.has_code ? (
                      <LivePreview html={d.html_code} css={d.css_code} js={d.js_code} className="w-full h-full" title={d.name} />
                    ) : (
                      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center text-[#444] text-[10px]">{d.name}</div>
                    )}
                  </div>
                </div>
                <div className="p-[16px]">
                  <h3 className="text-[12px] font-semibold text-white mb-[4px]">{d.name}</h3>
                  <div className="flex gap-[8px] text-[10px] text-[#666] mb-[12px]">
                    <span>{d.framework}</span>
                    <span>{d.category}</span>
                    <span>Score: {d.score}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_1fr_1fr] gap-[8px] text-center">
                    <div className="p-[8px] rounded-[8px] bg-white/[0.03]">
                      <div className="text-[10px] font-semibold text-white">{d.views || 0}</div>
                      <div className="text-[9px] text-[#555]">Views</div>
                    </div>
                    <div className="p-[8px] rounded-[8px] bg-white/[0.03]">
                      <div className="text-[10px] font-semibold text-white">{d.exports || 0}</div>
                      <div className="text-[9px] text-[#555]">Exports</div>
                    </div>
                    <div className="p-[8px] rounded-[8px] bg-white/[0.03]">
                      <div className="text-[10px] font-semibold text-white">{d.avg_rating ? d.avg_rating.toFixed(1) : '-'}</div>
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
