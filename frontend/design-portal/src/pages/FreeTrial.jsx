import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import PageLayout from '../components/PageLayout'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

export default function FreeTrial() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('All fields are required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await api.register({ username: name, email, password })
      localStorage.setItem('token', res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 250px)' }}>
        <div className="w-full max-w-[700px] text-center">
          <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
            <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
            14-day free trial
          </div>

          <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
            Start building with<br />
            <span className="text-[#858585]">clean, exportable code.</span>
          </h1>

          <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
            No credit card required. Get instant access to 2,400+ design
            components, full source code, and all supported frameworks. Cancel anytime.
          </p>

          <div className="max-w-[400px] mx-auto mt-[40px]">
            <form onSubmit={handleSubmit} className="space-y-[16px] text-left">
              <div>
                <label className="block text-[10px] text-[#888] mb-[6px]">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] mb-[6px]">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                  placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-[10px] text-[#888] mb-[6px]">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                  placeholder="At least 6 characters" />
              </div>
              {error && (
                <div className="p-[10px] rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full h-[42px] flex items-center justify-center rounded-[8px] text-[11px] font-semibold bg-white text-black hover:-translate-y-[2px] transition-transform disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Start Free Trial'}
              </button>
            </form>
            <p className="text-center text-[11px] text-[#555] mt-[16px]">
              Already have an account? <Link to="/signin" className="text-white hover:underline">Sign in</Link>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mt-[60px]">
            {[
              { title: '2,400+ Designs', desc: 'Production-ready templates across all frameworks.' },
              { title: 'Source Code', desc: 'View and copy clean, well-structured code.' },
              { title: 'No Limits', desc: 'Use in personal and commercial projects.' },
            ].map((f) => (
              <div key={f.title} className="p-[22px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008] text-left">
                <div className="text-[14px] font-semibold mb-[6px]">{f.title}</div>
                <div className="text-[#666] text-[10px] leading-[1.6]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
