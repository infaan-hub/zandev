import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { Sparkles, BarChart3, CreditCard, HelpCircle, LogIn, UserPlus, Home, X, LayoutDashboard } from 'lucide-react'

const links = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Features', href: '/features', icon: Sparkles },
  { label: 'Results', href: '/results-stats', icon: BarChart3 },
  { label: 'Pricing', href: '/pricing-page', icon: CreditCard },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
]

export default function Sidebar({ open, onClose }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <>
      {open && <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 z-[1200] h-full w-[260px] bg-[#050505] border-r border-white/[0.06] transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-[72px] border-b border-white/[0.06]">
          <Link to="/" onClick={onClose} className="flex items-center gap-[9px] text-[14px] font-bold tracking-[-0.02em]">
            <span className="w-[22px] h-[22px] grid place-items-center rounded-[7px] bg-gradient-to-br from-[#303030] to-[#0a0a0a] border border-white/[0.15] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]">
              <span className="w-[7px] h-[7px] rounded-full bg-white opacity-80" />
            </span>
            ZanDev
          </Link>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-[2px] px-3 py-4">
          {links.map((l) => {
            const Icon = l.icon
            const active = location.pathname === l.href || (l.href !== '/' && location.hash === l.href.replace('/', ''))
            return (
              <Link
                key={l.href}
                to={l.href}
                onClick={onClose}
                className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium transition-colors ${
                  active ? 'bg-white/[0.06] text-white' : 'text-[#888] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.06] p-3">
          {user ? (
            <div className="flex flex-col gap-[2px]">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium text-[#888] hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                <LayoutDashboard size={15} strokeWidth={1.5} />
                Dashboard
              </Link>
              <div className="px-[12px] py-[10px] text-[11px] text-[#aaa]">
                Signed in as <span className="text-white font-medium">{user.name || user.username}</span>
              </div>
              <button
                onClick={() => { logout(); onClose() }}
                className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium text-[#888] hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                <LogIn size={15} strokeWidth={1.5} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[2px]">
              <Link
                to="/signin"
                onClick={onClose}
                className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium text-[#888] hover:text-white hover:bg-white/[0.03] transition-colors"
              >
                <LogIn size={15} strokeWidth={1.5} />
                Sign in
              </Link>
              <Link
                to="/signup"
                onClick={onClose}
                className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium bg-white text-black hover:bg-white/90 transition-colors"
              >
                <UserPlus size={15} strokeWidth={1.5} />
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
