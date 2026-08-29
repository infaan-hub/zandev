import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      navigate('/admin-dashboard', { replace: true })
    }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin-auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.setItem('admin_auth', 'true')
        navigate('/admin-dashboard', { replace: true })
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Cannot reach server. Make sure backend is running on port 8000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-5">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-[40px]">
          <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
            <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            System Access
          </div>
          <h1 className="text-[clamp(28px,5vw,40px)] leading-[0.95] tracking-[-0.06em] font-bold">
            Admin <span className="text-[#858585]">Panel</span>
          </h1>
          <p className="text-[#666] text-[11px] leading-[1.7] mt-[12px]">
            Authorized personnel only.
          </p>
        </div>

        <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
          {error && (
            <div className="mb-[16px] p-[12px] rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] leading-[1.5]">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-[16px]">
              <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
                className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
            <div className="mb-[20px]">
              <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[40px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-[2px] transition-transform duration-200 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
