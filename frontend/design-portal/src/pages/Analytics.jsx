import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api } from '../lib/api'

function SkeletonCard() {
  return (
    <div className="p-[20px] rounded-[14px] border border-white/[0.10] bg-[#080808] animate-pulse">
      <div className="h-[8px] w-[80px] bg-white/[0.06] rounded mb-[10px]" />
      <div className="h-[28px] w-[60px] bg-white/[0.06] rounded mb-[4px]" />
      <div className="h-[9px] w-[40px] bg-white/[0.06] rounded" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05] animate-pulse">
      <div className="flex items-center gap-[12px]">
        <div className="h-[10px] w-[16px] bg-white/[0.06] rounded" />
        <div className="h-[12px] w-[140px] bg-white/[0.06] rounded" />
      </div>
      <div className="flex gap-[20px]">
        <div className="h-[10px] w-[60px] bg-white/[0.06] rounded" />
        <div className="h-[10px] w-[60px] bg-white/[0.06] rounded" />
      </div>
    </div>
  )
}

export default function Analytics() {
  const [stats, setStats] = useState(null)
  const [topDesigns, setTopDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, designsData] = await Promise.all([
          api.getStats(),
          api.getDesigns({ sort: '-views', page_size: 5 }),
        ])
        setStats(statsData)
        setTopDesigns(designsData.results || designsData || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const metrics = stats
    ? [
        { label: 'Total Designs', value: stats.total_designs?.toLocaleString() ?? '0', change: '', up: true },
        { label: 'Total Views', value: stats.total_views?.toLocaleString() ?? '0', change: '', up: true },
        { label: 'Total Exports', value: stats.total_exports?.toLocaleString() ?? '0', change: '', up: true },
        { label: 'Active Designs', value: (topDesigns.length || 0).toString(), change: '', up: true },
      ]
    : []

  return (
    <PageLayout title="">
      <div className="mb-[40px]">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
          Analytics
        </h1>
        <p className="text-[#666] text-[12px] leading-[1.7] mt-[10px]">
          Platform usage metrics. View counts, export counts, and trending design components.
        </p>
      </div>

      {error && (
        <div className="p-[20px] rounded-[14px] border border-red-500/20 bg-red-500/5 mb-[40px] text-[12px] text-red-400">
          Failed to load analytics: {error}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[12px] mb-[40px]">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : metrics.map((m) => (
              <div key={m.label} className="p-[20px] rounded-[14px] border border-white/[0.10] bg-[#080808]">
                <div className="text-[#555] text-[8px] uppercase tracking-[0.08em] mb-[10px]">{m.label}</div>
                <div className="text-[28px] tracking-[-0.05em] font-bold">{m.value}</div>
                {m.change && <div className="text-[#4ade80] text-[9px] mt-[4px]">{m.change}</div>}
              </div>
            ))}
      </div>

      {/* Chart placeholder */}
      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808] mb-[40px]">
        <div className="text-[#6c6c6c] text-[9px] mb-[20px]">DESIGN COUNT DISTRIBUTION</div>
        {loading ? (
          <div className="h-[200px] flex items-end gap-[6px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex-1 rounded-t-[4px] bg-white/[0.04] animate-pulse" style={{ height: `${30 + Math.random() * 40}%` }} />
            ))}
          </div>
        ) : topDesigns.length > 0 ? (
          <div className="h-[200px] flex items-end gap-[6px]">
            {topDesigns.map((d, i) => {
              const maxViews = Math.max(...topDesigns.map((x) => x.views || 0), 1)
              const height = Math.max(((d.views || 0) / maxViews) * 100, 8)
              return (
                <div key={d.id || i} className="flex-1 flex flex-col items-center gap-[6px]">
                  <span className="text-[8px] text-[#666]">{d.views ?? 0}</span>
                  <div
                    className="w-full rounded-t-[4px] bg-gradient-to-t from-white/[0.08] to-white/[0.03] border border-white/[0.06]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[#555] text-[11px]">
            Coming soon
          </div>
        )}
        {loading ? (
          <div className="flex justify-between text-[#555] text-[7px] mt-[10px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="h-[7px] w-[20px] bg-white/[0.06] rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex justify-between text-[#555] text-[7px] mt-[10px]">
            {topDesigns.slice(0, 12).map((d, i) => (
              <span key={d.id || i} className="truncate max-w-[60px]">{(d.name || '').slice(0, 6)}</span>
            ))}
            {topDesigns.length === 0 && <span>No data</span>}
          </div>
        )}
      </div>

      {/* Top designs */}
      <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
        <div className="text-[#6c6c6c] text-[9px] mb-[20px]">TOP DESIGNS</div>
        <div className="flex flex-col gap-[8px]">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : topDesigns.length === 0
              ? (
                  <div className="text-[#555] text-[11px] text-center py-[40px]">No designs found</div>
                )
              : topDesigns.map((d, i) => (
                  <div key={d.id || i} className="flex items-center justify-between p-[14px] rounded-[10px] bg-white/[0.025] border border-white/[0.05]">
                    <div className="flex items-center gap-[12px]">
                      <span className="text-[#555] text-[9px] w-[16px]">{i + 1}</span>
                      <span className="text-[12px] font-medium">{d.name}</span>
                    </div>
                    <div className="flex gap-[20px] text-[10px]">
                      <span className="text-[#888]">{(d.views ?? 0).toLocaleString()} views</span>
                      <span className="text-[#aaa] font-semibold">{(d.exports ?? 0).toLocaleString()} exports</span>
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </PageLayout>
  )
}
