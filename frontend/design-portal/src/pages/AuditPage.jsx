import { useState, useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import { api } from '../lib/api'

function Stat({ label, value, sub }) {
  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
      <div className="text-[22px] font-bold text-white">{value}</div>
      <div className="text-[10px] text-[#888] mt-1">{label}</div>
      {sub && <div className="text-[9px] text-[#555] mt-0.5">{sub}</div>}
    </div>
  )
}

function MiniChart({ data, color = '#4ade80' }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div className="flex items-end gap-[2px] h-[40px]">
      {data.map((d, i) => (
        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{
          height: `${(d.count / max) * 100}%`,
          backgroundColor: d.count > 0 ? color : 'rgba(255,255,255,0.03)',
          minHeight: d.count > 0 ? '2px' : '0',
        }} />
      ))}
    </div>
  )
}

function ActionBadge({ action }) {
  const colors = {
    login: 'bg-green-500/15 text-green-400',
    register: 'bg-blue-500/15 text-blue-400',
    signup: 'bg-blue-500/15 text-blue-400',
    export: 'bg-yellow-500/15 text-yellow-400',
    design_export: 'bg-yellow-500/15 text-yellow-400',
    view: 'bg-purple-500/15 text-purple-400',
    design_view: 'bg-purple-500/15 text-purple-400',
    block: 'bg-red-500/15 text-red-400',
    create_design: 'bg-cyan-500/15 text-cyan-400',
    delete_design: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-[8px] font-semibold ${colors[action] || 'bg-white/[0.06] text-[#888]'}`}>
      {action.replace(/_/g, ' ')}
    </span>
  )
}

function TimeAgo({ timestamp }) {
  const d = new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60) return <span>{diff}s ago</span>
  if (diff < 3600) return <span>{Math.floor(diff / 60)}m ago</span>
  if (diff < 86400) return <span>{Math.floor(diff / 3600)}h ago</span>
  return <span>{Math.floor(diff / 86400)}d ago</span>
}

export default function AuditPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    api.getAudit()
      .then(d => setData(d))
      .catch(e => console.error('Failed to load audit:', e))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <PageLayout title="">
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#4ade80] animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (!data) {
    return (
      <PageLayout title="">
        <div className="text-center py-32 text-[#555] text-[12px]">Failed to load audit data</div>
      </PageLayout>
    )
  }

  const { summary, logins_by_day, signups_by_day, active_users, recent_logins, recent_signups, recent_exports, recent_views, all_activity } = data

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'logins', label: 'Logins' },
    { id: 'signups', label: 'Signups' },
    { id: 'exports', label: 'Exports' },
    { id: 'activity', label: 'All Activity' },
  ]

  return (
    <PageLayout title="">
      <div className="mb-6">
        <h1 className="text-[22px] tracking-[-0.04em] font-bold">Audit</h1>
        <p className="text-[#555] text-[11px] mt-1">Real user login and activity data.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-lg p-0.5 mb-6 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
              tab === t.id ? 'bg-[#4ade80] text-black' : 'text-[#888] hover:text-white hover:bg-white/[0.05]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total Users" value={summary.total_users} />
            <Stat label="Logins (7d)" value={summary.logins_7d} sub={`${summary.logins_30d} this month`} />
            <Stat label="Signups (7d)" value={summary.signups_7d} sub={`${summary.signups_30d} this month`} />
            <Stat label="Exports (7d)" value={summary.exports_7d} sub={`${summary.exports_30d} this month`} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
              <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Logins (30 days)</div>
              <MiniChart data={logins_by_day} color="#4ade80" />
            </div>
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
              <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Signups (30 days)</div>
              <MiniChart data={signups_by_day} color="#60a5fa" />
            </div>
          </div>

          {/* Active Users */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Active Users (7 days)</div>
            {active_users.length === 0 ? (
              <div className="text-[11px] text-[#444]">No active users in the last 7 days</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {active_users.map(u => (
                  <div key={u.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <div className="w-5 h-5 rounded-full bg-[#4ade80]/20 flex items-center justify-center text-[8px] font-bold text-[#4ade80]">
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-[11px] text-white">{u.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Recent Activity</div>
            <div className="space-y-1">
              {all_activity.slice(0, 15).map(a => (
                <div key={a.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <ActionBadge action={a.action} />
                  <span className="text-[11px] text-white flex-1">{a.username}</span>
                  {a.detail && <span className="text-[10px] text-[#555] max-w-[200px] truncate">{a.detail}</span>}
                  <span className="text-[9px] text-[#444]"><TimeAgo timestamp={a.timestamp} /></span>
                </div>
              ))}
              {all_activity.length === 0 && (
                <div className="text-[11px] text-[#444] py-4 text-center">No activity recorded yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'logins' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Logins (30 days)</div>
            <MiniChart data={logins_by_day} color="#4ade80" />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">User</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">IP</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Browser</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_logins.map(l => (
                    <tr key={l.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#4ade80]/15 flex items-center justify-center text-[9px] font-bold text-[#4ade80]">
                            {l.username?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[11px] text-white">{l.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-[#888] font-mono">{l.ip_address || '-'}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#666] max-w-[200px] truncate">{l.user_agent || '-'}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#555]"><TimeAgo timestamp={l.timestamp} /></td>
                    </tr>
                  ))}
                  {recent_logins.length === 0 && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-[11px] text-[#444]">No logins recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'signups' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.025]">
            <div className="text-[10px] text-[#555] uppercase tracking-wider font-medium mb-3">Signups (30 days)</div>
            <MiniChart data={signups_by_day} color="#60a5fa" />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">User</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">IP</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_signups.map(s => (
                    <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/15 flex items-center justify-center text-[9px] font-bold text-blue-400">
                            {s.username?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-[11px] text-white">{s.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-[#888] font-mono">{s.ip_address || '-'}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#555]"><TimeAgo timestamp={s.timestamp} /></td>
                    </tr>
                  ))}
                  {recent_signups.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-[11px] text-[#444]">No signups recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'exports' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">User</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Design</th>
                    <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_exports.map(e => (
                    <tr key={e.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 text-[11px] text-white">{e.username}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#888]">{e.design_name || `Design #${e.design_id}`}</td>
                      <td className="px-4 py-2.5 text-[10px] text-[#555]"><TimeAgo timestamp={e.timestamp} /></td>
                    </tr>
                  ))}
                  {recent_exports.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-8 text-center text-[11px] text-[#444]">No exports recorded</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Action</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">User</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Detail</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">IP</th>
                  <th className="px-4 py-2.5 text-[8px] text-[#555] uppercase tracking-wider font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {all_activity.map(a => (
                  <tr key={a.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5"><ActionBadge action={a.action} /></td>
                    <td className="px-4 py-2.5 text-[11px] text-white">{a.username}</td>
                    <td className="px-4 py-2.5 text-[10px] text-[#666] max-w-[250px] truncate">{a.detail || '-'}</td>
                    <td className="px-4 py-2.5 text-[10px] text-[#888] font-mono">{a.ip_address || '-'}</td>
                    <td className="px-4 py-2.5 text-[10px] text-[#555]"><TimeAgo timestamp={a.timestamp} /></td>
                  </tr>
                ))}
                {all_activity.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-[11px] text-[#444]">No activity recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
