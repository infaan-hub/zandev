export default function Testimonials() {
  const testimonials = [
    { quote: 'ZanDev saved me hours of UI work. I found a landing page design, copied the code, and had it running in my Next.js project in under 5 minutes.', name: 'Sarah Chen', role: 'Frontend Developer' },
    { quote: 'The code quality is excellent. Clean, well-structured components that follow best practices. Not just screenshots — real production code.', name: 'Marcus Rivera', role: 'Full-Stack Engineer' },
    { quote: 'The design library keeps growing and every template is production-ready. Best investment for our team\'s velocity.', name: 'Priya Sharma', role: 'Tech Lead' },
  ]

  return (
    <section className="relative" style={{ padding: '130px 0' }}>
      <div className="w-full max-w-[1180px] mx-auto px-5">
        <div className="text-[#707070] text-[9px] font-semibold uppercase tracking-[0.15em] mb-[16px]">
          Testimonials
        </div>
        <h2 className="text-[clamp(35px,5vw,64px)] leading-[0.98] tracking-[-0.06em] max-w-[700px]">
          What developers<br />
          <span className="text-[#626262]">say about us.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] mt-[50px]">
          {testimonials.map((t) => (
            <article key={t.name} className="min-h-[230px] p-[22px] border border-white/[0.10] rounded-[18px] bg-[#080808]">
              <div className="tracking-[2px] text-[#999] text-[9px]">★★★★★</div>
              <p className="mt-[25px] text-[#8a8a8a] text-[11px] leading-[1.7]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-[10px] mt-[30px]">
                <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#333] to-[#101010] border border-[#333]" />
                <div>
                  <div className="text-[9px] font-semibold">{t.name}</div>
                  <div className="mt-[2px] text-[#555] text-[7px]">{t.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
