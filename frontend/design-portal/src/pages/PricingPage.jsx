import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout'

const plans = [
  { name: 'Free', price: '$0', desc: 'For developers trying out the platform.', features: ['100+ free designs', 'Copy source code', 'Basic frameworks', 'Community access'], featured: false, slug: 'free' },
  { name: 'Pro', price: '$19', period: '/month', desc: 'For developers shipping production UIs.', features: ['All 2,400+ designs', 'All frameworks', 'Priority export', 'Custom themes'], featured: true, slug: 'pro' },
  { name: 'Team', price: '$49', period: '/month', desc: 'For teams building together.', features: ['Everything in Pro', 'Team workspaces', 'Custom design systems', 'Priority support'], featured: false, slug: 'team' },
]

export default function PricingPage() {
  return (
    <PageLayout title="">
      <div className="text-center mb-[80px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Pricing
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold max-w-[700px] mx-auto">
          Flexible pricing<br />
          <span className="text-[#858585]">for every business.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          Start for free and upgrade when you need more
          powerful features and capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] max-w-[920px] mx-auto">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative p-[24px] min-h-[350px] flex flex-col rounded-[18px] border ${
              plan.featured
                ? 'border-white/[0.10] bg-[#efefef] text-[#050505] -translate-y-[7px] shadow-[0_30px_80px_rgba(255,255,255,0.05)]'
                : 'border-white/[0.10] bg-gradient-to-br from-white/[0.035] to-white/[0.008]'
            }`}
          >
            <div className="text-[10px] font-bold">{plan.name}</div>
            <div className="mt-[28px] text-[45px] tracking-[-0.07em] font-bold">
              {plan.price}
              {plan.period && (
                <span className={`text-[10px] tracking-normal ${plan.featured ? 'text-[#777]' : 'text-[#656565]'}`}>
                  {plan.period}
                </span>
              )}
            </div>
            <p className={`text-[9px] leading-[1.6] mt-[8px] ${plan.featured ? 'text-[#555]' : 'text-[#666]'}`}>
              {plan.desc}
            </p>
            <ul className="list-none mt-[25px] flex flex-col gap-[9px]">
              {plan.features.map((f) => (
                <li key={f} className={`text-[9px] ${plan.featured ? 'text-[#444]' : 'text-[#737373]'}`}>
                  <span className="text-[#aaa] mr-[7px]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={`/pricing/${plan.slug}`}
              className={`mt-auto w-full h-[37px] flex items-center justify-center rounded-[8px] text-[9px] font-semibold border transition-colors ${
                plan.featured
                  ? 'bg-[#050505] text-white border-[#050505]'
                  : 'bg-white/[0.045] text-white border-white/[0.10] hover:bg-white/[0.08]'
              }`}
            >
              {plan.featured ? 'Start Free Trial' : 'Get Started'}
            </Link>
          </article>
        ))}
      </div>
    </PageLayout>
  )
}
