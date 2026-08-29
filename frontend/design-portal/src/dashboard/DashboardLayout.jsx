import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { DashboardProvider, useDashboard } from './DashboardContext'
import Toast from './Toast'
import { LayoutDashboard, Download, FolderOpen, BarChart3, Settings, LogOut, Menu, X, Zap } from 'lucide-react'

const nav = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function DashboardContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { settings } = useDashboard()

  const isLight = settings.theme === 'Light' || (settings.theme === 'System' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches)

  return (
    <div className={`flex h-screen transition-colors duration-300 ${isLight ? 'bg-[#fafafa] text-[#1a1a1a]' : 'bg-[#030303] text-white'}`}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-[1200] h-full w-[240px] border-r transition-all duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isLight ? 'bg-white border-black/[0.06]' : 'bg-[#050505] border-white/[0.06]'}`}>
        <div className={`flex items-center justify-between px-5 h-[60px] border-b ${isLight ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
          <Link to="/" className="flex items-center gap-[9px] text-[14px] font-bold tracking-[-0.02em]">
            <span className="w-[22px] h-[22px] grid place-items-center rounded-[7px] border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" style={{ background: settings.accentColor, borderColor: `${settings.accentColor}40` }}>
              <span className="w-[7px] h-[7px] rounded-full bg-white opacity-90" />
            </span>
            ZanDev
          </Link>
          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden ${isLight ? 'text-[#666] hover:text-[#1a1a1a]' : 'text-[#666] hover:text-white'}`}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-[2px] px-3 py-4">
          {nav.map((l) => {
            const Icon = l.icon
            const active = location.pathname === l.href
            return (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium transition-colors ${
                  active
                    ? `text-white`
                    : isLight ? 'text-[#666] hover:text-[#1a1a1a] hover:bg-black/[0.03]' : 'text-[#888] hover:text-white hover:bg-white/[0.03]'
                }`}
                style={active ? { background: settings.accentColor, color: isLight ? '#fff' : '#fff' } : {}}
              >
                <Icon size={15} strokeWidth={1.5} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 border-t p-3 ${isLight ? 'border-black/[0.06]' : 'border-white/[0.06]'}`}>
          <div className={`px-[12px] py-[10px] text-[11px] ${isLight ? 'text-[#666]' : 'text-[#aaa]'}`}>
            Signed in as <span className={isLight ? 'text-[#1a1a1a] font-medium' : 'text-white font-medium'}>{user?.name || user?.username || 'Developer'}</span>
          </div>
          <button
            onClick={logout}
            className={`flex items-center gap-[10px] w-full px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium transition-colors ${isLight ? 'text-[#666] hover:text-[#1a1a1a] hover:bg-black/[0.03]' : 'text-[#888] hover:text-white hover:bg-white/[0.03]'}`}
          >
            <LogOut size={15} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className={`sticky top-0 z-[100] h-[60px] flex items-center justify-between px-5 border-b backdrop-blur-xl ${isLight ? 'border-black/[0.06] bg-[#fafafa]/80' : 'border-white/[0.06] bg-[#030303]/80'}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden ${isLight ? 'text-[#666] hover:text-[#1a1a1a]' : 'text-[#888] hover:text-white'}`}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-[12px]">
            <Link to="/tools" className="flex items-center gap-[6px] px-[12px] py-[7px] rounded-[8px] text-[10px] font-semibold transition-colors border" style={{ background: `${settings.accentColor}15`, color: settings.accentColor, borderColor: `${settings.accentColor}25` }}>
              <Zap size={12} />
              Browse Designs
            </Link>
            <div className="w-[32px] h-[32px] rounded-full border grid place-items-center text-[11px] font-bold" style={{ background: `${settings.accentColor}20`, borderColor: `${settings.accentColor}30`, color: settings.accentColor }}>
              {(user?.name || user?.username || 'D')[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-8">
          <Outlet />
        </div>
      </main>

      <Toast />
    </div>
  )
}

export default function DashboardLayout() {
  const { user } = useAuth()
  return (
    <DashboardProvider user={user}>
      <DashboardContent />
    </DashboardProvider>
  )
}
