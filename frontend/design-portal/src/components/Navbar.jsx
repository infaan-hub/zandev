import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
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
          <button onClick={() => setSidebarOpen(true)} className="text-[#888] hover:text-white transition-colors">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
