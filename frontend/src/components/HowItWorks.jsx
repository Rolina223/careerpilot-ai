function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '🎯',
      title: 'Select Your Role',
      description: 'Choose your target role from 8 CSE profiles — .NET, Frontend, Full Stack, QA, and more.',
      color: '#38bdf8',
    },
    {
      number: '02',
      icon: '📄',
      title: 'Paste Resume & JD',
      description: 'Paste your resume text and the job description you want to apply for.',
      color: '#818cf8',
    },
    {
      number: '03',
      icon: '✨',
      title: 'AI Analyzes Instantly',
      description: 'Our AI matches your resume with the JD, finds gaps, and generates suggestions in seconds.',
      color: '#34d399',
    },
    {
      number: '04',
      icon: '🚀',
      title: 'Apply with Confidence',
      description: 'Use your tailored resume bullets, cover letter, and HR message to apply and get shortlisted.',
      color: '#fb7185',
    },
  ]

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 32px',
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(129,140,248,0.1)',
          border: '1px solid rgba(129,140,248,0.3)',
          borderRadius: '100px',
          fontSize: '13px',
          color: '#818cf8',
          fontWeight: '500',
          marginBottom: '16px',
        }}>
          ✦ Simple Process
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          How It Works
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: '1.7',
        }}>
          4 simple steps to land your dream job faster
        </p>
      </div>

      {/* Steps Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '20px',
      }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              padding: '32px 24px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${step.color}33`,
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = `0 0 40px ${step.color}55, 0 20px 60px ${step.color}30, inset 0 0 40px ${step.color}08`
              e.currentTarget.style.borderColor = `${step.color}99`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = `${step.color}33`
            }}
          >
            {/* Step Number Background */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              fontSize: '80px',
              fontWeight: '900',
              color: `${step.color}18`,
              lineHeight: '1',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              {step.number}
            </div>

            {/* Icon */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`,
              border: `1px solid ${step.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              marginBottom: '20px',
              boxShadow: `0 0 20px ${step.color}20`,
            }}>
              {step.icon}
            </div>

            {/* Step Number Badge */}
            <div style={{
              fontSize: '11px',
              fontWeight: '700',
              color: step.color,
              letterSpacing: '1.5px',
              marginBottom: '8px',
            }}>
              STEP {step.number}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '10px',
              lineHeight: '1.3',
            }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
            }}>
              {step.description}
            </p>

          </div>
        ))}
      </div>

    </div>
  )
}

export default HowItWorks