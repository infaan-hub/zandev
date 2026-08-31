import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Download, Shield, Activity, AlertTriangle, Lock, ExternalLink, Palette } from 'lucide-react'
import { api } from '../lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const data = await api.adminStats()
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-[#555] text-[12px] py-[60px] text-center">Loading dashboard...</div>
  }

  const cards = [
    { label: 'Total Designs', value: stats?.total_designs || 0, icon: Palette, color: '#a78bfa' },
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: '#60a5fa' },
    { label: 'Logins (24h)', value: stats?.recent_logins_24h || 0, icon: Activity, color: '#4ade80' },
    { label: 'Total Exports', value: stats?.total_exports || 0, icon: Download, color: '#c084fc' },
    { label: 'Downloads', value: stats?.total_downloads || 0, icon: Download, color: '#fbbf24' },
    { label: 'Blocked IPs', value: stats?.blocked_ips || 0, icon: Lock, color: '#f87171' },
    { label: 'Active Threats', value: stats?.active_threats || 0, icon: AlertTriangle, color: '#fb923c' },
    { label: 'Logs (48h)', value: stats?.logs_48h || 0, icon: Activity, color: '#94a3b8' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-[30px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">Overview</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">System status and key metrics.</p>
        </div>
        <div className="flex gap-[8px]">
          <a
            href="/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors"
          >
            <ExternalLink size={13} />
            Django Admin
          </a>
          <Link
            to="/admin-dashboard/security"
            className="flex items-center gap-[6px] px-[14px] py-[8px] rounded-[8px] bg-white text-black text-[10px] font-semibold hover:-translate-y-[1px] transition-transform"
          >
            <Shield size={13} />
            Run Security Scan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px] mb-[30px]">
        {cards.map((c) => (
          <div key={c.label} className="p-[18px] rounded-[14px] border border-white/[0.08] bg-[#080808]">
            <div className="flex items-center gap-[8px] mb-[12px]">
              <c.icon size={14} style={{ color: c.color }} />
              <span className="text-[#555] text-[8px] uppercase tracking-[0.08em]">{c.label}</span>
            </div>
            <div className="text-[24px] tracking-[-0.04em] font-bold">{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        <Link to="/admin-dashboard/designs" className="p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <Palette size={14} className="text-[#a78bfa]" />
            <span className="text-[12px] font-semibold">Design Management</span>
          </div>
          <p className="text-[#555] text-[10px] leading-[1.6]">Post, edit, and delete designs. Upload images and videos.</p>
          <div className="mt-[12px] text-[9px] text-[#888] font-medium">Manage designs →</div>
        </Link>
        <Link to="/admin-dashboard/logs" className="p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <Activity size={14} className="text-[#4ade80]" />
            <span className="text-[12px] font-semibold">Activity Logs</span>
          </div>
          <p className="text-[#555] text-[10px] leading-[1.6]">View all system activity. Logs auto-delete after 48 hours.</p>
          <div className="mt-[12px] text-[9px] text-[#888] font-medium">View logs →</div>
        </Link>
        <Link to="/admin-dashboard/users" className="p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <Users size={14} className="text-[#60a5fa]" />
            <span className="text-[12px] font-semibold">User Management</span>
          </div>
          <p className="text-[#555] text-[10px] leading-[1.6]">Block, unblock, or delete users. View download history.</p>
          <div className="mt-[12px] text-[9px] text-[#888] font-medium">Manage users →</div>
        </Link>
        <Link to="/admin-dashboard/security" className="p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <Shield size={14} className="text-[#c084fc]" />
            <span className="text-[12px] font-semibold">Security Scanner</span>
          </div>
          <p className="text-[#555] text-[10px] leading-[1.6]">Scan backend & frontend for vulnerabilities and threats.</p>
          <div className="mt-[12px] text-[9px] text-[#888] font-medium">Open scanner →</div>
        </Link>
        <Link to="/admin-dashboard/threats" className="p-[20px] rounded-[14px] border border-white/[0.08] bg-[#080808] hover:border-white/[0.15] transition-colors">
          <div className="flex items-center gap-[8px] mb-[8px]">
            <AlertTriangle size={14} className="text-[#fb923c]" />
            <span className="text-[12px] font-semibold">Threats & Alerts</span>
          </div>
          <p className="text-[#555] text-[10px] leading-[1.6]">Detected threats, auto-blocked IPs, and security alerts.</p>
          <div className="mt-[12px] text-[9px] text-[#888] font-medium">View threats →</div>
        </Link>
      </div>
    </div>
  )
}
