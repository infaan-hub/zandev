import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import FreeTrial from './pages/FreeTrial'
import Demo from './pages/Demo'
import Tools from './pages/Tools'
import DesignDetail from './pages/DesignDetail'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Security from './pages/Security'
import Analytics from './pages/Analytics'
import Rankings from './pages/Rankings'
import PricingDetail from './pages/PricingDetail'
import Results from './pages/Results'
import FeaturesPage from './pages/FeaturesPage'
import ResultsPage from './pages/ResultsPage'
import PricingPage from './pages/PricingPage'
import FaqPage from './pages/FaqPage'
import DashboardLayout from './dashboard/DashboardLayout'
import DashboardOverview from './dashboard/DashboardOverview'
import DashboardDownloads from './dashboard/DashboardDownloads'
import DashboardProjects from './dashboard/DashboardProjects'
import DashboardAnalytics from './dashboard/DashboardAnalytics'
import DashboardSettings from './dashboard/DashboardSettings'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminLogs from './admin/AdminLogs'
import AdminUsers from './admin/AdminUsers'
import AdminSecurity from './admin/AdminSecurity'
import AdminThreats from './admin/AdminThreats'
import AdminBlockedIPs from './admin/AdminBlockedIPs'
import AdminDesigns from './admin/AdminDesigns'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/signin" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/free-trial" element={<FreeTrial />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/:id" element={<DesignDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/pricing/:plan" element={<PricingDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/results-stats" element={<ResultsPage />} />
          <Route path="/pricing-page" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardOverview />} />
            <Route path="downloads" element={<DashboardDownloads />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="designs" element={<AdminDesigns />} />
            <Route path="logs" element={<AdminLogs />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="threats" element={<AdminThreats />} />
            <Route path="blocked-ips" element={<AdminBlockedIPs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
