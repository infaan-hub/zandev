import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Shield, Activity, Users, Lock, AlertTriangle, LayoutDashboard, ExternalLink, Palette } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

const navItems = [
  { label: 'Overview', href: '/admin-dashboard', icon: LayoutDashboard },
  { label: 'Designs', href: '/admin-dashboard/designs', icon: Palette },
  { label: 'Activity Logs', href: '/admin-dashboard/logs', icon: Activity },
  { label: 'Users', href: '/admin-dashboard/users', icon: Users },
  { label: 'Security', href: '/admin-dashboard/security', icon: Shield },
  { label: 'Threats', href: '/admin-dashboard/threats', icon: AlertTriangle },
  { label: 'Blocked IPs', href: '/admin-dashboard/blocked-ips', icon: Lock },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    const adminAuth = localStorage.getItem('admin_auth') === 'true'
    const isStaff = user && (user.is_staff || user.is_superuser)
    if (!adminAuth && !isStaff) {
      navigate('/admin-login')
    }
  }, [navigate, loading, user])

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/admin-login')
  }

  return (
    <div className="min-h-screen bg-[#030303] flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-[240px] bg-[#080808] border-r border-white/[0.06] z-[100] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-[20px] border-b border-white/[0.06]">
          <Link to="/admin-dashboard" className="flex items-center gap-[9px] text-[14px] font-bold tracking-[-0.02em]">
            <span className="w-[22px] h-[22px] grid place-items-center rounded-[7px] bg-gradient-to-br from-[#303030] to-[#0a0a0a] border border-white/[0.15]">
              <span className="w-[7px] h-[7px] rounded-full bg-red-500 opacity-80" />
            </span>
            ZanDev Admin
          </Link>
        </div>

        <nav className="flex-1 p-[12px] flex flex-col gap-[2px]">
          {navItems.map((item) => {
            const active = location.pathname === item.href || (item.href !== '/admin-dashboard' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium transition-colors ${
                  active ? 'bg-white/[0.08] text-white' : 'text-[#666] hover:text-[#aaa] hover:bg-white/[0.03]'
                }`}
              >
                <item.icon size={15} strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-[12px] border-t border-white/[0.06] flex flex-col gap-[6px]">
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium text-[#666] hover:text-[#aaa] hover:bg-white/[0.03] transition-colors"
          >
            <ExternalLink size={15} strokeWidth={1.5} />
            Django Admin
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] text-[11px] font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[99] lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-[240px] min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-[50] h-[52px] flex items-center px-[20px] border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-[12px]">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-[12px] text-[#666] hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <div className="text-[11px] text-[#555]">Admin Dashboard</div>
        </header>

        <main className="p-[20px] lg:p-[30px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
