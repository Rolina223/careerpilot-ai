import { useState, useEffect } from 'react'

const slides = [
  {
    icon: '🎯',
    title: 'Turn your resume into a match engine',
    description: 'Compare your background against any job description and see exactly where your profile is strongest and where it needs work.',
    color: 'var(--color-brand)',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.02))',
    glow: 'rgba(56,189,248,0.3)',
  },
  {
    icon: '✨',
    title: 'Create sharper applications in minutes',
    description: 'Generate polished cover letters and recruiter-ready messages that feel tailored instead of templated.',
    color: 'var(--color-accent)',
    gradient: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(129,140,248,0.02))',
    glow: 'rgba(129,140,248,0.3)',
  },
  {
    icon: '🚀',
    title: 'Practice with more confidence',
    description: 'Work through role-specific interview and coding prep with guidance that helps you improve steadily and feel ready.',
    color: 'var(--color-success)',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.02))',
    glow: 'rgba(52,211,153,0.3)',
  },
]

function Carousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[current]

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto 60px',
      padding: '0 32px',
      textAlign: 'center',
    }}>

      {/* Slide Card */}
      <div
        key={current}
        className="fade-in"
        style={{
          padding: '56px 64px',
          background: slide.gradient,
          border: `1px solid ${slide.color}44`,
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 80px ${slide.glow}, 0 20px 60px rgba(0,0,0,0.3)`,
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}>

        {/* Background Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${slide.glow} 0%, transparent 70%)`,
          pointerEvents: 'none',
          opacity: '0.4',
        }} />

        {/* Icon Circle */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${slide.color}33, transparent)`,
          border: `2px solid ${slide.color}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          margin: '0 auto 24px',
          boxShadow: `0 0 30px ${slide.glow}`,
        }}>
          {slide.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: slide.color,
          marginBottom: '16px',
          letterSpacing: '-0.5px',
          textShadow: `0 0 30px ${slide.glow}`,
        }}>
          {slide.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: 'var(--color-muted)',
          lineHeight: '1.8',
          maxWidth: '500px',
          margin: '0 auto',
          fontWeight: '400',
        }}>
          {slide.description}
        </p>

        {/* Slide Number */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          fontSize: '12px',
          color: `${slide.color}88`,
          fontWeight: '600',
          letterSpacing: '1px',
        }}>
          {current + 1} / {slides.length}
        </div>

      </div>

      {/* Dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
      }}>
        {slides.map((s, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '32px' : '8px',
              height: '8px',
              borderRadius: '100px',
              backgroundColor: i === current ? s.color : 'rgba(255,255,255,0.15)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              boxShadow: i === current ? `0 0 10px ${s.glow}` : 'none',
            }}
          />
        ))}
      </div>

    </div>
  )
}

export default Carousel