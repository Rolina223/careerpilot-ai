import { Link } from 'react-router-dom'

function FeaturesSection() {
  const features = [
    {
      icon: '✨',
      title: 'AI Resume Analyzer',
      description: 'Paste your resume and job description — get instant match score, missing skills, tailored bullets, cover letter, and HR message.',
      color: '#38bdf8',
      gradient: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(56,189,248,0.02))',
      border: 'rgba(56,189,248,0.25)',
      glow: 'rgba(56,189,248,0.2)',
      link: '/analyze',
      btnText: '✨ Analyze Now',
      points: ['Match Score', 'Missing Skills', 'Resume Bullets', 'Cover Letter', 'HR Message'],
    },
    {
      icon: '💼',
      title: 'Browse Fresher Jobs',
      description: 'Curated CSE fresher jobs updated daily — filter by role, location, and experience. Direct apply links to top companies.',
      color: '#818cf8',
      gradient: 'linear-gradient(135deg, rgba(129,140,248,0.12), rgba(129,140,248,0.02))',
      border: 'rgba(129,140,248,0.25)',
      glow: 'rgba(129,140,248,0.2)',
      link: '/jobs',
      btnText: '💼 Browse Jobs',
      points: ['10+ Daily Jobs', 'Role Filters', 'Direct Apply', 'Save Jobs', 'Top Companies'],
    },
    {
      icon: '📊',
      title: 'Application Tracker',
      description: 'Track every job application in one place — status updates, follow up reminders, and notes for every company.',
      color: '#34d399',
      gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(52,211,153,0.02))',
      border: 'rgba(52,211,153,0.25)',
      glow: 'rgba(52,211,153,0.2)',
      link: '/tracker',
      btnText: '📊 Track Apps',
      points: ['Add Applications', 'Status Tracking', 'Follow Up Dates', 'Notes', 'Stats Dashboard'],
    },
  ]

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 32px)'
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          backgroundColor: 'rgba(56,189,248,0.1)',
          border: '1px solid rgba(56,189,248,0.3)',
          borderRadius: '100px',
          fontSize: '13px',
          color: '#38bdf8',
          fontWeight: '500',
          marginBottom: '16px',
        }}>
          ✦ Everything You Need
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          All-in-One Job Assistant
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: '1.7',
        }}>
          Everything a CSE fresher needs to land their first job — in one place
        </p>
      </div>

     {/* Feature Cards */}
      <style>{`
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          margin-bottom: 60px;
        }
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              padding: '32px',
              background: feature.gradient,
              border: `1px solid ${feature.border}`,
              borderRadius: '20px',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-6px)'
              e.currentTarget.style.boxShadow = `0 20px 60px ${feature.glow}`
              e.currentTarget.style.borderColor = feature.color + '66'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = feature.border
            }}
          >
            {/* Background Orb */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${feature.glow} 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            {/* Icon */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}08)`,
              border: `1px solid ${feature.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              marginBottom: '20px',
              boxShadow: `0 0 20px ${feature.glow}`,
            }}>
              {feature.icon}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}>
              {feature.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: '1.7',
              marginBottom: '20px',
            }}>
              {feature.description}
            </p>

            {/* Feature Points */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '24px',
            }}>
              {feature.points.map((point, i) => (
                <span key={i} style={{
                  padding: '4px 10px',
                  backgroundColor: `${feature.color}12`,
                  border: `1px solid ${feature.color}25`,
                  borderRadius: '100px',
                  fontSize: '11px',
                  color: feature.color,
                  fontWeight: '500',
                }}>
                  ✓ {point}
                </span>
              ))}
            </div>

            {/* Button */}
            <Link to={feature.link} style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%',
                padding: '12px',
                background: `linear-gradient(135deg, ${feature.color}22, ${feature.color}08)`,
                border: `1px solid ${feature.color}44`,
                borderRadius: '10px',
                color: feature.color,
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.3px',
              }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = `${feature.color}25`
                  e.target.style.boxShadow = `0 0 20px ${feature.glow}`
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = `${feature.color}12`
                  e.target.style.boxShadow = 'none'
                }}
              >
                {feature.btnText} →
              </button>
            </Link>

          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div style={{
        padding: '48px',
        background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '24px',
        textAlign: 'center',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <h3 style={{
          fontSize: '28px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Start Your Job Search Today 🚀
        </h3>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          marginBottom: '28px',
          maxWidth: '400px',
          margin: '0 auto 28px',
          lineHeight: '1.7',
        }}>
          Free to use. No signup required. Start analyzing your resume in seconds.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/analyze" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: '700',
              borderRadius: '10px',
            }}>
              ✨ Analyze My Resume
            </button>
          </Link>
          <Link to="/jobs" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '14px 32px',
              backgroundColor: 'transparent',
              color: '#38bdf8',
              border: '1px solid rgba(56,189,248,0.4)',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}>
              💼 Browse Jobs
            </button>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default FeaturesSection