import PageLayout from '../components/PageLayout'

const measures = [
  { title: 'Encryption', desc: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Your code and account data are fully protected.' },
  { title: 'Infrastructure', desc: 'Hosted on AWS with SOC 2 Type II compliance. Regular penetration testing and vulnerability assessments.' },
  { title: 'Access Controls', desc: 'Role-based access, multi-factor authentication, and automated threat detection protect your account.' },
  { title: 'Data Isolation', desc: 'Your data is logically isolated from other tenants. We never access your code without explicit permission.' },
  { title: 'Backups', desc: 'Automated daily backups with 30-day retention. Full disaster recovery tested quarterly.' },
  { title: 'Compliance', desc: 'GDPR and CCPA compliant. We process data according to industry-standard privacy regulations.' },
]

export default function Security() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[60px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Security
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold">
          Your data is<br />
          <span className="text-[#858585]">safe with us.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          We take security seriously. Every layer of our platform
          is designed to protect your data and your projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] max-w-[1180px] mx-auto">
        {measures.map((m) => (
          <div key={m.title} className="p-[24px] rounded-[18px] border border-white/[0.10] bg-[#080808]">
            <div className="text-[16px] font-semibold mb-[8px]">{m.title}</div>
            <p className="text-[#666] text-[10px] leading-[1.7]">{m.desc}</p>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
