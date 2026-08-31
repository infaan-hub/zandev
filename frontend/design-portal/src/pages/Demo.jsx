import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import LivePreview from '../tools/LivePreview'
import { api } from '../lib/api'

export default function Demo() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDesigns({ sort: '-score', page_size: 6 })
      .then(data => setDesigns((data.results || []).slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Live Demo
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          See ZanDev<br />
          <span className="text-[#858585]">in action.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          Browse live component designs, inspect the source code, and copy clean implementations.
          Every preview runs real HTML, CSS, and JavaScript.
        </p>
      </div>

      <div className="w-full max-w-[920px] mx-auto bg-[#050505] border border-white/[0.10] rounded-[28px] p-[13px] shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="h-[31px] flex items-center gap-[5px] px-[10px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
        </div>
        <div className="rounded-[20px] overflow-hidden border border-white/[0.05] bg-[#060606]" style={{ minHeight: '500px' }}>
          <div className="p-[40px]">
            <div className="flex justify-between items-center text-[#777] text-[9px] mb-[40px]">
              <strong className="text-white">ZanDev</strong>
              <span>Designs &nbsp;&nbsp; Code &nbsp;&nbsp; Export</span>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-[180px] rounded-[12px] bg-white/[0.035] border border-white/[0.06] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                {designs.map(d => (
                  <Link key={d.id} to={`/tools/${d.id}`} className="group rounded-[12px] bg-white/[0.035] border border-white/[0.06] overflow-hidden hover:border-white/[0.15] transition-colors">
                    <div className="h-[130px] overflow-hidden">
                      {d.has_code ? (
                        <LivePreview html={d.html_code} css={d.css_code} js={d.js_code} className="w-full h-full" title={d.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#444] text-[10px]">{d.name}</div>
                      )}
                    </div>
                    <div className="p-[10px]">
                      <div className="text-[10px] font-semibold truncate">{d.name}</div>
                      <div className="flex items-center gap-[6px] mt-[4px]">
                        <span className="text-[8px] text-[#555]">{d.framework}</span>
                        <span className="text-[8px] text-[#555]">Score: {d.score}</span>
                      </div>
                      <div className="mt-[6px] text-[8px] text-[#888] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Full Design →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-[50px]">
        <Link to="/signup" className="inline-flex items-center justify-center gap-2 min-h-[40px] px-[20px] rounded-[8px] text-[11px] font-semibold bg-white text-black hover:-translate-y-[2px] transition-transform duration-200">
          Try It Yourself <span>↗</span>
        </Link>
      </div>
    </PageLayout>
  )
}
