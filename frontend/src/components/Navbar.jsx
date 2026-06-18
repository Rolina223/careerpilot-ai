import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Analyze', path: '/analyze' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Tracker', path: '/tracker' },
  ]

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
      <Link to="/" style={{ textDecoration: 'none' }}>
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
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              color: location.pathname === link.path ? '#38bdf8' : '#94a3b8',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: location.pathname === link.path ? '600' : '500',
              letterSpacing: '0.3px',
              transition: 'color 0.2s ease',
              borderBottom: location.pathname === link.path
                ? '2px solid #38bdf8'
                : '2px solid transparent',
              paddingBottom: '2px',
            }}
            onMouseEnter={e => e.target.style.color = '#38bdf8'}
            onMouseLeave={e => {
              e.target.style.color = location.pathname === link.path
                ? '#38bdf8'
                : '#94a3b8'
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* CTA Button */}
        <Link to="/analyze" style={{ textDecoration: 'none' }}>
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
        </Link>
      </div>

    </nav>
  )
}

export default Navbar