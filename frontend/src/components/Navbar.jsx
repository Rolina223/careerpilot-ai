function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
      position: 'sticky',
      top: '0',
      zIndex: '100',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)'
    }}>

      {/* Logo */}
      <div style={{
        fontSize: '22px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px'
      }}>
        ✦ CareerPilot AI
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {['Home', 'Analyze', 'Jobs', 'Tracker'].map((item) => (
          <a key={item} href="#" style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '0.3px',
            transition: 'color 0.2s ease',
          }}
            onMouseEnter={e => e.target.style.color = '#38bdf8'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            {item}
          </a>
        ))}

        {/* CTA Button */}
        <button style={{
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
        }}>
          Get Started →
        </button>
      </div>

    </nav>
  )
}

export default Navbar