import Hero from '../components/Hero'
import Carousel from '../components/Carousel'
import HowItWorks from '../components/HowItWorks'
import FeaturesSection from '../components/FeaturesSection'

function Home() {
  return (
    <div>
      <Hero />
      <Carousel />
      <FeaturesSection />
      <HowItWorks />
    </div>
  )
}

export default Home