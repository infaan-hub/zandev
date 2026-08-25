export default function Preview() {
  return (
    <section className="relative overflow-hidden" style={{ padding: '100px 0 150px' }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.04] rounded-full pointer-events-none" style={{ width: '1000px', height: '1000px' }} />

      <div className="relative z-[2] w-full max-w-[920px] mx-auto bg-[#050505] border border-white/[0.10] rounded-[28px] p-[13px] shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="h-[31px] flex items-center gap-[5px] px-[10px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
          <span className="w-[5px] h-[5px] rounded-full bg-[#373737]" />
        </div>

        <div
          className="rounded-[20px] overflow-hidden border border-white/[0.05]"
          style={{
            minHeight: '650px',
            background: 'radial-gradient(circle at 70% 10%, rgba(255,255,255,0.06), transparent 30%), #060606',
          }}
        >
          <div className="p-[50px]" style={{ minHeight: '650px' }}>
            <div className="flex justify-between items-center text-[#777] text-[9px]">
              <strong className="text-white">ZanDev</strong>
              <span>Designs &nbsp;&nbsp; Code &nbsp;&nbsp; AI Agent</span>
            </div>

            <div className="mt-[110px] max-w-[600px]">
              <div className="text-[#555] text-[8px] mb-[14px]">
                DESIGN-TO-CODE MARKETPLACE
              </div>
              <div className="text-[48px] leading-[0.95] tracking-[-0.06em] font-bold">
                Browse. Copy.<span className="text-[#555]"> Ship.</span>
              </div>
              <p className="text-[#666] text-[10px] leading-[1.6] max-w-[370px] mt-[18px]">
                Browse production-ready designs, inspect the source code,
                and paste components directly into your project.
              </p>
              <div className="flex gap-[8px] mt-[22px]">
                <span className="inline-flex items-center justify-center min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold bg-white text-black border border-white/[0.1]">
                  Browse designs
                </span>
                <span className="inline-flex items-center justify-center min-h-[38px] px-[17px] rounded-[8px] text-[10px] font-semibold bg-white/[0.035] text-[#bbb] border border-white/[0.1]">
                  View source
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
