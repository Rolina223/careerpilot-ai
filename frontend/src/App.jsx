import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ScrollToTop from './ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Jobs from './pages/Jobs'
import TrackerPage from './pages/TrackerPage'
import Messages from './pages/Messages'
import EmailTemplates from './pages/EmailTemplates'
import ResumeScore from './pages/ResumeScore'
import ResumeTemplates from './pages/ResumeTemplates'
import InterviewPractice from './pages/InterviewPractice'
import AptitudePrep from './pages/AptitudePrep'
import CodingPrep from './pages/CodingPrep'

function App() {
  return (
    <BrowserRouter>
      <div>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/resume-score" element={<ResumeScore />} />
          <Route path="/resume-templates" element={<ResumeTemplates />} />
          <Route path="/interview" element={<InterviewPractice />} />
          <Route path="/aptitude" element={<AptitudePrep />} />
          <Route path="/coding" element={<CodingPrep />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App