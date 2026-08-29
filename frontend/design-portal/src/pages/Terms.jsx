import PageLayout from '../components/PageLayout'

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using ZanDev, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.' },
  { title: 'Use of Service', content: 'ZanDev provides a design-to-code marketplace. You may browse designs, view source code, and copy components for personal and commercial use, subject to your subscription tier.' },
  { title: 'Intellectual Property', content: 'Designs and code on ZanDev are licensed to you for use in your projects. You may not redistribute, resell, or claim ownership of the original templates.' },
  { title: 'Account Responsibility', content: 'You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.' },
  { title: 'Payment Terms', content: 'Paid subscriptions are billed in advance on a monthly or annual basis. You may cancel at any time and continue using your account until the end of your billing period.' },
  { title: 'Termination', content: 'We may suspend or terminate your access if you violate these terms. You may also close your account at any time through your account settings.' },
]

export default function Terms() {
  return (
    <PageLayout title="">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold mb-[10px]">
          Terms of Service
        </h1>
        <p className="text-[#555] text-[10px] mb-[40px]">Last updated: January 15, 2026</p>

        <div className="flex flex-col gap-[30px]">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-[16px] tracking-[-0.03em] font-semibold mb-[8px]">{s.title}</h2>
              <p className="text-[#747474] text-[11px] leading-[1.8]">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
