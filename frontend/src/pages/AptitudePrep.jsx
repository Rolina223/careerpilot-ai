function AptitudePrep() {
  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 32px',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧮</div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Aptitude Prep
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Coming soon — TCS, Infosys, Wipro aptitude practice
        </p>
      </div>
    </div>
  )
}

export default AptitudePrep