import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MotionCard, motionTokens, staggerContainer, staggerItem } from './motion/MotionPrimitives'

const features = [
  {
    title: 'Resume intelligence',
    description: 'Turn a resume and target role into a clear improvement plan: fit, gaps, stronger bullets, and a sharper narrative.',
    link: '/analyze',
    cta: 'Analyze a resume',
    metric: 'Fit, gaps, bullets',
  },
  {
    title: 'Application command center',
    description: 'Keep every opportunity, follow-up, note, and next action in one calm workspace built for daily execution.',
    link: '/tracker',
    cta: 'Open tracker',
    metric: 'Status, notes, follow-ups',
  },
  {
    title: 'Interview readiness',
    description: 'Practice technical, behavioral, aptitude, and coding rounds with feedback that helps you improve between sessions.',
    link: '/interview',
    cta: 'Start practice',
    metric: 'Practice, feedback, progress',
  },
]

function FeaturesSection() {
  return (
    <section className="cp-page product-features" aria-labelledby="features-title">
      <motion.div className="section-intro" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.25 }}>
        <motion.span className="cp-eyebrow" variants={staggerItem}>Workspace</motion.span>
        <motion.h2 id="features-title" variants={staggerItem}>A precise operating system for your job search.</motion.h2>
        <motion.p variants={staggerItem}>
          CareerPilot brings the scattered work of applying into one intelligent surface: resume quality, applications, outreach, and practice.
        </motion.p>
      </motion.div>

      <motion.div className="feature-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.2 }}>
        {features.map((feature, index) => (
          <MotionCard key={feature.title} className="feature-card" variants={staggerItem} transition={{ ...motionTokens.spring, delay: index * 0.03 }}>
            <span className="feature-index">0{index + 1}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <small>{feature.metric}</small>
            <Link to={feature.link}>{feature.cta}</Link>
          </MotionCard>
        ))}
      </motion.div>
    </section>
  )
}

export default FeaturesSection
