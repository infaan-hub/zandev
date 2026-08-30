import { useState, useEffect, useRef, useCallback } from 'react'
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
  'interactive-elements': { from: '#8b5cf6', to: '#3b82f6' },
  'image-gallery': { from: '#ec4899', to: '#f97316' },
  'text': { from: '#06b6d4', to: '#22c55e' },
  'animation': { from: '#f59e0b', to: '#eab308' },
  'background-animation': { from: '#3b82f6', to: '#6366f1' },
  'button': { from: '#ef4444', to: '#ec4899' },
}

const OK_CATEGORY_GRADIENTS = {
  'interactive-elements': 'from-purple-500/30 to-blue-500/30 border-purple-500/40',
  'image-gallery': 'from-pink-500/30 to-orange-500/30 border-pink-500/40',
  'text': 'from-cyan-500/30 to-green-500/30 border-cyan-500/40',
  'animation': 'from-amber-500/30 to-yellow-500/30 border-amber-500/40',
  'background-animation': 'from-blue-500/30 to-indigo-500/30 border-blue-500/40',
  'button': 'from-red-500/30 to-pink-500/30 border-red-500/40',
}

function ParticleSVG({ colors }) {
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.02; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 + t
    const r = 25 + Math.sin(t * 2 + i) * 15
    const x = 50 + Math.cos(angle) * r
    const y = 50 + Math.sin(angle) * r
    const op = 0.3 + Math.sin(t * 3 + i) * 0.3
    return <circle key={i} cx={x} cy={y} r={1.5 + Math.sin(t + i) * 0.8} fill={i % 2 === 0 ? colors.from : colors.to} opacity={op} />
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id={`pg${colors.from.replace('#','')}`}>
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.to} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#pg${colors.from.replace('#','')})`} />
      {particles}
    </svg>
  )
}

function GallerySVG({ colors }) {
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.015; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const imgs = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 + t * 0.5
    const x = 50 + Math.cos(angle) * 28
    const y = 50 + Math.sin(angle) * 20
    const scale = 0.7 + Math.sin(t + i) * 0.15
    const opacity = 0.5 + Math.sin(t * 2 + i) * 0.3
    return <rect key={i} x={x - 6} y={y - 4} width={12} height={8} rx={1.5} fill={i % 2 === 0 ? colors.from : colors.to} opacity={opacity} transform={`scale(${scale})`} />
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id={`gg${colors.from.replace('#','')}`}>
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.1" />
          <stop offset="100%" stopColor={colors.to} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#gg${colors.from.replace('#','')})`} />
      {imgs}
    </svg>
  )
}

function TextSVG({ colors }) {
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.03; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const letters = 'ABCD'.split('')
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id={`tg${colors.from.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
      </defs>
      {letters.map((l, i) => {
        const y = 30 + i * 15
        const x = 25 + Math.sin(t * 2 + i) * 8
        const opacity = 0.4 + Math.sin(t * 3 + i) * 0.4
        return (
          <text key={i} x={x} y={y} fontSize="14" fontWeight="bold" fill={`url(#tg${colors.from.replace('#','')})`} opacity={opacity}>
            {l}
          </text>
        )
      })}
    </svg>
  )
}

function AnimationSVG({ colors }) {
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.025; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const lines = Array.from({ length: 8 }, (_, i) => {
    const y = 20 + i * 8
    const progress = ((t * 0.5 + i * 0.3) % 1.2)
    const w = progress * 60
    const op = progress < 1 ? 0.6 : 0.6 * (1.2 - progress)
    return <rect key={i} x={20} y={y} width={w} height={3} rx={1.5} fill={i % 2 === 0 ? colors.from : colors.to} opacity={op} />
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id={`ag${colors.from.replace('#','')}`}>
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.08" />
          <stop offset="100%" stopColor={colors.to} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill={`url(#ag${colors.from.replace('#','')})`} />
      {lines}
    </svg>
  )
}

function WaveSVG({ colors }) {
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.02; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const paths = Array.from({ length: 3 }, (_, i) => {
    const offset = i * 10
    const y = 50 + offset - 10
    let d = `M 0 ${y}`
    for (let x = 0; x <= 100; x += 2) {
      const yv = y + Math.sin((x * 0.05) + t + i) * 6
      d += ` L ${x} ${yv}`
    }
    const op = 0.15 + i * 0.1
    return <path key={i} d={d} fill="none" stroke={i === 0 ? colors.from : colors.to} strokeWidth={1.5} opacity={op} />
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id={`wg${colors.from.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.from} stopOpacity="0.06" />
          <stop offset="100%" stopColor={colors.to} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#wg${colors.from.replace('#','')})`} />
      {paths}
    </svg>
  )
}

function ButtonSVG({ colors }) {
  const [hover, setHover] = useState(false)
  const [t, setT] = useState(0)
  const ref = useRef()
  useEffect(() => {
    let f = 0
    const animate = () => { f += 0.03; setT(f); ref.current = requestAnimationFrame(animate) }
    ref.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(ref.current)
  }, [])
  const glow = hover ? 0.4 + Math.sin(t * 3) * 0.2 : 0.15
  const scale = hover ? 1.05 : 1
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id={`bg${colors.from.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.from} />
          <stop offset="100%" stopColor={colors.to} />
        </linearGradient>
        <filter id={`glow${colors.from.replace('#','')}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g transform={`translate(50,50) scale(${scale}) translate(-50,-50)`}>
        <rect x="20" y="38" width="60" height="24" rx="8" fill={`url(#bg${colors.from.replace('#','')})`} opacity={0.8 + glow * 0.5} filter={hover ? `url(#glow${colors.from.replace('#','')})` : undefined} />
        <text x="50" y="54" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white" opacity="0.9">Click</text>
      </g>
    </svg>
  )
}

const PREVIEW_MAP = {
  'interactive-elements': ParticleSVG,
  'image-gallery': GallerySVG,
  'text': TextSVG,
  'animation': AnimationSVG,
  'background-animation': WaveSVG,
  'button': ButtonSVG,
}

function OriginkitPreview({ category, colors, isHovered }) {
  const Comp = PREVIEW_MAP[category] || ParticleSVG
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Comp colors={colors} />
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      )}
    </div>
  )
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
                  {originkit.map((d) => {
                    const colors = OK_CATEGORY_COLORS[d.category] || OK_CATEGORY_COLORS['interactive-elements']
                    return (
                      <OriginkitPreviewCard key={d.name} d={d} colors={colors} />
                    )
                  })}
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

function OriginkitPreviewCard({ d, colors }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      key={d.name}
      to="/tools"
      className="group relative rounded-[10px] overflow-hidden border border-purple-500/15 bg-gradient-to-br from-[#0a0a12] to-[#0d0d15] hover:border-purple-500/35 transition-all duration-200 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-[90px] overflow-hidden">
        <OriginkitPreview category={d.category} colors={colors} isHovered={hovered} />
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
  )
}
