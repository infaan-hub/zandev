import { useState } from 'react'
import { Send, Check, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/PageLayout'
import SEO from '../components/SEO'
import { api } from '../lib/api'

export default function Contact() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields')
      return
    }
    setSending(true)
    setError('')
    try {
      await api.contact(form)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <PageLayout title="">
        <SEO title="Contact" description="Questions about the design-to-code tool? Reach out to the ZanDev team." />
        <div className="max-w-[480px] mx-auto py-[96px] text-center">
          <div className="w-[64px] h-[64px] rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-[24px]">
            <Check size={28} className="text-green-400" />
          </div>
          <h2 className="text-[24px] font-bold text-white mb-[8px]">Message Sent</h2>
          <p className="text-[#666] text-[12px] mb-[32px]">We'll get back to you within 24 hours.</p>
          <button onClick={() => navigate('/')} className="px-[24px] py-[10px] rounded-[8px] bg-white text-black text-[12px] font-semibold hover:-translate-y-0.5 transition-transform">
            Back to Home
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="">
      <SEO title="Contact" description="Questions about the design-to-code tool? Reach out to the ZanDev team." />
      <div className="max-w-[560px] mx-auto py-[64px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-[8px] text-[#666] hover:text-white text-[10px] transition-colors mb-[32px]">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-[30px] font-bold text-white mb-[8px]">Contact Us</h1>
        <p className="text-[#666] text-[12px] mb-[32px]">Questions about the platform, feature requests, or bug reports? We'd love to hear from you.</p>
        
        <form onSubmit={handleSubmit} className="space-y-[20px]">
          <div className="grid grid-cols-[1fr_1fr] gap-[16px]">
            <div>
              <label className="block text-[10px] text-[#888] mb-[6px]">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full h-[40px] px-[12px] rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/20 transition-colors placeholder-[#444]"
                placeholder="Your name" />
            </div>
            <div>
              <label className="block text-[10px] text-[#888] mb-[6px]">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full h-[40px] px-[12px] rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/20 transition-colors placeholder-[#444]"
                placeholder="you@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-[#888] mb-[6px]">Subject</label>
            <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
              className="w-full h-[40px] px-[12px] rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/20 transition-colors placeholder-[#444]"
              placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-[10px] text-[#888] mb-[6px]">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6}
              className="w-full px-[12px] py-[10px] rounded-[8px] border border-white/[0.08] bg-white/[0.03] text-white text-[12px] outline-none focus:border-white/20 transition-colors resize-none placeholder-[#444]"
              placeholder="Tell us what's on your mind..." />
          </div>
          {error && <p className="text-red-400 text-[10px]">{error}</p>}
          <button type="submit" disabled={sending}
            className="flex items-center justify-center gap-[8px] w-full h-[40px] rounded-[8px] bg-white text-black text-[12px] font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-50">
            <Send size={14} /> {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </PageLayout>
  )
}
