import Hero from '../components/Hero'
import Carousel from '../components/Carousel'
import ImpactSection from '../components/ImpactSection'
import HowItWorks from '../components/HowItWorks'
import FeaturesSection from '../components/FeaturesSection'

function Home() {
  return (
    <div>
      <Hero />
      <Carousel />
      <ImpactSection />
      <FeaturesSection />
      <HowItWorks />
    </div>
  )
}

export default Home