import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import PageLayout from '../components/PageLayout'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('email') // email | reset
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.requestPasswordReset({ email })
      if (res.token) {
        setToken(res.token)
        setUserId(res.user_id)
        setStep('reset')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await api.confirmPasswordReset({ token, password, user_id: userId })
      setSuccess(true)
      setStep('done')
    } catch (err) {
      setError(err.message || 'Something went wrong')
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
              Reset Password
            </div>
            <h1 className="text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
              {step === 'email' ? 'Forgot your password?' : step === 'reset' ? 'Set new password' : 'Password reset!'}
            </h1>
            <p className="text-[#666] text-[12px] leading-[1.7] mt-[14px] max-w-[300px] mx-auto">
              {step === 'email'
                ? 'Enter your email and we\'ll send you a reset link.'
                : step === 'reset'
                ? 'Enter your new password below.'
                : 'Your password has been reset successfully.'}
            </p>
          </div>

          <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
            {error && (
              <div className="mb-[16px] p-[12px] rounded-[8px] bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                {error}
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleRequestReset}>
                <div className="mb-[20px]">
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[40px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-[2px] transition-transform duration-200 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-[16px]">
                  <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">New Password</label>
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
                <div className="mb-[20px]">
                  <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {step === 'done' && (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#4ade80]/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p className="text-[12px] text-[#888] mb-6">Your password has been reset successfully.</p>
                <Link to="/signin" className="inline-block w-full h-[40px] rounded-[8px] bg-white text-black text-[11px] font-semibold leading-[40px] hover:-translate-y-[2px] transition-transform duration-200">
                  Sign In
                </Link>
              </div>
            )}

            <div className="mt-[20px] text-center text-[10px] text-[#555]">
              <Link to="/signin" className="text-white hover:underline">← Back to Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
