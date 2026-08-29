import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    try {
      const data = await api.adminUsers()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBlock = async (id) => {
    setActionLoading(id)
    try {
      await api.adminBlockUser(id)
      loadUsers()
    } catch (err) {
      console.error(err)
    } finally { setActionLoading(null) }
  }

  const handleUnblock = async (id) => {
    setActionLoading(id)
    try {
      await api.adminUnblockUser(id)
      loadUsers()
    } catch (err) {
      console.error(err)
    } finally { setActionLoading(null) }
  }

  const handleDelete = async (id, username) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return
    setActionLoading(id)
    try {
      await api.adminDeleteUser(id)
      loadUsers()
    } catch (err) {
      console.error(err)
    } finally { setActionLoading(null) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div>
          <h1 className="text-[22px] tracking-[-0.04em] font-bold">User Management</h1>
          <p className="text-[#555] text-[11px] mt-[4px]">{users.length} registered users.</p>
        </div>
        <button onClick={loadUsers} className="px-[14px] py-[8px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-[10px] font-semibold text-[#aaa] hover:bg-white/[0.08] transition-colors">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-[#555] text-[12px] py-[40px] text-center">Loading users...</div>
      ) : (
        <div className="rounded-[14px] border border-white/[0.08] bg-[#080808] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">User</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Email</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Joined</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Last Seen</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Downloads</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Status</th>
                  <th className="px-[14px] py-[10px] text-[8px] text-[#555] uppercase tracking-[0.08em] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-[14px] py-[10px]">
                      <div className="flex items-center gap-[10px]">
                        <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#333] to-[#101010] border border-[#333] flex items-center justify-center text-[10px] font-bold text-[#888]">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold">{u.username}</div>
                          {u.is_staff && <span className="text-[8px] text-[#c084fc]">STAFF</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{u.email || '—'}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td className="px-[14px] py-[10px] text-[10px] text-[#666]">{u.last_seen ? new Date(u.last_seen).toLocaleString() : 'Never'}</td>
                    <td className="px-[14px] py-[10px] text-[10px] font-semibold">{u.downloads}</td>
                    <td className="px-[14px] py-[10px]">
                      <span className={`inline-block px-[8px] py-[3px] rounded-full text-[8px] font-medium ${
                        u.is_active
                          ? 'text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20'
                          : 'text-[#f87171] bg-[#f87171]/10 border border-[#f87171]/20'
                      }`}>
                        {u.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-[14px] py-[10px]">
                      <div className="flex gap-[6px]">
                        {u.is_active ? (
                          <button
                            onClick={() => handleBlock(u.id)}
                            disabled={actionLoading === u.id}
                            className="px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-[#f87171]/30 text-[#f87171] hover:bg-[#f87171]/10 transition-colors disabled:opacity-50"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnblock(u.id)}
                            disabled={actionLoading === u.id}
                            className="px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors disabled:opacity-50"
                          >
                            Unblock
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(u.id, u.username)}
                          disabled={actionLoading === u.id}
                          className="px-[10px] py-[5px] rounded-[6px] text-[9px] font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-[14px] py-[40px] text-center text-[#555] text-[11px]">No users found.</td>
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
