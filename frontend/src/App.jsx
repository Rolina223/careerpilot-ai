import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import HowItWorks from './components/HowItWorks'
import AnalyzeSection from './components/AnalyzeSection'
import JobsSection from './components/JobsSection'
import Footer from './components/Footer'

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Carousel />
      <HowItWorks />
      <AnalyzeSection />
      <JobsSection />
      <Footer />
    </div>
  )
}

export default App