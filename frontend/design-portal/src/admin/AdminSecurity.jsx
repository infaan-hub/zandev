import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { api } from '../lib/api'

const severityColors = {
  low: { color: '#94a3b8', bg: '#94a3b815', border: '#94a3b830' },
  medium: { color: '#fbbf24', bg: '#fbbf2415', border: '#fbbf2430' },
  high: { color: '#fb923c', bg: '#fb923c15', border: '#fb923c30' },
  critical: { color: '#f87171', bg: '#f8717115', border: '#f8717130' },
}

export default function AdminSecurity() {
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState(null)
  const [threats, setThreats] = useState([])
  const [loadingThreats, setLoadingThreats] = useState(true)

  useEffect(() => { loadThreats() }, [])

  const loadThreats = async () => {
    try {
      const data = await api.adminThreats()
      setThreats(data.threats || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingThreats(false)
    }
  }

  const runScan = async () => {
    setScanning(true)
    setResults(null)
    try {
      const data = await api.adminSecurityScan()
      setResults(data)
      loadThreats()
    } catch (err) {
      console.error(err)
      setResults({ scan_complete: true, threats_found: 0, threats: [], error: 'Scan failed' })
    } finally {
      setScanning(false)
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

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Security Scanner</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">Scan backend & frontend for vulnerabilities.</p>
        </div>
        <button
          onClick={runScan}
          disabled={scanning}
          className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-[1px] transition-transform disabled:opacity-50"
        >
          <Shield size={14} />
          {scanning ? 'Scanning...' : 'Run Full Scan'}
        </button>
      </div>

      {results && (
        <div className="mb-[24px] p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808]">
          <div className="flex items-center gap-[8px] mb-[16px]">
            {results.threats_found > 0 ? (
              <AlertTriangle size={16} className="text-[#fb923c]" />
            ) : (
              <CheckCircle size={16} className="text-[#4ade80]" />
            )}
            <span className="text-[13px] font-semibold">
              Scan Complete — {results.threats_found} threat{results.threats_found !== 1 ? 's' : ''} found
            </span>
          </div>

          {results.threats.length > 0 ? (
            <div className="flex flex-col gap-[8px]">
              {results.threats.map((t, i) => {
                const sc = severityColors[t.severity] || severityColors.medium
                return (
                  <div key={i} className="flex items-center justify-between p-[12px] rounded-[10px] bg-white/[0.02] border border-white/[0.05]">
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
                    {t.blocked && (
                      <span className="text-[8px] text-[#f87171] font-medium">AUTO-BLOCKED</span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-[#4ade80] text-[11px]">All clear. No threats detected.</div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-[14px] font-semibold mb-[12px]">Previous Threats</h2>
        {loadingThreats ? (
          <div className="text-[#555] text-[11px] py-[20px] text-center">Loading...</div>
        ) : threats.length === 0 ? (
          <div className="text-[#555] text-[11px] py-[20px] text-center">No threats recorded.</div>
        ) : (
          <div className="flex flex-col gap-[6px]">
            {threats.map((t) => {
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
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    {t.blocked && <span className="text-[8px] text-[#f87171]">BLOCKED</span>}
                    {t.resolved ? (
                      <span className="text-[8px] text-[#4ade80]">RESOLVED</span>
                    ) : (
                      <button
                        onClick={() => resolveThreat(t.id)}
                        className="px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
