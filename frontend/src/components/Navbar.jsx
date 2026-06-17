function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#1e293b',
      borderBottom: '1px solid #334155'
    }}>

      {/* Left Side - Logo */}
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#38bdf8' }}>
        CareerPilot AI
      </div>

      {/* Right Side - Links */}
      <div style={{ display: 'flex', gap: '24px' }}>
        <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Home</a>
        <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Analyze</a>
        <a href="#" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Jobs</a>
      </div>

    </nav>
  )
}

export default Navbar