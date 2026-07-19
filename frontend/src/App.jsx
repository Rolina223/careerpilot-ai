import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ScrollToTop from './ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Analyze from './pages/Analyze'
import Jobs from './pages/Jobs'
import TrackerPage from './pages/TrackerPage'
import Messages from './pages/Messages'
import EmailTemplates from './pages/EmailTemplates'
import ResumeScore from './pages/ResumeScore'
import ResumeTemplates from './pages/ResumeTemplates'
import ResumeBuilder from './pages/ResumeBuilder'
import InterviewPractice from './pages/InterviewPractice'
import AptitudePrep from './pages/AptitudePrep'
import CodingPrep from './pages/CodingPrep'
import { AuthProvider } from './AuthProvider'
import ProtectedRoute from './ProtectedRoute'

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('careerpilot-theme') || 'dark')

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('careerpilot-theme', theme)
  }, [theme])

  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
          <ScrollToTop />
          <Navbar theme={theme} onToggleTheme={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/v1/callback" element={<AuthCallback />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analyze" element={<ProtectedRoute><Analyze /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/email-templates" element={<ProtectedRoute><EmailTemplates /></ProtectedRoute>} />
            <Route path="/resume-score" element={<ProtectedRoute><ResumeScore /></ProtectedRoute>} />
            <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
            <Route path="/resume-templates" element={<ProtectedRoute><ResumeTemplates /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewPractice /></ProtectedRoute>} />
            <Route path="/aptitude" element={<ProtectedRoute><AptitudePrep /></ProtectedRoute>} />
            <Route path="/coding" element={<ProtectedRoute><CodingPrep /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App