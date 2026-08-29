import { useState } from 'react'
import PageLayout from '../components/PageLayout'

const faqs = [
  { q: 'What frameworks do you support?', a: 'We support React, Next.js, Vue, Nuxt, Svelte, Astro, and more. Each design includes code optimized for the selected framework with TypeScript support.' },
  { q: 'Can I use the code in commercial projects?', a: 'Yes. All code you copy from ZanDev is yours to use in personal and commercial projects. No attribution required.' },
  { q: 'How does the free tier work?', a: 'The free tier gives you access to 100+ designs and their source code. You can copy and paste them into your projects with no restrictions. Upgrade anytime.' },
  { q: 'How quickly can I start using designs?', a: 'Instantly. Browse the library, find a design you like, and copy the source code directly. No setup or configuration required.' },
]

export default function FaqPage() {
  const [active, setActive] = useState(null)

  return (
    <PageLayout title="">
      <div className="text-center mb-[80px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          FAQ
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold max-w-[700px] mx-auto">
          Your questions<br />
          <span className="text-[#858585]">answered.</span>
        </h1>
      </div>

      <div className="max-w-[760px] mx-auto">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border-t border-white/[0.10] cursor-pointer"
            onClick={() => setActive(active === i ? null : i)}
          >
            <div className="flex justify-between items-center py-[20px] text-[11px] font-semibold">
              <span>{faq.q}</span>
              <span className="text-[#666] text-[18px] transition-transform duration-250" style={{ transform: active === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
            </div>
            <div
              className="overflow-hidden text-[#666] text-[10px] leading-[1.7]"
              style={{
                maxHeight: active === i ? '150px' : '0',
                marginTop: active === i ? '12px' : '0',
                transition: 'max-height .3s ease, margin-top .3s ease',
              }}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
