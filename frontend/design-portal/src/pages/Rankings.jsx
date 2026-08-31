import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import { api } from '../lib/api'

export default function Rankings() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDesigns({ sort: '-score', page_size: 20 })
      .then(data => setDesigns(data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageLayout title="">
      <div className="mb-[40px]">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
          Rankings
        </h1>
        <p className="text-[#666] text-[12px] leading-[1.7] mt-[10px]">
          Top-rated design components ranked by score. Each entry links to the full source code and live preview.
        </p>
      </div>

      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
        {loading ? (
          <div className="space-y-[8px]">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-[52px] rounded-[10px] bg-white/[0.025] animate-pulse" />
            ))}
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-[60px] text-[#444] text-[12px]">No designs found</div>
        ) : (
          <>
            <div className="hidden md:grid grid-cols-[40px_1fr_120px_100px_80px] gap-[12px] text-[#555] text-[8px] uppercase tracking-[0.08em] mb-[16px] px-[14px]">
              <span>#</span>
              <span>Design</span>
              <span>Framework</span>
              <span>Category</span>
              <span>Score</span>
            </div>

            <div className="hidden md:flex flex-col gap-[4px]">
              {designs.map((d, i) => (
                <Link key={d.id} to={`/tools/${d.id}`}
                  className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-[12px] items-center p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05] hover:border-white/[0.12] transition-colors">
                  <span className={`text-[12px] font-bold ${(i + 1) <= 3 ? 'text-white' : 'text-[#555]'}`}>{i + 1}</span>
                  <span className="text-[12px] font-medium">{d.name}</span>
                  <span className="text-[10px] text-[#888]">{d.framework}</span>
                  <span className="text-[10px] text-[#666]">{d.category}</span>
                  <span className="text-[12px] font-semibold text-right">{d.score}</span>
                </Link>
              ))}
            </div>

            <div className="flex md:hidden flex-col gap-[8px]">
              {designs.map((d, i) => (
                <Link key={d.id} to={`/tools/${d.id}`}
                  className="p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05] hover:border-white/[0.12] transition-colors">
                  <div className="flex items-center justify-between mb-[6px]">
                    <div className="flex items-center gap-[10px]">
                      <span className={`text-[14px] font-bold ${(i + 1) <= 3 ? 'text-white' : 'text-[#555]'}`}>#{i + 1}</span>
                      <span className="text-[12px] font-medium text-white">{d.name}</span>
                    </div>
                    <span className="text-[14px] font-semibold">{d.score}</span>
                  </div>
                  <div className="flex gap-[8px] text-[10px] text-[#888]">
                    <span>{d.framework}</span>
                    <span className="text-[#555]">·</span>
                    <span>{d.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
