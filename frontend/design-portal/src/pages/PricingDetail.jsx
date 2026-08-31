import { useParams, Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const plans = {
  free: {
    name: 'Free', price: '$0', desc: 'For developers trying out the platform.',
    features: ['100+ free designs', 'Copy source code', 'Basic frameworks', 'Community access', 'Personal projects'],
  },
  pro: {
    name: 'Pro', price: '$19', period: '/month', desc: 'For developers shipping production UIs.',
    features: ['All 2,400+ designs', 'All frameworks', 'Priority export', 'Custom themes', 'Commercial license', 'Email support'],
    featured: true,
  },
  team: {
    name: 'Team', price: '$49', period: '/month', desc: 'For teams building together.',
    features: ['Everything in Pro', 'Team workspaces', 'Custom design systems', 'Priority support', 'Admin controls', 'SSO'],
  },
}

export default function PricingDetail() {
  const { plan } = useParams()
  const p = plans[plan] || plans.pro

  return (
    <PageLayout title="">
      <div className="text-center mb-[50px]">
        <h1 className="text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.06em] font-bold">
          {p.name} <span className="text-[#858585]">Plan</span>
        </h1>
        <p className="text-[#666] text-[13px] leading-[1.7] mt-[14px] max-w-[400px] mx-auto">{p.desc}</p>
      </div>

      <div className="max-w-[440px] mx-auto">
        <div className={`p-[32px] rounded-[18px] border ${p.featured ? 'border-white/[0.10] bg-[#efefef] text-[#050505] shadow-[0_30px_80px_rgba(255,255,255,0.05)]' : 'border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]'}`}>
          <div className="text-[12px] font-bold mb-[20px]">{p.name}</div>
          <div className="text-[56px] tracking-[-0.07em] font-bold leading-none">
            {p.price}
            {p.period && <span className={`text-[12px] tracking-normal ml-[4px] ${p.featured ? 'text-[#777]' : 'text-[#656565]'}`}>{p.period}</span>}
          </div>
          <p className={`text-[11px] leading-[1.6] mt-[12px] ${p.featured ? 'text-[#555]' : 'text-[#666]'}`}>{p.desc}</p>

          <ul className="list-none mt-[28px] flex flex-col gap-[10px]">
            {p.features.map((f) => (
              <li key={f} className={`text-[11px] flex items-center gap-[8px] ${p.featured ? 'text-[#444]' : 'text-[#737373]'}`}>
                <span className="text-[#aaa]">✓</span> {f}
              </li>
            ))}
          </ul>

          <Link
            to="/signup"
            className={`mt-[28px] w-full h-[42px] flex items-center justify-center rounded-[8px] text-[11px] font-semibold transition-transform hover:-translate-y-[2px] ${
              p.featured ? 'bg-[#050505] text-white' : 'bg-white/[0.045] text-white border border-white/[0.10] hover:bg-white/[0.08]'
            }`}
          >
            {p.featured ? 'Start Free Trial' : 'Get Started'}
          </Link>
        </div>
      </div>

      <div className="text-center mt-[30px]">
        <Link to="/pricing-page" className="text-[10px] text-[#555] hover:text-white transition-colors">← Back to pricing</Link>
      </div>
    </PageLayout>
  )
}
