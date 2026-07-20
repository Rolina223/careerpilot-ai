import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import ScrollToTop from './ScrollToTop'
import AppShell, { MarketingShell } from './components/AppShell'
import { AuthProvider } from './AuthProvider'
import ProtectedRoute from './ProtectedRoute'
import { LoadingShimmer, MotionCard } from './components/motion/MotionPrimitives'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Analyze = lazy(() => import('./pages/Analyze'))
const Jobs = lazy(() => import('./pages/Jobs'))
const TrackerPage = lazy(() => import('./pages/TrackerPage'))
const Messages = lazy(() => import('./pages/Messages'))
const EmailTemplates = lazy(() => import('./pages/EmailTemplates'))
const ResumeScore = lazy(() => import('./pages/ResumeScore'))
const ResumeTemplates = lazy(() => import('./pages/ResumeTemplates'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const InterviewPractice = lazy(() => import('./pages/InterviewPractice'))
const AptitudePrep = lazy(() => import('./pages/AptitudePrep'))
const CodingPrep = lazy(() => import('./pages/CodingPrep'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Settings = lazy(() => import('./pages/Settings'))

function RouteFallback() {
  return (
    <main id="main-content" className="route-fallback" aria-live="polite" aria-busy="true">
      <MotionCard className="cp-card" hover={false}>
        <span className="sr-only">Loading CareerPilot</span>
        <LoadingShimmer rows={5} />
      </MotionCard>
    </main>
  )
}

function withMarketing(children, theme, setTheme) {
  return <MarketingShell theme={theme} onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}>{children}</MarketingShell>
}

function withWorkspace(children, theme, setTheme) {
  return <AppShell theme={theme} onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}>{children}</AppShell>
}

function withProtectedWorkspace(children, theme, setTheme) {
  return <ProtectedRoute>{withWorkspace(children, theme, setTheme)}</ProtectedRoute>
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('careerpilot-theme') || 'light')

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('careerpilot-theme', theme)
  }, [theme])

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AuthProvider>
          <div className="app-shell" style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <a className="skip-link" href="#main-content">Skip to main content</a>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={withMarketing(<Home />, theme, setTheme)} />
                <Route path="/pricing" element={withMarketing(<Pricing />, theme, setTheme)} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/v1/callback" element={<AuthCallback />} />
                <Route path="/jobs" element={withWorkspace(<Jobs />, theme, setTheme)} />
                <Route path="/tracker" element={withWorkspace(<TrackerPage />, theme, setTheme)} />
                <Route path="/dashboard" element={withProtectedWorkspace(<Dashboard />, theme, setTheme)} />
                <Route path="/analyze" element={withProtectedWorkspace(<Analyze />, theme, setTheme)} />
                <Route path="/messages" element={withProtectedWorkspace(<Messages />, theme, setTheme)} />
                <Route path="/email-templates" element={withProtectedWorkspace(<EmailTemplates />, theme, setTheme)} />
                <Route path="/resume-score" element={withProtectedWorkspace(<ResumeScore />, theme, setTheme)} />
                <Route path="/resume-builder" element={withProtectedWorkspace(<ResumeBuilder />, theme, setTheme)} />
                <Route path="/resume-templates" element={withProtectedWorkspace(<ResumeTemplates />, theme, setTheme)} />
                <Route path="/interview" element={withProtectedWorkspace(<InterviewPractice />, theme, setTheme)} />
                <Route path="/aptitude" element={withProtectedWorkspace(<AptitudePrep />, theme, setTheme)} />
                <Route path="/coding" element={withProtectedWorkspace(<CodingPrep />, theme, setTheme)} />
                <Route path="/settings" element={withProtectedWorkspace(<Settings theme={theme} onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />, theme, setTheme)} />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
