import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'

const severityColors = {
  low: { color: '#94a3b8', bg: '#94a3b815', border: '#94a3b830' },
  medium: { color: '#fbbf24', bg: '#fbbf2415', border: '#fbbf2430' },
  high: { color: '#fb923c', bg: '#fb923c15', border: '#fb923c30' },
  critical: { color: '#f87171', bg: '#f8717115', border: '#f8717130' },
}

export default function AdminThreats() {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadThreats() }, [])

  const loadThreats = async () => {
    try {
      const data = await api.adminThreats()
      setThreats(data.threats || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resolveThreat = async (id) => {
    try {
      await api.adminResolveThreat(id)
      loadThreats()
    } catch (err) {
      console.error(err)
    }
  }

  const active = threats.filter(t => !t.resolved)
  const resolved = threats.filter(t => t.resolved)

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Threats & Alerts</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">{active.length} active threat{active.length !== 1 ? 's' : ''}.</p>
        </div>
        <button onClick={loadThreats} className="px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-[#555] text-[12px] py-[40px] text-center">Loading...</div>
      ) : threats.length === 0 ? (
        <div className="text-center py-[60px]">
          <AlertTriangle size={32} className="text-[#333] mx-auto mb-[12px]" />
          <div className="text-[#555] text-[12px]">No threats detected.</div>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div className="mb-[24px]">
              <h2 className="text-[12px] font-semibold text-[#fb923c] mb-[10px]">Active ({active.length})</h2>
              <div className="flex flex-col gap-[6px]">
                {active.map((t) => {
                  const sc = severityColors[t.severity] || severityColors.medium
                  return (
                    <div key={t.id} className="flex items-center justify-between p-[14px] rounded-[10px] border border-white/[0.06] bg-[#080808]">
                      <div className="flex items-center gap-[12px]">
                        <span
                          className="px-[8px] py-[3px] rounded-full text-[8px] font-medium"
                          style={{ color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}
                        >
                          {t.severity.toUpperCase()}
                        </span>
                        <div>
                          <div className="text-[11px] font-semibold">{t.type}</div>
                          <div className="text-[9px] text-[#666] mt-[2px]">{t.description}</div>
                          <div className="text-[8px] text-[#555] mt-[4px]">
                            {t.ip_address && `IP: ${t.ip_address} · `}{new Date(t.detected_at).toLocaleString()}
                            {t.blocked && ' · AUTO-BLOCKED'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => resolveThreat(t.id)}
                        className="px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <h2 className="text-[12px] font-semibold text-[#4ade80] mb-[10px]">Resolved ({resolved.length})</h2>
              <div className="flex flex-col gap-[6px]">
                {resolved.map((t) => {
                  const sc = severityColors[t.severity] || severityColors.medium
                  return (
                    <div key={t.id} className="flex items-center justify-between p-[14px] rounded-[10px] border border-white/[0.04] bg-[#080808] opacity-60">
                      <div className="flex items-center gap-[12px]">
                        <span
                          className="px-[8px] py-[3px] rounded-full text-[8px] font-medium"
                          style={{ color: sc.color, backgroundColor: sc.bg, border: `1px solid ${sc.border}` }}
                        >
                          {t.severity.toUpperCase()}
                        </span>
                        <div>
                          <div className="text-[11px] font-semibold">{t.type}</div>
                          <div className="text-[9px] text-[#666] mt-[2px]">{t.description}</div>
                        </div>
                      </div>
                      <span className="text-[8px] text-[#4ade80]">RESOLVED</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
