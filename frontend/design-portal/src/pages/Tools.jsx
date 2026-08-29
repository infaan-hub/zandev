import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import { api } from '../lib/api'
import { useFetch } from '../lib/useFetch'
import { Download, Copy, Check, ExternalLink } from 'lucide-react'

const frameworks = ['All', 'React', 'Next.js', 'Vue', 'Astro', 'Svelte', 'React Native']
const categories = ['All', 'Landing', 'Dashboard', 'E-Commerce', 'Portfolio', 'Blog', 'Admin', 'Mobile', 'Auth', 'Form']

const OK_CATEGORY_ICONS = {
  'interactive-elements': '✨',
  'image-gallery': '🖼️',
  'text': '🔤',
  'animation': '🎬',
  'background-animation': '🌊',
  'button': '🔘',
}

const OK_CATEGORY_COLORS = {
  'interactive-elements': 'from-purple-500/30 to-blue-500/30 border-purple-500/40',
  'image-gallery': 'from-pink-500/30 to-orange-500/30 border-pink-500/40',
  'text': 'from-cyan-500/30 to-green-500/30 border-cyan-500/40',
  'animation': 'from-amber-500/30 to-yellow-500/30 border-amber-500/40',
  'background-animation': 'from-blue-500/30 to-indigo-500/30 border-blue-500/40',
  'button': 'from-red-500/30 to-pink-500/30 border-red-500/40',
}

