function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: '🎯',
      title: 'Select Your Role',
      description: 'Choose your target role from 8 CSE profiles — .NET, Frontend, Full Stack, QA, and more.',
      color: 'var(--color-brand)',
    },
    {
      number: '02',
      icon: '📄',
      title: 'Paste Resume & JD',
      description: 'Paste your resume text and the job description you want to apply for.',
      color: 'var(--color-accent)',
    },
    {
      number: '03',
      icon: '✨',
      title: 'AI Analyzes Instantly',
      description: 'Our AI matches your resume with the JD, finds gaps, and generates suggestions in seconds.',
      color: 'var(--color-success)',
    },
    {
      number: '04',
      icon: '🚀',
      title: 'Apply with Confidence',
      description: 'Use your tailored resume bullets, cover letter, and HR message to apply and get shortlisted.',
      color: 'var(--color-danger)',
    },
  ]

  function createHexColor(colorVar, opacity) {
    // For rgba fallback, we need to use the CSS variable name in rgba format
    // The CSS variables are already defined (e.g., --color-brand is rgb(var(--cp-brand)))
    // So we use a simpler approach: just use the variable with alpha in rgba() format
    if (colorVar === 'var(--color-brand)') return `rgba(91, 67, 232, ${opacity})`
    if (colorVar === 'var(--color-accent)') return `rgba(130, 91, 238, ${opacity})`
    if (colorVar === 'var(--color-success)') return `rgba(5, 150, 105, ${opacity})`
    if (colorVar === 'var(--color-danger)') return `rgba(190, 24, 93, ${opacity})`
    return `rgba(91, 67, 232, ${opacity})`
  }

  return (
    <div id="how-it-works" style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 32px',
      scrollMarginTop: '100px',
    }}>
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
          color: 'var(--color-accent)',
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
          maxWidth: '520px',
          margin: '0 auto 28px',
          lineHeight: '1.7',
        }}>
          A clear path from your first draft to stronger applications, better interviews, and a calmer job search.
        </p>
        <div style={{
          display: 'inline-flex',
          padding: '8px 14px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--text-secondary)',
          fontSize: '13px',
        }}>
          Start with one resume, then build momentum step by step.
        </div>
      </div>

      <style>{`
        .how-it-works-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }
        @media (max-width: 1024px) {
          .how-it-works-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .how-it-works-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="how-it-works-grid">
        {steps.map((step, index) => {
          const borderColor = createHexColor(step.color, 0.2)
          const bgNumberColor = createHexColor(step.color, 0.09)
          return (
            <div
              key={index}
              style={{
                padding: '32px 24px',
                backgroundColor: 'var(--bg-card)',
                border: `1px solid ${borderColor}`,
                borderRadius: '20px',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 0 40px ${step.color}55, 0 20px 60px ${step.color}30, inset 0 0 40px ${step.color}08`
                e.currentTarget.style.borderColor = step.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.borderColor = borderColor
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                fontSize: '80px',
                fontWeight: '900',
                color: bgNumberColor,
                lineHeight: '1',
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                {step.number}
              </div>

              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: `linear-gradient(135deg, ${createHexColor(step.color, 0.13)}, ${createHexColor(step.color, 0.03)})`,
                border: `1px solid ${createHexColor(step.color, 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '20px',
                boxShadow: `0 0 20px ${createHexColor(step.color, 0.12)}`,
              }}>
                {step.icon}
              </div>

              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: step.color,
                letterSpacing: '1.5px',
                marginBottom: '8px',
              }}>
                STEP {step.number}
              </div>

              <h3 style={{
                fontSize: '17px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '10px',
                lineHeight: '1.3',
              }}>
                {step.title}
              </h3>

              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
              }}>
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HowItWorks