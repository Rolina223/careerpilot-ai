function Hero() {
  return (
    <div className="fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '60px 32px 60px',
      position: 'relative',
    }}>

      {/* Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '100px',
        fontSize: '13px',
        color: '#38bdf8',
        fontWeight: '500',
        marginBottom: '24px',
        letterSpacing: '0.3px'
      }}>
        ✦ AI Powered Job Assistant
      </div>

      {/* Main Heading */}
      <h1 style={{
        fontSize: '56px',
        fontWeight: '800',
        color: '#f1f5f9',
        marginBottom: '16px',
        lineHeight: '1.15',
        letterSpacing: '-1px'
      }}>
        Land Your Dream Job <br />
        <span style={{
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          10x Faster with AI ⚡
        </span>
      </h1>

      {/* Subheading */}
      <p style={{
        fontSize: '18px',
        color: '#94a3b8',
        marginBottom: '48px',
        maxWidth: '520px',
        lineHeight: '1.7',
        fontWeight: '400'
      }}>
        Match resume with JD, get AI suggestions, 
        generate cover letters, and track applications — 
        all in one place.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
        <button className="btn-primary" style={{
          padding: '14px 32px',
          fontSize: '16px',
          fontWeight: '700',
          letterSpacing: '0.3px'
        }}>
          ✨ Analyze My Resume
        </button>

        <button style={{
          padding: '14px 32px',
          backgroundColor: 'transparent',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          letterSpacing: '0.3px'
        }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = 'rgba(56, 189, 248, 0.1)'
            e.target.style.borderColor = '#38bdf8'
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'rgba(56, 189, 248, 0.4)'
          }}
        >
          How it Works →
        </button>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'flex',
        gap: '48px',
        padding: '24px 48px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(56, 189, 248, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
      }}>
        {[
          { number: '500+', label: 'Freshers Helped' },
          { number: '95%', label: 'Resume Match Rate' },
          { number: '10x', label: 'Faster Job Search' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '500',
              marginTop: '4px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Hero