export default function Tools() {
  const [framework, setFramework] = useState('All')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('all')

  const params = {}
  if (framework !== 'All') params.framework = framework
  if (category !== 'All') params.category = category
  if (search) params.search = search

  const { data, loading, error } = useFetch(() => api.getDesigns(params), [framework, category, search])
  const zanDesigns = data?.results || []

  const [originkitCategory, setOriginkitCategory] = useState('all')
  const originkitParams = {}
  if (originkitCategory !== 'all') originkitParams.category = originkitCategory
  if (search) originkitParams.search = search

  const { data: originkitData, loading: originkitLoading } = useFetch(() => api.getOriginkit(originkitParams), [originkitCategory, search])
  const originkitDesigns = (originkitData?.results || []).map(d => ({ ...d, _source: 'originkit' }))
  const originkitCategories = originkitData?.categories || {}

  const allDesigns = source === 'zan' ? zanDesigns : source === 'originkit' ? originkitDesigns : [...zanDesigns, ...originkitDesigns]

  const [exporting, setExporting] = useState(null)
  const [exportedCode, setExportedCode] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleExport = async (id, isOriginkit) => {
    setExporting(id)
    try {
      if (isOriginkit) {
        const res = await api.getOriginkitDetail(id)
        setExportedCode({ code: res.code || `// ${id} - Originkit Component\n// Source: https://originkit.dev`, design_id: name })
      } else {
        const res = await api.exportDesign(id)
        setExportedCode(res)
      }
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(null)
    }
  }

  const isVideo = (d) => d.file_type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(d.preview || '')
  const isImage = (d) => d.file_type === 'image' || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(d.preview || '') || (!isVideo(d) && d.preview && d.preview.startsWith('http'))

  return (
    <PageLayout title="">
      <div className="text-center mb-[50px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Browse Designs
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Production-ready<br />
          <span className="text-[#858585]">design templates.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          Browse, inspect, and copy source code directly into your project.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-[920px] mx-auto mb-[30px]">
        <div className="flex flex-col md:flex-row gap-[10px] mb-[16px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search designs..."
            className="flex-1 h-[38px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-[6px] mb-[10px]">
          {[{ key: 'all', label: 'All Designs' }, { key: 'zan', label: 'ZanDev' }, { key: 'originkit', label: 'Originkit' }].map((s) => (
            <button
              key={s.key}
              onClick={() => setSource(s.key)}
              className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
                source === s.key
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {source !== 'originkit' && (
          <>
            <div className="flex flex-wrap gap-[6px] mb-[10px]">
              {frameworks.map((f) => (
                <button
                  key={f}
                  onClick={() => setFramework(f)}
                  className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
                    framework === f
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-[6px]">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
                    category === c
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}
        {source !== 'zan' && (
          <div className="flex flex-wrap gap-[6px] mt-[10px]">
            <button
              onClick={() => setOriginkitCategory('all')}
              className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
                originkitCategory === 'all'
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              All Originkit
            </button>
            {Object.entries(originkitCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setOriginkitCategory(key)}
                className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
                  originkitCategory === key
                    ? 'bg-white text-black border-white'
                    : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {(loading || originkitLoading) && (
        <div className="text-center text-[#555] text-[12px] py-[60px]">Loading designs...</div>
      )}

      {error && (
        <div className="text-center text-[#ff6b6b] text-[12px] py-[60px]">
          Failed to load designs. Make sure the backend is running on port 8000.
        </div>
      )}

      {!loading && !originkitLoading && !error && allDesigns.length === 0 && (
        <div className="text-center text-[#555] text-[12px] py-[60px]">No designs found.</div>
      )}

      {!loading && !error && allDesigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] max-w-[1180px] mx-auto">
          {allDesigns.map((d) => {
            const isOK = d._source === 'originkit'
            const key = isOK ? `ok-${d.name}` : `zan-${d.id}`
            const currentId = isOK ? d.name : d.id

            return (
              <article key={key} className={`rounded-[18px] border overflow-hidden group hover:shadow-lg transition-all duration-300 ${
                isOK ? 'border-purple-500/20 bg-gradient-to-br from-[#0a0a12] to-[#0d0d15] hover:border-purple-500/40' : 'border-white/[0.10] bg-[#080808] hover:border-white/[0.18]'
              }`}>
                {/* Card Preview */}
                <div className="h-[200px] flex items-center justify-center overflow-hidden relative">
                  {isOK ? (
                    <div className={`w-full h-full bg-gradient-to-br ${OK_CATEGORY_COLORS[d.category] || OK_CATEGORY_COLORS['interactive-elements']} border-b flex flex-col items-center justify-center gap-[10px] relative`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-[15%] left-[15%] w-[60px] h-[60px] rounded-full bg-purple-500/20 blur-xl" />
                        <div className="absolute bottom-[20%] right-[20%] w-[40px] h-[40px] rounded-full bg-blue-500/20 blur-xl" />
                        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-cyan-500/10 blur-2xl" />
                      </div>
                      <span className="text-[36px] relative z-10">{OK_CATEGORY_ICONS[d.category] || '🧩'}</span>
                      <span className="text-white/70 text-[11px] font-semibold relative z-10 tracking-wide">{d.displayName}</span>
                    </div>
                  ) : isVideo(d) ? (
                    <video
                      src={d.preview}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0 }}
                    />
                  ) : isImage(d) ? (
                    <img
                      src={d.preview}
                      alt={d.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  {!isOK && (!d.preview || d.preview === '') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[#555] text-[11px] font-medium">{d.name}</div>
                    </div>
                  )}
                  {!isOK && isImage(d) && d.preview && (
                    <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                      <div className="text-[#555] text-[11px] font-medium">{d.name}</div>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isOK ? 'bg-purple-500/10' : 'bg-black/30'
                  }`}>
                    <span className={`text-[9px] font-semibold px-[14px] py-[6px] rounded-full backdrop-blur-sm ${
                      isOK ? 'bg-purple-500/90 text-white' : 'bg-white/90 text-black'
                    }`}>
                      {isOK ? 'Get Code' : 'View'}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-[18px]">
                  <div className="flex items-center gap-[6px] mb-[8px] flex-wrap">
                    {isOK ? (
                      <>
                        <span className="px-[8px] py-[3px] rounded-full border border-purple-500/25 bg-purple-500/10 text-purple-400 text-[8px] font-semibold">Originkit</span>
                        <span className="px-[8px] py-[3px] rounded-full border border-white/[0.08] bg-white/[0.025] text-[#aaa] text-[8px] font-medium">{d.categoryLabel}</span>
                        <span className="px-[8px] py-[3px] rounded-full text-[8px] font-medium text-[#4ade80] border border-[#4ade80]/20 bg-[#4ade80]/10 ml-auto">Free</span>
                      </>
                    ) : (
                      <>
                        <span className="px-[8px] py-[3px] rounded-full border border-white/[0.08] bg-white/[0.025] text-[#aaa] text-[8px] font-medium">{d.framework}</span>
                        <span className="px-[8px] py-[3px] rounded-full border border-white/[0.08] bg-white/[0.025] text-[#aaa] text-[8px] font-medium">{d.category}</span>
                        <span className={`px-[8px] py-[3px] rounded-full text-[8px] font-medium ml-auto ${d.price === 'Free' ? 'text-[#4ade80] border border-[#4ade80]/20 bg-[#4ade80]/10' : 'text-[#fbbf24] border border-[#fbbf24]/20 bg-[#fbbf24]/10'}`}>
                          {d.price}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-[14px] tracking-[-0.03em] font-semibold mb-[4px] leading-tight">{isOK ? d.displayName : d.name}</h3>
                  <p className="text-[#666] text-[10px] leading-[1.6] mb-[12px] line-clamp-2 min-h-[32px]">{d.description}</p>

                  {/* Tags / Stats */}
                  <div className="flex items-center justify-between mb-[14px]">
                    {isOK ? (
                      <div className="flex gap-[4px] flex-wrap flex-1">
                        {(d.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="px-[6px] py-[2px] rounded-[4px] bg-white/[0.04] text-[#666] text-[7px] font-medium">{tag}</span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex gap-[12px] text-[9px] text-[#555]">
                        <span>{(d.views / 1000).toFixed(1)}K views</span>
                        <span>{(d.exports / 1000).toFixed(1)}K exports</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleExport(currentId, isOK)}
                    disabled={exporting === currentId}
                    className={`w-full h-[36px] rounded-[8px] text-[10px] font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-[6px] ${
                      isOK
                        ? 'bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white hover:from-purple-500 hover:to-blue-500 hover:-translate-y-[1px]'
                        : 'bg-white text-black hover:-translate-y-[1px]'
                    }`}
                  >
                    {exporting === currentId ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : isOK ? (
                      <><ExternalLink size={12} /> Get Source Code</>
                    ) : (
                      <><Download size={12} /> Export Design</>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {exportedCode && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setExportedCode(null)}>
          <div className="w-full max-w-[700px] mx-4 max-h-[90vh] flex flex-col rounded-[18px] border border-white/[0.10] bg-[#0a0a0a] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-[20px] border-b border-white/[0.06]">
              <div>
                <h3 className="text-[14px] font-semibold">Exported Code</h3>
                <p className="text-[9px] text-[#555] mt-[2px]">Ready to copy into your project</p>
              </div>
              <button onClick={() => setExportedCode(null)} className="text-[#666] hover:text-white text-[18px]">×</button>
            </div>
            <div className="flex-1 overflow-auto p-[20px]">
              <pre className="p-[16px] rounded-[12px] bg-[#050505] border border-white/[0.05] text-[10px] leading-[1.7] text-[#aaa] overflow-x-auto whitespace-pre-wrap break-words">
                {exportedCode.code}
              </pre>
            </div>
            <div className="flex gap-[8px] p-[20px] border-t border-white/[0.06]">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportedCode.code)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="flex-1 h-[38px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform flex items-center justify-center gap-[6px]"
              >
                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy Code</>}
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([exportedCode.code], { type: 'text/javascript' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `component.jsx`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="flex-1 h-[38px] rounded-[8px] border border-white/[0.10] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-[6px]"
              >
                <Download size={13} /> Download .jsx
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
