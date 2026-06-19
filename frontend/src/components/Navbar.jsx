import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, loading, signOut } = useAuth()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [practiceOpen, setPracticeOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [mobilePracticeOpen, setMobilePracticeOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'Jobs', path: '/jobs' },
    { label: 'Tracker', path: '/tracker' },
  ]

  const authenticated = Boolean(session)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setToolsOpen(false)
    setPracticeOpen(false)
  }, [location.pathname])

  const toolsLinks = [
    { label: '✨ Analyze Resume', path: '/analyze' },
    { label: '📊 Resume Score', path: '/resume-score' },
    { label: '🛠️ Resume Builder', path: '/resume-builder' },
    { label: '📄 Resume Templates', path: '/resume-templates' },
    { label: '💬 Message Generator', path: '/messages' },
    { label: '📧 Email Templates', path: '/email-templates' },
  ]

  const practiceLinks = [
    { label: '🎯 Interview Practice', path: '/interview' },
    { label: '🧮 Aptitude Prep', path: '/aptitude' },
    { label: '💻 Coding Prep', path: '/coding' },
  ]

  const isToolsActive = toolsLinks.some(l => l.path === location.pathname)
  const isPracticeActive = practiceLinks.some(l => l.path === location.pathname)

  const navLink = (to, label) => (
    <Link to={to} style={{
      padding: '8px 14px',
      color: location.pathname === to ? '#38bdf8' : '#94a3b8',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: location.pathname === to ? '600' : '500',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      backgroundColor: location.pathname === to ? 'rgba(56,189,248,0.08)' : 'transparent',
    }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
      onMouseLeave={e => {
        if (location.pathname !== to) e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {label}
    </Link>
  )

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: '0',
    width: '220px',
    backgroundColor: '#0f1f35',
    border: '1px solid rgba(56,189,248,0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    backdropFilter: 'blur(20px)',
    zIndex: '200',
  }

  const dropdownLink = (link) => (
    <Link
      key={link.path}
      to={link.path}
      onClick={() => { setToolsOpen(false); setPracticeOpen(false) }}
      style={{
        display: 'block',
        padding: '12px 16px',
        color: location.pathname === link.path ? '#38bdf8' : '#94a3b8',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: location.pathname === link.path ? '600' : '400',
        backgroundColor: location.pathname === link.path ? 'rgba(56,189,248,0.08)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'
        e.currentTarget.style.color = '#38bdf8'
        e.currentTarget.style.paddingLeft = '20px'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = location.pathname === link.path ? 'rgba(56,189,248,0.08)' : 'transparent'
        e.currentTarget.style.color = location.pathname === link.path ? '#38bdf8' : '#94a3b8'
        e.currentTarget.style.paddingLeft = '16px'
      }}
    >
      {link.label}
    </Link>
  )

  // Mobile menu link
  const mobileNavLink = (to, label) => (
    <Link
      key={to}
      to={to}
      onClick={() => setMobileOpen(false)}
      style={{
        display: 'block',
        padding: '14px 20px',
        color: location.pathname === to ? '#38bdf8' : '#94a3b8',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: location.pathname === to ? '600' : '500',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: location.pathname === to ? 'rgba(56,189,248,0.08)' : 'transparent',
      }}
    >
      {label}
    </Link>
  )

  return (
    <>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '14px 20px' : '16px 40px',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
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
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            ✦ CareerPilot AI
          </div>
        </Link>

        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

            {navLink('/', 'Home')}
            {authenticated && navLink('/dashboard', '🗂️ Dashboard')}

            {authenticated && (
              <>
                {/* Tools Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => { setToolsOpen(!toolsOpen); setPracticeOpen(false) }}
                    style={{
                      padding: '8px 14px',
                      color: isToolsActive ? '#38bdf8' : '#94a3b8',
                      backgroundColor: isToolsActive || toolsOpen ? 'rgba(56,189,248,0.08)' : 'transparent',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: isToolsActive ? '600' : '500',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
                    onMouseLeave={e => {
                      if (!isToolsActive && !toolsOpen) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Tools
                    <span style={{
                      fontSize: '10px',
                      transition: 'transform 0.2s ease',
                      transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                    }}>▾</span>
                  </button>
                  {toolsOpen && (
                    <div style={dropdownStyle}>
                      {toolsLinks.map(dropdownLink)}
                    </div>
                  )}
                </div>

                {navLink('/jobs', 'Jobs')}
                {navLink('/tracker', 'Tracker')}

                {/* Practice Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => { setPracticeOpen(!practiceOpen); setToolsOpen(false) }}
                    style={{
                      padding: '8px 14px',
                      color: isPracticeActive ? '#38bdf8' : '#94a3b8',
                      backgroundColor: isPracticeActive || practiceOpen ? 'rgba(56,189,248,0.08)' : 'transparent',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: isPracticeActive ? '600' : '500',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
                    onMouseLeave={e => {
                      if (!isPracticeActive && !practiceOpen) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    Practice
                    <span style={{
                      fontSize: '10px',
                      transition: 'transform 0.2s ease',
                      transform: practiceOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                    }}>▾</span>
                  </button>
                  {practiceOpen && (
                    <div style={{ ...dropdownStyle, width: '200px' }}>
                      {practiceLinks.map(dropdownLink)}
                    </div>
                  )}
                </div>
              </>
            )}

            {!authenticated && navLink('/login', 'Login')}

            {authenticated && (
              <button
                onClick={async () => { await signOut(); navigate('/') }}
                style={{
                  padding: '8px 20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Logout
              </button>
            )}

            <Link to={authenticated ? '/analyze' : '/login'} style={{ textDecoration: 'none', marginLeft: '8px' }}>
              <button style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(56,189,248,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(56,189,248,0.3)'}
              >
                {authenticated ? 'Get Started →' : 'Login to access full app'}
              </button>
            </Link>

          </div>
        )}

        {/* Hamburger Button - Mobile only */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: '1px solid rgba(56,189,248,0.3)',
              borderRadius: '8px',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{
              display: 'block', width: '20px', height: '2px',
              backgroundColor: '#38bdf8',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '2px',
              backgroundColor: '#38bdf8',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              opacity: mobileOpen ? '0' : '1',
            }} />
            <span style={{
              display: 'block', width: '20px', height: '2px',
              backgroundColor: '#38bdf8',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            }} />
          </button>
        )}

      </nav>

      {/* Mobile Menu Drawer */}
      {isMobile && mobileOpen && (
        <div style={{
          position: 'fixed',
          top: '57px',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(10, 15, 28, 0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: '99',
          overflowY: 'auto',
          borderTop: '1px solid rgba(56,189,248,0.15)',
        }}>

          {mobileNavLink('/', '🏠 Home')}
          {authenticated && mobileNavLink('/dashboard', '🗂️ Dashboard')}

          {authenticated && (
            <>
              {/* Tools Section */}
              <div>
                <button
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 20px',
                    background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: isToolsActive ? '#38bdf8' : '#94a3b8',
                    fontSize: '15px', fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  🛠️ Tools
                  <span style={{
                    fontSize: '12px',
                    transform: mobileToolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block',
                  }}>▾</span>
                </button>
                {mobileToolsOpen && (
                  <div style={{ backgroundColor: 'rgba(56,189,248,0.03)' }}>
                    {toolsLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 20px 12px 36px',
                          color: location.pathname === link.path ? '#38bdf8' : '#64748b',
                          textDecoration: 'none',
                          fontSize: '14px',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          backgroundColor: location.pathname === link.path ? 'rgba(56,189,248,0.06)' : 'transparent',
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {mobileNavLink('/jobs', '💼 Jobs')}
              {mobileNavLink('/tracker', '📋 Tracker')}

              {/* Practice Section */}
              <div>
                <button
                  onClick={() => setMobilePracticeOpen(!mobilePracticeOpen)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 20px',
                    background: 'none', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: isPracticeActive ? '#38bdf8' : '#94a3b8',
                    fontSize: '15px', fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  🎯 Practice
                  <span style={{
                    fontSize: '12px',
                    transform: mobilePracticeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block',
                  }}>▾</span>
                </button>
                {mobilePracticeOpen && (
                  <div style={{ backgroundColor: 'rgba(56,189,248,0.03)' }}>
                    {practiceLinks.map(link => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 20px 12px 36px',
                          color: location.pathname === link.path ? '#38bdf8' : '#64748b',
                          textDecoration: 'none',
                          fontSize: '14px',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                          backgroundColor: location.pathname === link.path ? 'rgba(56,189,248,0.06)' : 'transparent',
                        }}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={async () => { await signOut(); setMobileOpen(false); navigate('/') }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 20px',
                  background: 'none',
                  border: 'none',
                  color: '#f1f5f9',
                  fontSize: '15px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                Logout
              </button>
            </>
          )}

          {!authenticated && mobileNavLink('/login', '🔐 Login')}

          {/* Mobile CTA */}
          <div style={{ padding: '20px' }}>
            {!authenticated ? (
              <Link to="/login" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                <button style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  Login to access full app
                </button>
              </Link>
            ) : (
              <Link to="/analyze" style={{ textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>
                <button style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}>
                  ✨ Get Started →
                </button>
              </Link>
            )}
          </div>

        </div>
      )}
    </>
  )
}

export default Navbar