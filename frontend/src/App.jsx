import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ScrollToTop from './ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Jobs from './pages/Jobs'
import TrackerPage from './pages/TrackerPage'

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
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App