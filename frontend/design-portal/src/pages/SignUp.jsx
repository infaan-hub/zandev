import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { api } from '../lib/api'
import PageLayout from '../components/PageLayout'

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function SignUp() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, setUser } = useAuth()
  const navigate = useNavigate()

  const handleGoogleCallback = (response) => {
    setLoading(true)
    api.googleLogin(response.credential)
      .then(res => {
        localStorage.setItem('token', res.token)
        setUser(res.user)
        navigate('/dashboard')
      })
      .catch(err => setError(err.message || 'Google login failed'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%', text: 'continue_with' }
        )
      }
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      setLoading(true)
      api.githubLogin(code)
        .then(res => {
          localStorage.setItem('token', res.token)
          setUser(res.user)
          navigate('/dashboard')
        })
        .catch(err => setError(err.message || 'GitHub login failed'))
        .finally(() => setLoading(false))
      window.history.replaceState({}, '', '/signup')
    }
  }, [navigate, setUser])

  const handleGitHubLogin = () => {
    const redirectUri = window.location.origin + '/signup'
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
    window.location.href = url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, username, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout title="">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 250px)' }}>
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-[40px]">
            <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
              <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
              Get started free
            </div>
            <h1 className="text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
              Create your <span className="text-[#858585]">account</span>
            </h1>
            <p className="text-[#666] text-[12px] leading-[1.7] mt-[14px] max-w-[300px] mx-auto">
              Start browsing 2,400+ design components with full source code today.
            </p>
          </div>

          <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
            <div id="google-signin-btn" className="w-full h-[40px]"></div>

            <button onClick={handleGitHubLogin} className="w-full h-[40px] mt-[8px] rounded-[8px] border border-white/[0.10] bg-[#24292e] text-white text-[11px] font-semibold flex items-center justify-center gap-[8px] hover:-translate-y-[2px] transition-transform duration-200">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {loading ? 'Connecting...' : 'Continue with GitHub'}
            </button>

            <div className="flex items-center gap-[12px] my-[20px]">
              <div className="flex-1 h-[1px] bg-white/[0.08]" />
              <span className="text-[#555] text-[9px]">or</span>
              <div className="flex-1 h-[1px] bg-white/[0.08]" />
            </div>
            {error && (
              <div className="mb-[16px] p-[12px] rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-[16px]">
                <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                />
              </div>
              <div className="mb-[16px]">
                <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                />
              </div>
              <div className="mb-[16px]">
                <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  required
                  minLength={6}
                  className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[40px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-[2px] transition-transform duration-200 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-[20px] text-center text-[10px] text-[#555]">
              Already have an account?{' '}
              <Link to="/signin" className="text-white hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
