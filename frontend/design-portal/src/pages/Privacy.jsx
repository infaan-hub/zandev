import PageLayout from '../components/PageLayout'

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly, such as your name, email address, and payment information when you create an account. We also collect usage data including pages visited, designs browsed, and code exports.' },
  { title: 'How We Use Your Information', content: 'We use your information to provide and improve our services, process transactions, send you updates about your account, and communicate about new features and promotions.' },
  { title: 'Information Sharing', content: 'We do not sell your personal information. We may share data with trusted service providers who help us operate our platform, and as required by law.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data.' },
  { title: 'Cookies', content: 'We use essential cookies to maintain your session and preferences. Analytics cookies help us understand how our platform is used.' },
  { title: 'Your Rights', content: 'You can access, update, or delete your personal information at any time through your account settings. You can also request a copy of all data we hold about you.' },
]

export default function Privacy() {
  return (
    <PageLayout title="">
      <div className="max-w-[700px] mx-auto">
        <h1 className="text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold mb-[10px]">
          Privacy Policy
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
