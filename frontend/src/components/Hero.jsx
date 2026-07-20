import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AnimatedCounter, MotionButton, motionTokens, staggerContainer, staggerItem } from './motion/MotionPrimitives'

function Hero() {
  const navigate = useNavigate()

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const stats = [
    { number: 500, suffix: '+', label: 'Freshers Helped' },
    { number: 95, suffix: '%', label: 'Smarter Resume Fit' },
    { number: 10, suffix: 'x', label: 'Faster Momentum' },
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 32px 60px',
        position: 'relative',
      }}
    >
      <motion.div
        variants={staggerItem}
        whileHover={{ y: -1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '100px',
          fontSize: '13px',
          color: 'var(--color-brand)',
          fontWeight: '500',
          marginBottom: '24px',
          letterSpacing: '0.3px'
        }}
      >
        AI Co-Pilot for Your First Job Search
      </motion.div>

      <motion.h1
        variants={staggerItem}
        style={{
          fontSize: '56px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          lineHeight: '1.15',
          letterSpacing: '-1px'
        }}
      >
        Build a stronger profile, apply faster, <br />
        <motion.span
          initial={{ backgroundPosition: '0% 50%' }}
          animate={{ backgroundPosition: '100% 50%' }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          style={{
            background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent), var(--color-brand))',
            backgroundSize: '220% 220%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          and land interviews with confidence.
        </motion.span>
      </motion.h1>

      <motion.p
        variants={staggerItem}
        style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          marginBottom: '48px',
          maxWidth: '580px',
          lineHeight: '1.7',
          fontWeight: '400'
        }}
      >
        From resume matching and tailored bullets to interview prep and application tracking, CareerPilot helps you stay focused and move faster from profile to opportunity.
      </motion.p>

      <motion.div variants={staggerItem} style={{ display: 'flex', gap: '16px', marginBottom: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <MotionButton className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px', fontWeight: '700', letterSpacing: '0.3px' }} onClick={() => navigate('/analyze#resume-analyze')}>
          Analyze My Resume
        </MotionButton>

        <MotionButton
          style={{
            padding: '14px 32px',
            backgroundColor: 'transparent',
            color: 'var(--color-brand)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '0.3px'
          }}
          onClick={scrollToHowItWorks}
        >
          How it Works -&gt;
        </MotionButton>
      </motion.div>

      <motion.div
        variants={staggerItem}
        whileHover={{ y: -2 }}
        transition={motionTokens.spring}
        style={{
          display: 'flex',
          gap: '48px',
          padding: '24px 48px',
          backgroundColor: 'var(--hero-surface)',
          border: '1px solid var(--hero-border)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
        }}
      >
        {stats.map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, var(--color-brand), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              <AnimatedCounter value={stat.number} suffix={stat.suffix} />
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default Hero
