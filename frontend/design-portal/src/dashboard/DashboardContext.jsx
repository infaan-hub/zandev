import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'

const DashboardContext = createContext(null)

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '74, 222, 128'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

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

export function DashboardProvider({ children, user: propUser }) {
  const { user: authUser } = useAuth()
  const user = propUser || authUser

  const [downloads, setDownloads] = useState([])
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState({
    ...initialSettings,
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
  })
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(true)

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchData() {
      try {
        const [downloadsData] = await Promise.allSettled([
          api.getUserDownloads(),
        ])

        if (cancelled) return

        if (downloadsData.status === 'fulfilled') {
          setDownloads(Array.isArray(downloadsData.value) ? downloadsData.value : downloadsData.value?.results || [])
        }
      } catch {
        // fallback to empty arrays
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [user])

  const toggleFavorite = useCallback((id) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, favorited: !d.favorited } : d))
    api.toggleUserDownloadFavorite(id).catch(() => {})
    addToast('Favorite toggled')
  }, [addToast])

  const deleteDownload = useCallback((id) => {
    setDownloads(prev => prev.filter(d => d.id !== id))
    api.deleteUserDownload(id).catch(() => {})
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
    setDownloads(prev => prev.map(d => d.id === download.id ? { ...d, exports: (d.exports || 0) + 1 } : d))
    addToast(`${download.name} exported successfully`)
  }, [addToast])

  const addDownload = useCallback((download) => {
    setDownloads(prev => [download, ...prev])
    if (download.id) {
      api.addUserDownload(download.id).catch(() => {})
    }
    addToast('Download added')
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

  const removeFromProject = useCallback((projectId, downloadId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, components: Math.max(0, p.components - 1), lastUpdated: 'Just now' } : p))
    addToast('Component removed from project')
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
      downloads, projects, settings, toasts, isLight, loading,
      addDownload, toggleFavorite, deleteDownload, exportDownload,
      createProject, updateProject, deleteProject, duplicateProject, addToProject, removeFromProject,
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
