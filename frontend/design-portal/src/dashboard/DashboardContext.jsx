import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const DashboardContext = createContext(null)

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '74, 222, 128'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

const initialDownloads = [
  { id: 1, name: 'SaaS Landing Page', framework: 'React', date: '2026-08-28', size: '24 KB', category: 'Landing', version: '1.2.0', exports: 48, favorited: true },
  { id: 2, name: 'Dashboard Pro', framework: 'Next.js', date: '2026-08-27', size: '31 KB', category: 'Dashboard', version: '2.0.1', exports: 35, favorited: false },
  { id: 3, name: 'E-Commerce Kit', framework: 'Vue', date: '2026-08-26', size: '18 KB', category: 'E-Commerce', version: '1.0.3', exports: 22, favorited: true },
  { id: 4, name: 'Portfolio Starter', framework: 'React', date: '2026-08-25', size: '12 KB', category: 'Portfolio', version: '1.1.0', exports: 15, favorited: false },
  { id: 5, name: 'Blog Template', framework: 'Astro', date: '2026-08-24', size: '15 KB', category: 'Blog', version: '1.0.0', exports: 12, favorited: false },
  { id: 6, name: 'Auth Flow', framework: 'React', date: '2026-08-23', size: '8 KB', category: 'Authentication', version: '1.3.2', exports: 28, favorited: true },
  { id: 7, name: 'Pricing Table', framework: 'Svelte', date: '2026-08-22', size: '6 KB', category: 'UI Component', version: '1.0.1', exports: 9, favorited: false },
  { id: 8, name: 'Contact Form', framework: 'Next.js', date: '2026-08-21', size: '9 KB', category: 'Form', version: '1.1.0', exports: 18, favorited: false },
  { id: 9, name: 'Navigation Bar', framework: 'React', date: '2026-08-20', size: '5 KB', category: 'UI Component', version: '2.0.0', exports: 42, favorited: true },
  { id: 10, name: 'Modal Dialog', framework: 'Vue', date: '2026-08-19', size: '4 KB', category: 'UI Component', version: '1.2.1', exports: 31, favorited: false },
  { id: 11, name: 'Data Table', framework: 'React', date: '2026-08-18', size: '14 KB', category: 'Data Display', version: '1.0.0', exports: 27, favorited: false },
  { id: 12, name: 'Settings Page', framework: 'Next.js', date: '2026-08-17', size: '11 KB', category: 'Page', version: '1.0.2', exports: 14, favorited: false },
]

const initialProjects = [
  { id: 1, name: 'SaaS Client Portal', description: 'Main dashboard and landing page for enterprise client', framework: 'React', components: 24, lastUpdated: '2 hours ago', status: 'active', collaborators: 3 },
  { id: 2, name: 'E-Commerce Redesign', description: 'Product pages, cart, and checkout flow', framework: 'Next.js', components: 18, lastUpdated: 'Yesterday', status: 'active', collaborators: 1 },
  { id: 3, name: 'Internal Admin Tool', description: 'Analytics dashboard and user management', framework: 'React', components: 12, lastUpdated: '3 days ago', status: 'active', collaborators: 2 },
  { id: 4, name: 'Portfolio v2', description: 'Personal portfolio and blog redesign', framework: 'Astro', components: 8, lastUpdated: '1 week ago', status: 'paused', collaborators: 1 },
  { id: 5, name: 'Mobile App Landing', description: 'Marketing page for iOS/Android app launch', framework: 'React', components: 6, lastUpdated: '2 weeks ago', status: 'completed', collaborators: 1 },
]

const initialSettings = {
  name: '',
  username: '',
  email: '',
  bio: 'Full-stack developer building modern web apps.',
  website: 'https://github.com/developer',
  notifications: { email: true, downloads: true, updates: false, marketing: false },
  theme: 'Dark',
  accentColor: '#4ade80',
}

export function DashboardProvider({ children, user }) {
  const [downloads, setDownloads] = useState(initialDownloads)
  const [projects, setProjects] = useState(initialProjects)
  const [settings, setSettings] = useState({
    ...initialSettings,
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  })
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const toggleFavorite = useCallback((id) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, favorited: !d.favorited } : d))
    addToast('Favorite toggled')
  }, [addToast])

  const deleteDownload = useCallback((id) => {
    setDownloads(prev => prev.filter(d => d.id !== id))
    addToast('Download removed')
  }, [addToast])

  const exportDownload = useCallback((download) => {
    const blob = new Blob([
      `// ${download.name}\n// Framework: ${download.framework}\n// Version: ${download.version}\n\nexport default function Component() {\n  return (\n    <div>\n      {/* ${download.name} component */}\n    </div>\n  )\n}`
    ], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${download.name.toLowerCase().replace(/\s+/g, '-')}.jsx`
    a.click()
    URL.revokeObjectURL(url)
    setDownloads(prev => prev.map(d => d.id === download.id ? { ...d, exports: d.exports + 1 } : d))
    addToast(`${download.name} exported successfully`)
  }, [addToast])

  const createProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      components: 0,
      lastUpdated: 'Just now',
      status: 'active',
      collaborators: 1,
    }
    setProjects(prev => [newProject, ...prev])
    addToast('Project created')
    return newProject
  }, [addToast])

  const updateProject = useCallback((id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates, lastUpdated: 'Just now' } : p))
    addToast('Project updated')
  }, [addToast])

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id))
    addToast('Project deleted')
  }, [addToast])

  const duplicateProject = useCallback((project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      name: `${project.name} (Copy)`,
      lastUpdated: 'Just now',
      status: 'active',
    }
    setProjects(prev => [newProject, ...prev])
    addToast('Project duplicated')
  }, [addToast])

  const addToProject = useCallback((projectId, downloadId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, components: p.components + 1, lastUpdated: 'Just now' } : p))
    addToast('Component added to project')
  }, [addToast])

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
    addToast('Settings saved')
  }, [addToast])

  const toggleNotification = useCallback((key) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
    }))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const applyTheme = () => {
      root.classList.remove('light', 'dark')
      if (settings.theme === 'Light') {
        root.classList.add('light')
      } else if (settings.theme === 'System') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.add(prefersDark ? 'dark' : 'light')
      } else {
        root.classList.add('dark')
      }
    }
    applyTheme()
    if (settings.theme === 'System') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', applyTheme)
      return () => mq.removeEventListener('change', applyTheme)
    }
  }, [settings.theme])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--accent', settings.accentColor)
    root.style.setProperty('--accent-rgb', hexToRgb(settings.accentColor))
  }, [settings.accentColor])

  const isLight = settings.theme === 'Light' || (settings.theme === 'System' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches)

  return (
    <DashboardContext.Provider value={{
      downloads, projects, settings, toasts, isLight,
      toggleFavorite, deleteDownload, exportDownload,
      createProject, updateProject, deleteProject, duplicateProject, addToProject,
      updateSettings, toggleNotification, addToast,
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
