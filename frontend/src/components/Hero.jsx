function Hero() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 32px',
    }}>

      {/* Main Heading */}
      <h1 style={{
        fontSize: '48px',
        fontWeight: 'bold',
        color: '#f1f5f9',
        marginBottom: '16px',
        lineHeight: '1.2'
      }}>
        AI Job Assistant for <br />
        <span style={{ color: '#38bdf8' }}>CSE Freshers 🚀</span>
      </h1>

      {/* Subheading */}
      <p style={{
        fontSize: '18px',
        color: '#94a3b8',
        marginBottom: '40px',
        maxWidth: '500px'
      }}>
        Match your resume with any job description, 
        get AI suggestions, and land your dream job faster.
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px' }}>

        <button style={{
          padding: '12px 28px',
          backgroundColor: '#38bdf8',
          color: '#0f172a',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Get Started
        </button>

        <button style={{
          padding: '12px 28px',
          backgroundColor: 'transparent',
          color: '#38bdf8',
          border: '2px solid #38bdf8',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          How it Works
        </button>

      </div>
    </div>
  )
}

export default Hero