import { useState, useEffect, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import LivePreview from '../tools/LivePreview'
import { useDesignWebSocket } from '../hooks/useDesignWebSocket'

function DesignCard({ design }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const d = design
  const isVideo = d.file_type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(d.preview || '')
  const isImage = d.file_type === 'image' || (d.preview && d.preview.startsWith('http') && !isVideo)
  const hasCode = d.has_code

  const galleryImages = [d.preview_image, d.gallery_image_1, d.gallery_image_2, d.gallery_image_3, d.gallery_image_4, d.gallery_image_5].filter(Boolean)

  return (
    <Link to={`/tools/${d.id}`}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
      {/* Preview Area */}
      <div className="h-[220px] flex items-center justify-center overflow-hidden bg-[#050505] relative">
        {hasCode ? (
          <LivePreview
            html={d.html_code}
            css={d.css_code}
            js={d.js_code}
            reactCode={d.react_code}
            className="w-full h-full"
            title={`card-${d.id}`}
          />
        ) : isVideo ? (
          <video src={d.preview} className="w-full h-full object-cover" muted loop playsInline preload="metadata"
            onMouseEnter={e => e.target.play()} onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0 }} />
        ) : isImage ? (
          <img src={d.preview} alt={d.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
        ) : (
          <div className="text-[#444] text-[11px] font-medium">{d.name}</div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="text-[10px] font-semibold bg-white text-black px-4 py-2 rounded-full shadow-lg">View Design</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-[13px] font-semibold truncate text-white mb-1">{d.name}</div>
        {d.description && (
          <div className="text-[10px] text-[#666] truncate mb-2">{d.description}</div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {hasCode && (
            <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">LIVE</span>
          )}
          <span className="text-[9px] text-[#888]">{d.framework}</span>
          <span className="text-[9px] text-[#555]">|</span>
          <span className="text-[9px] text-[#666]">{d.category}</span>
          <span className="text-[9px] text-[#555]">|</span>
          <span className={`text-[9px] font-medium ${d.price === 'Free' ? 'text-[#4ade80]' : 'text-[#fbbf24]'}`}>{d.price}</span>
        </div>
      </div>
    </Link>
  )
}

const MemoizedDesignCard = memo(DesignCard)

function Preview() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadDesigns = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum > 1) setLoadingMore(true)
      const data = await api.getDesigns({ sort: '-score', page: pageNum, page_size: 12 })
      const results = data.results || []
      if (append) {
        setDesigns(prev => [...prev, ...results])
      } else {
        setDesigns(results)
      }
      setHasMore(results.length === 12)
      setPage(pageNum)
    } catch (e) {
      console.error('Failed to load designs:', e)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { loadDesigns(1, false) }, [loadDesigns])

  useDesignWebSocket(useCallback((event) => {
    if (event.action === 'create') {
      loadDesigns(1, false)
    } else if (event.action === 'update') {
      setDesigns(prev => prev.map(d => d.id === event.design?.id ? { ...d, ...event.design } : d))
    } else if (event.action === 'delete') {
      setDesigns(prev => prev.filter(d => d.id !== event.design?.id))
    } else if (event.action === 'publish') {
      loadDesigns(1, false)
    } else if (event.action === 'unpublish') {
      setDesigns(prev => prev.filter(d => d.id !== event.design?.id))
    }
  }, [loadDesigns]))

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadDesigns(page + 1, true)
    }
  }, [page, loadingMore, hasMore, loadDesigns])

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#080808] overflow-hidden animate-pulse">
                <div className="h-[220px] bg-white/[0.03]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-white/[0.05] rounded w-3/4" />
                  <div className="h-3 bg-white/[0.03] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="max-w-[1200px] mx-auto px-5">
        {designs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map(d => (
                <MemoizedDesignCard key={d.id} design={d} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button onClick={loadMore} disabled={loadingMore}
                  className="px-6 py-3 rounded-lg border border-white/[0.10] text-[11px] font-semibold text-white hover:bg-white/[0.05] transition-colors disabled:opacity-50">
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-[#555] text-[12px]">
            No designs available yet.
          </div>
        )}
      </div>
    </section>
  )
}

export default memo(Preview)
