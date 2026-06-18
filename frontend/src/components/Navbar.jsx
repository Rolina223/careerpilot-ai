import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [toolsOpen, setToolsOpen] = useState(false)
  const [practiceOpen, setPracticeOpen] = useState(false)

  const toolsLinks = [
    { label: '✨ Analyze Resume', path: '/analyze' },
    { label: '📊 Resume Score', path: '/resume-score' },
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
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

        {/* Home */}
        <Link to="/" style={{
          padding: '8px 14px',
          color: location.pathname === '/' ? '#38bdf8' : '#94a3b8',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: location.pathname === '/' ? '600' : '500',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: location.pathname === '/' ? 'rgba(56,189,248,0.08)' : 'transparent',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
          onMouseLeave={e => {
            if (location.pathname !== '/') e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Home
        </Link>

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

          {/* Tools Dropdown Menu */}
          {toolsOpen && (
            <div style={{
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
            }}>
              {toolsLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setToolsOpen(false)}
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
              ))}
            </div>
          )}
        </div>

        {/* Jobs */}
        <Link to="/jobs" style={{
          padding: '8px 14px',
          color: location.pathname === '/jobs' ? '#38bdf8' : '#94a3b8',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: location.pathname === '/jobs' ? '600' : '500',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: location.pathname === '/jobs' ? 'rgba(56,189,248,0.08)' : 'transparent',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
          onMouseLeave={e => {
            if (location.pathname !== '/jobs') e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Jobs
        </Link>

        {/* Tracker */}
        <Link to="/tracker" style={{
          padding: '8px 14px',
          color: location.pathname === '/tracker' ? '#38bdf8' : '#94a3b8',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: location.pathname === '/tracker' ? '600' : '500',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          backgroundColor: location.pathname === '/tracker' ? 'rgba(56,189,248,0.08)' : 'transparent',
        }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'}
          onMouseLeave={e => {
            if (location.pathname !== '/tracker') e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Tracker
        </Link>

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

          {/* Practice Dropdown Menu */}
          {practiceOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: '0',
              width: '200px',
              backgroundColor: '#0f1f35',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
              zIndex: '200',
            }}>
              {practiceLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setPracticeOpen(false)}
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
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Link to="/analyze" style={{ textDecoration: 'none', marginLeft: '8px' }}>
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
            Get Started →
          </button>
        </Link>

      </div>
    </nav>
  )
}

export default Navbar