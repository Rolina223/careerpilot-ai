function Footer() {
  const socialLinks = [
    { label: 'GH', href: 'https://github.com/Rolina223/careerpilot-ai', color: '#e2e8f0', ariaLabel: 'GitHub' },
    { label: 'in', href: 'https://www.linkedin.com/', color: '#0ea5e9', ariaLabel: 'LinkedIn' },
    { label: '𝕏', href: 'https://x.com/', color: '#38bdf8', ariaLabel: 'Twitter' },
  ]

  const connectLinks = [
    { label: 'GitHub', href: 'https://github.com/Rolina223/careerpilot-ai' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Twitter', href: 'https://x.com/' },
    { label: 'Contact Us', href: 'mailto:hello@careerpilot.ai' },
  ]

  return (
    <footer style={{
      borderTop: '1px solid rgba(56,189,248,0.1)',
      marginTop: '40px',
      backgroundColor: 'rgba(255,255,255,0.01)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* CTA Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))',
        borderBottom: '1px solid rgba(56,189,248,0.1)',
        padding: '40px 32px',
        textAlign: 'center',
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
        }}>
          Ready to Land Your Dream Job? 🚀
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          marginBottom: '20px',
        }}>
          Join 500+ CSE freshers already using CareerPilot AI
        </p>
        <button style={{
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '15px',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 0 30px rgba(56,189,248,0.3)',
        }}>
          ✨ Start Analyzing Free
        </button>
      </div>

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '48px 32px 32px',
      }}>

        {/* Top Row */}
        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '48px',
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontSize: '22px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
            }}>
              ✦ CareerPilot AI
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              lineHeight: '1.7',
              maxWidth: '260px',
              marginBottom: '20px',
            }}>
              AI-powered job assistant for CSE freshers. Match resumes, generate cover letters, and land your dream job faster.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.ariaLabel}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: s.color,
                    fontSize: '11px',
                    fontWeight: '700',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p style={{
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              PRODUCT
            </p>
            {['Analyze Resume', 'Job Tracker', 'Cover Letter', 'HR Message', 'Interview Prep'].map((item) => (
              <a key={item} href="#" style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                textDecoration: 'none',
                marginBottom: '10px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.target.style.color = '#38bdf8'
                  e.target.style.paddingLeft = '4px'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#94a3b8'
                  e.target.style.paddingLeft = '0'
                }}
              >
                → {item}
              </a>
            ))}
          </div>

          {/* Roles */}
          <div>
            <p style={{
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              FOR ROLES
            </p>
            {['.NET Developer', 'Frontend Dev', 'Full Stack', 'QA Tester', 'Data Analyst'].map((item) => (
              <a key={item} href="#" style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                textDecoration: 'none',
                marginBottom: '10px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.target.style.color = '#818cf8'
                  e.target.style.paddingLeft = '4px'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#94a3b8'
                  e.target.style.paddingLeft = '0'
                }}
              >
                → {item}
              </a>
            ))}
          </div>

          {/* Connect */}
          <div>
            <p style={{
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              CONNECT
            </p>
            {connectLinks.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                textDecoration: 'none',
                marginBottom: '10px',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => {
                  e.target.style.color = '#34d399'
                  e.target.style.paddingLeft = '4px'
                }}
                onMouseLeave={e => {
                  e.target.style.color = '#94a3b8'
                  e.target.style.paddingLeft = '0'
                }}
              >
                → {item.label}
              </a>
            ))}

            {/* Status Badge */}
            <div style={{
              marginTop: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: '100px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{
                color: '#34d399',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                All Systems Online
              </span>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent)',
          marginBottom: '24px',
        }} />

        {/* Bottom Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
          }}>
            © 2025 CareerPilot AI · Built for CSE Freshers 🚀
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
          }}>
            Made with ❤️ using React + .NET
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer