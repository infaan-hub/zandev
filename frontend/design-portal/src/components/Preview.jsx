import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

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

export default function Preview() {
  const [designs, setDesigns] = useState([])
  const [originkit, setOriginkit] = useState([])

  useEffect(() => {
    api.getDesigns({ sort: '-score' })
      .then((data) => setDesigns((data.results || []).slice(0, 10)))
      .catch(() => {})
    api.getOriginkit()
      .then((data) => setOriginkit((data.results || []).slice(0, 10)))
      .catch(() => {})
  }, [])

  const isVideo = (d) => d.file_type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(d.preview || '')
  const isImage = (d) => d.file_type === 'image' || (d.preview && d.preview.startsWith('http') && !isVideo(d))

  return (
    <section className="relative overflow-hidden" style={{ padding: '100px 0 150px' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.04] rounded-full pointer-events-none" style={{ width: '1000px', height: '1000px' }} />

      <div className="relative z-[2] w-full max-w-[920px] mx-auto bg-[#050505] border border-white/[0.10] rounded-[28px] p-[13px] shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="h-[31px] flex items-center gap-[5px] px-[10px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
        </div>

        <div
          className="rounded-[20px] overflow-hidden border border-white/[0.05]"
          style={{
            background: 'radial-gradient(circle at 70% 10%, rgba(255,255,255,0.06), transparent 30%), #060606',
          }}
        >
          <div className="p-[50px]">
            <div className="flex justify-between items-center text-[#777] text-[9px]">
              <strong className="text-white">ZanDev</strong>
              <span>Designs &nbsp;&nbsp; Code &nbsp;&nbsp; Components</span>
            </div>

            <div className="mt-[60px] max-w-[600px]">
              <div className="text-[#555] text-[8px] mb-[14px]">
                DESIGN-TO-CODE MARKETPLACE
              </div>
              <div className="text-[48px] leading-[0.95] tracking-[-0.06em] font-bold">
                Browse. Copy.<span className="text-[#555]"> Ship.</span>
              </div>
              <p className="text-[#666] text-[10px] leading-[1.6] max-w-[370px] mt-[18px]">
                Browse production-ready designs, inspect the source code,
                and paste components directly into your project.
              </p>
              <div className="flex gap-[8px] mt-[22px]">
                <Link to="/tools" className="inline-flex items-center justify-center min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold bg-white text-black border border-white/[0.1] hover:-translate-y-[2px] transition-transform duration-200">
                  Browse designs
                </Link>
                <Link to="/tools" className="inline-flex items-center justify-center min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold bg-white/[0.035] text-[#bbb] border border-white/[0.1] hover:-translate-y-[2px] transition-transform duration-200">
                  View source
                </Link>
              </div>
            </div>

            {/* Design Grid */}
            {designs.length > 0 && (
              <div className="mt-[50px] grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-[10px]">
                {designs.map((d) => (
                  <Link
                    key={d.id}
                    to="/tools"
                    className="group relative rounded-[10px] overflow-hidden border border-white/[0.06] bg-white/[0.025] hover:border-white/[0.15] transition-all duration-200 cursor-pointer"
                  >
                    <div className="h-[90px] flex items-center justify-center overflow-hidden">
                      {isVideo(d) ? (
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
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="text-[#444] text-[8px] font-medium">{d.name}</div>
                      )}
                    </div>
                    <div className="p-[8px]">
                      <div className="text-[9px] font-semibold truncate">{d.name}</div>
                      <div className="flex items-center gap-[4px] mt-[3px]">
                        <span className="text-[7px] text-[#555]">{d.framework}</span>
                        <span className={`text-[7px] font-medium ${d.price === 'Free' ? 'text-[#4ade80]' : 'text-[#fbbf24]'}`}>
                          {d.price}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-[8px] font-semibold bg-white/90 text-black px-[10px] py-[4px] rounded-full">View</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Originkit Animated Components */}
            {originkit.length > 0 && (
              <div className="mt-[30px]">
                <div className="flex items-center gap-[8px] mb-[14px]">
                  <span className="text-[10px] text-[#888] font-semibold">Animated Components</span>
                  <span className="px-[6px] py-[2px] rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[7px] font-medium">Originkit</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[10px]">
                  {originkit.map((d) => (
                    <Link
                      key={d.name}
                      to="/tools"
                      className="group relative rounded-[10px] overflow-hidden border border-purple-500/15 bg-gradient-to-br from-[#0a0a12] to-[#0d0d15] hover:border-purple-500/35 transition-all duration-200 cursor-pointer"
                    >
                      <div className={`h-[90px] flex items-center justify-center overflow-hidden bg-gradient-to-br ${OK_CATEGORY_COLORS[d.category] || OK_CATEGORY_COLORS['interactive-elements']}`}>
                        <div className="relative flex flex-col items-center gap-[4px]">
                          <div className="absolute -inset-4 opacity-30">
                            <div className="absolute top-0 left-0 w-[30px] h-[30px] rounded-full bg-purple-500/20 blur-lg" />
                            <div className="absolute bottom-0 right-0 w-[20px] h-[20px] rounded-full bg-blue-500/20 blur-lg" />
                          </div>
                          <span className="text-[20px] relative z-10">{OK_CATEGORY_ICONS[d.category] || '🧩'}</span>
                          <span className="text-white/60 text-[7px] font-medium relative z-10">{d.displayName}</span>
                        </div>
                      </div>
                      <div className="p-[8px]">
                        <div className="text-[9px] font-semibold truncate">{d.displayName}</div>
                        <div className="flex items-center gap-[4px] mt-[3px]">
                          <span className="text-[7px] text-purple-400">{d.categoryLabel}</span>
                          <span className="text-[7px] text-[#4ade80]">Free</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-purple-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-[8px] font-semibold bg-purple-500/90 text-white px-[10px] py-[4px] rounded-full">Get Code</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(designs.length > 0 || originkit.length > 0) && (
              <div className="mt-[20px] text-center">
                <Link to="/tools" className="inline-flex items-center gap-[6px] text-[10px] text-[#888] hover:text-white transition-colors font-medium">
                  See all designs on ZanDev <span className="text-[12px]">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
