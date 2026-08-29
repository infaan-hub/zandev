import PageLayout from '../components/PageLayout'
import { useCountUp } from '../lib/useCountUp'

export default function FeaturesPage() {
  const designs = useCountUp(2400, 2200, false)
  const exports_ = useCountUp(180, 2000, false)
  const frameworks = useCountUp(12, 1500, false)

  return (
    <PageLayout title="">
      <div className="text-center mb-[80px]">
        <div className="inline-flex items-center gap-[7px] px-[10px] py-[6px] border border-white/[0.09] rounded-full bg-white/[0.025] text-[#aaa] text-[9px] font-medium mb-[22px]">
          <span className="w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          Platform Features
        </div>
        <h1 className="text-[clamp(36px,5vw,64px)] leading-[0.95] tracking-[-0.07em] font-bold max-w-[700px] mx-auto">
          Design-to-code tools<br />
          <span className="text-[#858585]">that deliver real results.</span>
        </h1>
        <p className="text-[#747474] text-[13px] leading-[1.7] mt-[20px] max-w-[480px] mx-auto">
          Browse designs, inspect production-ready source code,
          and copy components directly into your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] max-w-[920px] mx-auto mb-[80px]">
        <article className="relative p-[22px] overflow-hidden rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.045] to-white/[0.012] shadow-[inset_0_1px_rgba(255,255,255,0.03)]" style={{ minHeight: '330px' }}>
          <div className="flex justify-between items-center text-[#8a8a8a] text-[9px]">
            <span>01 / Design Browser</span>
            <span>↗</span>
          </div>
          <h3 className="mt-[30px] text-[25px] tracking-[-0.04em] leading-tight">
            Browse pixel-perfect<br />designs.
          </h3>
          <p className="text-[#666] text-[10px] leading-[1.6] max-w-[260px] mt-[8px]">
            Explore a curated library of production-ready designs. Filter by framework, style and component type.
          </p>
          <div ref={designs.ref} className="absolute left-[22px] right-[22px] bottom-[22px] grid grid-cols-3 gap-[7px]">
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Designs</div>
              <div className="mt-[8px] text-[18px] font-semibold">{designs.count.toLocaleString()}+</div>
              <div className="mt-[8px] h-[2px] rounded-full bg-gradient-to-r from-[#444] to-[#171717]" style={{ width: '70%' }} />
            </div>
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Code exports</div>
              <div className="mt-[8px] text-[18px] font-semibold">{exports_.count}K</div>
              <div className="mt-[8px] h-[2px] rounded-full bg-gradient-to-r from-[#444] to-[#171717]" style={{ width: '55%' }} />
            </div>
            <div className="p-[13px] rounded-[10px] bg-white/[0.035] border border-white/[0.055]">
              <div className="text-[#555] text-[7px]">Frameworks</div>
              <div className="mt-[8px] text-[18px] font-semibold">{frameworks.count}+</div>
              <div className="mt-[8px] h-[2px] rounded-full bg-gradient-to-r from-[#444] to-[#171717]" style={{ width: '80%' }} />
            </div>
          </div>
        </article>

        <article className="relative p-[22px] overflow-hidden rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.045] to-white/[0.012] shadow-[inset_0_1px_rgba(255,255,255,0.03)]" style={{ minHeight: '300px' }}>
          <div className="flex justify-between items-center text-[#8a8a8a] text-[9px]">
            <span>02 / Code Viewer</span>
            <span>↗</span>
          </div>
          <h3 className="mt-[30px] text-[25px] tracking-[-0.04em] leading-tight">
            See the source<br />code.
          </h3>
          <p className="text-[#666] text-[10px] leading-[1.6] max-w-[260px] mt-[8px]">
            Inspect clean, production-ready code before you copy. Built with best practices and modern patterns.
          </p>
          <div className="mt-[18px] rounded-[12px] bg-[#0a0a0a] border border-white/[0.05] p-[14px] font-mono text-[8px] leading-[1.6]">
            <div><span className="text-[#c678dd]">export</span> <span className="text-[#c678dd]">default</span> <span className="text-[#61afef]">function</span> <span className="text-[#e5c07b]">Card</span>() {'{'}</div>
            <div className="pl-3"><span className="text-[#c678dd]">return</span> &lt;<span className="text-[#e06c75]">div</span> <span className="text-[#d19a66]">className</span>=<span className="text-[#98c379]">"card"</span>&gt;...&lt;/<span className="text-[#e06c75]">div</span>&gt;</div>
            <div>{'}'}</div>
          </div>
        </article>

        <article className="relative p-[22px] overflow-hidden rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.045] to-white/[0.012] shadow-[inset_0_1px_rgba(255,255,255,0.03)]" style={{ minHeight: '300px' }}>
          <div className="flex justify-between items-center text-[#8a8a8a] text-[9px]">
            <span>03 / Copy & Paste</span>
            <span>↗</span>
          </div>
          <h3 className="mt-[30px] text-[25px] tracking-[-0.04em] leading-tight">
            Paste into your<br />project.
          </h3>
          <p className="text-[#666] text-[10px] leading-[1.6] max-w-[260px] mt-[8px]">
            One click to copy. Drop components directly into your codebase. No vendor lock-in.
          </p>
          <div className="absolute bottom-[25px] left-[25px] right-[25px] flex gap-[10px]">
            <div className="flex-1 h-[100px] rounded-[12px] bg-[#0a0a0a] border border-white/[0.05] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </div>
            <div className="flex-1 h-[100px] rounded-[12px] bg-white/[0.035] border border-white/[0.08] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
          </div>
        </article>

        <article className="relative p-[22px] overflow-hidden rounded-[18px] border border-white/[0.10] bg-gradient-to-br from-white/[0.045] to-white/[0.012] shadow-[inset_0_1px_rgba(255,255,255,0.03)]" style={{ minHeight: '300px' }}>
          <div className="flex justify-between items-center text-[#8a8a8a] text-[9px]">
            <span>04 / Smart Export</span>
            <span>↗</span>
          </div>
          <h3 className="mt-[30px] text-[25px] tracking-[-0.04em] leading-tight">
            Export ready<br />components.
          </h3>
          <p className="text-[#666] text-[10px] leading-[1.6] max-w-[260px] mt-[8px]">
            Generate production-ready components optimized for your framework and coding style.
          </p>
          <div className="absolute bottom-[28px] left-[25px] right-[25px] flex gap-[7px]">
            <span className="px-[10px] py-[6px] rounded-full border border-white/[0.09] bg-white/[0.025] text-[#aaa] text-[9px] font-medium">React</span>
            <span className="px-[10px] py-[6px] rounded-full border border-white/[0.09] bg-white/[0.025] text-[#aaa] text-[9px] font-medium">Vue</span>
            <span className="px-[10px] py-[6px] rounded-full border border-white/[0.09] bg-white/[0.025] text-[#aaa] text-[9px] font-medium">Svelte</span>
            <span className="px-[10px] py-[6px] rounded-full border border-white/[0.09] bg-white/[0.025] text-[#aaa] text-[9px] font-medium">Astro</span>
          </div>
        </article>
      </div>
    </PageLayout>
  )
}
