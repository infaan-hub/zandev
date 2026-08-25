import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { label: 'Features', href: '/#features' },
  { label: 'Results', href: '/#results' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = isHome
    ? links
    : [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '/#features' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Results', href: '/#results' },
      ]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000] h-[72px] flex items-center transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(3,3,3,0.72)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.055)',
      }}
    >
      <div className="w-full max-w-[1180px] mx-auto px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-[9px] text-[14px] font-bold tracking-[-0.02em]">
          <span className="w-[22px] h-[22px] grid place-items-center rounded-[7px] bg-gradient-to-br from-[#303030] to-[#0a0a0a] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]">
            <span className="w-[7px] h-[7px] rounded-full bg-white opacity-80" />
          </span>
          ZanDev
        </Link>

        <nav className="hidden md:flex gap-[30px] text-[11px] font-medium text-[#888]">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} className="hover:text-white transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-[9px]">
          <Link to="/signin" className="text-[#aaa] text-[11px] px-3 py-[9px] hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="border border-white/[0.16] bg-[#f4f4f4] text-[#050505] rounded-[7px] px-[14px] py-[9px] text-[10px] font-bold shadow-[0_2px_10px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_16px_rgba(255,255,255,0.1)] transition-shadow"
          >
            Sign up
          </Link>
        </div>

        <button className="md:hidden text-white/70 p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden">
          <div className="max-w-[1180px] mx-auto px-5 py-4 flex flex-col gap-3">
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
                className="text-[13px] text-[#888] hover:text-white transition-colors py-2">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              <Link to="/signin" className="text-[11px] text-[#aaa] px-3 py-2">Sign in</Link>
              <Link to="/signup" className="text-[10px] font-bold px-4 py-2 rounded-[7px] bg-white text-black">Sign up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
