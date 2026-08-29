import { useState, useEffect } from 'react'
import { api } from '../lib/api'

const actionColors = {
  login: '#4ade80',
  logout: '#94a3b8',
  register: '#60a5fa',
  export: '#c084fc',
  view: '#666',
  block: '#f87171',
  unblock: '#4ade80',
  delete_user: '#f87171',
  threat_detected: '#fb923c',
  scan: '#c084fc',
  api_access: '#94a3b8',
}

export default function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadLogs = async () => {
    try {
      const data = await api.adminLogs()
      setLogs(data.logs || [])
    } catch (err) {
      console.error('Failed to load logs:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter)
  const actions = [...new Set(logs.map(l => l.action))]

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Activity Logs</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">All system activity. Auto-deleted after 48 hours.</p>
        </div>
        <button onClick={loadLogs} className="px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-[6px] mb-[20px]">
        <button
          onClick={() => setFilter('all')}
          className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
            filter === 'all' ? 'bg-white text-black border-white' : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
          }`}
        >
          All ({logs.length})
        </button>
        {actions.map(a => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={`px-[12px] py-[6px] rounded-full text-[9px] font-medium border transition-colors ${
              filter === a ? 'bg-white text-black border-white' : 'bg-white/[0.035] text-[#888] border-white/[0.08] hover:border-white/[0.2]'
            }`}
          >
            {a} ({logs.filter(l => l.action === a).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[#555] text-[12px] py-[40px] text-center">Loading logs...</div>
      ) : (
        <div className="rounded-[14px] border border-white/[0.08] bg-[#080808] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Time</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">User</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Action</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Detail</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-[14px] py-[10px] text-[10px] font-medium">{log.username}</td>
                    <td className="px-[14px] py-[10px]">
                      <span
                        className="inline-block px-[8px] py-[3px] rounded-full text-[8px] font-medium"
                        style={{
                          color: actionColors[log.action] || '#888',
                          backgroundColor: `${actionColors[log.action] || '#888'}15`,
                          border: `1px solid ${actionColors[log.action] || '#888'}30`,
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666] max-w-[300px] truncate">{log.detail}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#555] font-mono">{log.ip_address}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-[14px] py-[40px] text-center text-[#555] text-[11px]">No logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
