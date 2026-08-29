import { Link } from 'react-router-dom'

export default function Pricing() {
  const plans = [
    { name: 'Free', price: '$0', desc: 'For developers trying out the platform.', features: ['100+ free designs', 'Copy source code', 'Basic frameworks', 'Community access'], featured: false, slug: 'free' },
    { name: 'Pro', price: '$19', period: '/month', desc: 'For developers shipping production UIs.', features: ['All 2,400+ designs', 'All frameworks', 'Priority export', 'Custom themes'], featured: true, slug: 'pro' },
    { name: 'Team', price: '$49', period: '/month', desc: 'For teams building together.', features: ['Everything in Pro', 'Team workspaces', 'Custom design systems', 'Priority support'], featured: false, slug: 'team' },
  ]

  return (
    <section className="relative" style={{ padding: '130px 0' }} id="pricing">
      <div className="w-full max-w-[1180px] mx-auto px-5">
        <div className="text-[#707070] text-[9px] font-semibold uppercase tracking-[0.15em] mb-[16px]">
          Pricing
        </div>
        <h2 className="text-[clamp(35px,5vw,64px)] leading-[0.98] tracking-[-0.06em] max-w-[700px]">
          Flexible pricing<br />
          <span className="text-[#626262]">for every business.</span>
        </h2>
        <p className="mt-[20px] max-w-[470px] text-[#747474] text-[12px] leading-[1.7]">
          Start for free and upgrade when you need more
          powerful features and capabilities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mt-[50px]">
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
      </div>
    </section>
  )
}
