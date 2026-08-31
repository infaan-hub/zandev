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
        <SEO title="Contact" description="Get in touch with the ZanDev team" />
        <div className="max-w-[480px] mx-auto py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Message Sent</h2>
          <p className="text-[#666] text-sm mb-8">We'll get back to you within 24 hours.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:-translate-y-0.5 transition-transform">
            Back to Home
          </button>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="">
      <SEO title="Contact" description="Get in touch with the ZanDev team" />
      <div className="max-w-[560px] mx-auto py-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#666] hover:text-white text-xs transition-colors mb-8">
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-[#666] text-sm mb-8">Have a question or feedback? We'd love to hear from you.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#888] mb-1.5">Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full h-10 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm outline-none focus:border-white/20 transition-colors placeholder-[#444]"
                placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs text-[#888] mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full h-10 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm outline-none focus:border-white/20 transition-colors placeholder-[#444]"
                placeholder="you@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Subject</label>
            <input type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
              className="w-full h-10 px-3 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm outline-none focus:border-white/20 transition-colors placeholder-[#444]"
              placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm outline-none focus:border-white/20 transition-colors resize-none placeholder-[#444]"
              placeholder="Tell us what's on your mind..." />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={sending}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-white text-black text-sm font-semibold hover:-translate-y-0.5 transition-transform disabled:opacity-50">
            <Send size={14} /> {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </PageLayout>
  )
}
