import { Link } from 'react-router-dom'

export default function PageLayout({ title, children }) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center" style={{ background: 'rgba(3,3,3,0.72)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
        <div className="w-full max-w-[1180px] mx-auto px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-[9px] text-[14px] font-bold tracking-[-0.02em]">
            <span className="w-[22px] h-[22px] grid place-items-center rounded-[7px] bg-gradient-to-br from-[#303030] to-[#0a0a0a] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]">
              <span className="w-[7px] h-[7px] rounded-full bg-white opacity-80" />
            </span>
            ZanDev
          </Link>
          <nav className="hidden md:flex gap-[30px] text-[11px] font-medium text-[#888]">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="hidden md:flex items-center gap-[9px]">
            <Link to="/signin" className="text-[#aaa] text-[11px] px-3 py-[9px] hover:text-white transition-colors">Sign in</Link>
            <Link to="/signup" className="border border-white/[0.16] bg-[#f4f4f4] text-[#050505] rounded-[7px] px-[14px] py-[9px] text-[10px] font-bold">Sign up</Link>
          </div>
        </div>
      </header>
      <main className="pt-[150px] pb-[100px] min-h-screen">
        <div className="w-full max-w-[1180px] mx-auto px-5">
          <h1 className="text-[clamp(35px,5vw,56px)] leading-[0.98] tracking-[-0.06em] font-bold mb-[20px]">{title}</h1>
          {children}
        </div>
      </main>
      <footer className="border-t border-white/[0.06] py-[30px]">
        <div className="w-full max-w-[1180px] mx-auto px-5 flex justify-between text-[#444] text-[8px]">
          <span>© 2026 ZanDev. All rights reserved.</span>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
        </div>
      </footer>
    </>
  )
}
