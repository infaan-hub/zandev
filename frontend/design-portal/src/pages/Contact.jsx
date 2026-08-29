import { useState } from 'react'
import PageLayout from '../components/PageLayout'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Contact Us
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Get in <span className="text-[#858585]">touch.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[400px] mx-auto">
          Have a question, feedback, or partnership inquiry?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="max-w-[500px] mx-auto">
        <div className="p-[28px] rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-[16px]">
              <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
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
                className="w-full h-[40px] px-[14px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors"
              />
            </div>
            <div className="mb-[20px]">
              <label className="block text-[#888] text-[9px] font-semibold uppercase tracking-[0.1em] mb-[8px]">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                rows={5}
                className="w-full px-[14px] py-[12px] rounded-[8px] border border-white/[0.10] bg-white/[0.035] text-white text-[12px] placeholder-[#555] outline-none focus:border-white/[0.25] transition-colors resize-none"
              />
            </div>
            <button className="w-full h-[40px] rounded-[8px] bg-white text-black text-[11px] font-semibold hover:-translate-y-[2px] transition-transform duration-200">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
