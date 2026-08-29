import { useState, useEffect } from 'react'
import { Lock, Plus, X } from 'lucide-react'
import { api } from '../lib/api'

export default function AdminBlockedIPs() {
  const [ips, setIps] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newIP, setNewIP] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => { loadIPs() }, [])

  const loadIPs = async () => {
    try {
      const data = await api.adminBlockedIPs()
      setIps(data.blocked_ips || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newIP.trim()) return
    try {
      await api.adminBlockIP({ ip_address: newIP.trim(), reason: reason.trim() || 'Manually blocked' })
      setNewIP('')
      setReason('')
      setShowAdd(false)
      loadIPs()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (id) => {
    try {
      await api.adminUnblockIP(id)
      loadIPs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Blocked IPs</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">{ips.length} blocked address{ips.length !== 1 ? 'es' : ''}.</p>
        </div>
        <div className="flex gap-[8px]">
          <button onClick={loadIPs} className="px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">
            Refresh
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform"
          >
            <Plus size={13} />
            Block IP
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-[20px] p-[16px] rounded-[12px] border border-white/[0.08] bg-[#080808]">
          <div className="flex gap-[8px]">
            <input
              type="text"
              value={newIP}
              onChange={(e) => setNewIP(e.target.value)}
              placeholder="IP address (e.g. 192.168.1.1)"
              className="flex-1 h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
            />
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason (optional)"
              className="flex-1 h-[36px] px-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[11px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
            />
            <button onClick={handleAdd} className="h-[36px] px-[16px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform">
              Block
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-[#555] text-[12px] py-[40px] text-center">Loading...</div>
      ) : ips.length === 0 ? (
        <div className="text-center py-[60px]">
          <Lock size={32} className="text-[#333] mx-auto mb-[12px]" />
          <div className="text-[#555] text-[12px]">No blocked IPs.</div>
        </div>
      ) : (
        <div className="rounded-[14px] border border-white/[0.08] bg-[#080808] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">IP Address</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Reason</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Blocked At</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {ips.map((ip) => (
                  <tr key={ip.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-[14px] py-[10px] text-[11px] font-mono font-medium">{ip.ip_address}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{ip.reason}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{new Date(ip.blocked_at).toLocaleString()}</td>
                    <td className="px-[14px] py-[10px]">
                      <button
                        onClick={() => handleRemove(ip.id)}
                        className="flex items-center gap-[4px] px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors"
                      >
                        <X size={11} />
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
