function ResultSection({ result }) {
  if (!result) return null

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    const btn = document.getElementById(id)
    if (btn) {
      btn.innerText = '✓ Copied!'
      btn.style.color = '#38bdf8'
      setTimeout(() => {
        btn.innerText = '📋 Copy'
        btn.style.color = '#94a3b8'
      }, 2000)
    }
  }

  return (
    <div className="fade-in" style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '0 32px 60px',
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
          ✦ Your tailored application kit
        </div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Your Analysis Result
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Based on your resume and job description
        </p>
      </div>

      {/* Row 1 — Match Score + Skills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px',
        marginBottom: '24px'
      }}>

        {/* Match Score */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(56,189,248,0.08), rgba(255,255,255,0.03))',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '18px',
          padding: '32px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(2,8,23,0.16)',
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '20px'
          }}>
            MATCH SCORE
          </p>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="58"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
              />
              <circle cx="70" cy="70" r="58"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - result.matchScore / 100)}`}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                background: 'var(--gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {result.matchScore}%
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '500'
              }}>
                {result.matchScore >= 70 ? '🟢 Good' : result.matchScore >= 50 ? '🟡 Average' : '🔴 Low'}
              </div>
            </div>
          </div>
          <p style={{
            marginTop: '16px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5'
          }}>
            {result.matchScore >= 70
              ? 'Strong match! Apply confidently.'
              : result.matchScore >= 50
              ? 'Decent match. Improve highlighted skills.'
              : 'Low match. Tailor your resume more.'}
          </p>
        </div>

        {/* Skills */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '18px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(2,8,23,0.12)',
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '16px'
          }}>
            ⚠️ MISSING SKILLS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {result.missingSkills.map((skill, i) => (
              <span key={i} style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(251,113,133,0.1)',
                border: '1px solid rgba(251,113,133,0.3)',
                borderRadius: '100px',
                fontSize: '13px',
                color: '#fb7185',
                fontWeight: '500'
              }}>
                {skill}
              </span>
            ))}
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '16px'
          }}>
            ✅ MATCHED SKILLS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {result.matchedSkills.map((skill, i) => (
              <span key={i} style={{
                padding: '6px 14px',
                backgroundColor: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.3)',
                borderRadius: '100px',
                fontSize: '13px',
                color: '#38bdf8',
                fontWeight: '500'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — Suggestions + Questions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>

        {/* Suggestions */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
            }}>
              💡 RESUME SUGGESTIONS
            </p>
            <button
              id="copy-suggestions"
              onClick={() => copyToClipboard(result.suggestions.join('\n'), 'copy-suggestions')}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              📋 Copy
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.suggestions.map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'rgba(129,140,248,0.05)',
                border: '1px solid rgba(129,140,248,0.15)',
                borderRadius: '10px',
              }}>
                <span style={{ color: '#818cf8', fontSize: '16px' }}>→</span>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5'
                }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Questions */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
            }}>
              🎯 INTERVIEW QUESTIONS
            </p>
            <button
              id="copy-questions"
              onClick={() => copyToClipboard(result.questions.join('\n'), 'copy-questions')}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              📋 Copy
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.questions.map((q, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                backgroundColor: 'rgba(56,189,248,0.05)',
                border: '1px solid rgba(56,189,248,0.1)',
                borderRadius: '10px',
              }}>
                <span style={{
                  color: '#38bdf8',
                  fontSize: '13px',
                  fontWeight: '700',
                  minWidth: '20px'
                }}>
                  Q{i + 1}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.5'
                }}>
                  {q}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 — Resume Bullets + HR Message */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>

        {/* Resume Bullets */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
            }}>
              📝 RESUME BULLETS
            </p>
            <button
              id="copy-bullets"
              onClick={() => copyToClipboard(result.resumeBullets.join('\n'), 'copy-bullets')}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              📋 Copy
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.resumeBullets.map((bullet, i) => (
              <div key={i} style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(56,189,248,0.04)',
                border: '1px solid rgba(56,189,248,0.1)',
                borderRadius: '10px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                lineHeight: '1.6',
              }}>
                {bullet}
              </div>
            ))}
          </div>
        </div>

        {/* HR Message */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
            }}>
              💬 HR MESSAGE
            </p>
            <button
              id="copy-hr"
              onClick={() => copyToClipboard(result.hrMessage, 'copy-hr')}
              style={{
                padding: '4px 12px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              📋 Copy
            </button>
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(129,140,248,0.04)',
            border: '1px solid rgba(129,140,248,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.8',
            whiteSpace: 'pre-line',
            fontFamily: 'Inter, sans-serif',
          }}>
            {result.hrMessage}
          </div>
        </div>
      </div>

      {/* Row 4 — Cover Letter */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.05))',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '18px',
        padding: '32px',
        backdropFilter: 'blur(20px)',
        marginBottom: '32px',
        boxShadow: '0 20px 60px rgba(2,8,23,0.14)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
          }}>
            ✉️ COVER LETTER
          </p>
          <button
            id="copy-cover"
            onClick={() => copyToClipboard(result.coverLetter, 'copy-cover')}
            style={{
              padding: '4px 12px',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
            }}>
            📋 Copy
          </button>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: 'rgba(56,189,248,0.03)',
          border: '1px solid rgba(56,189,248,0.1)',
          borderRadius: '12px',
          fontSize: '14px',
          color: 'var(--text-primary)',
          lineHeight: '1.8',
          whiteSpace: 'pre-line',
          fontFamily: 'Inter, sans-serif',
        }}>
          {result.coverLetter}
        </div>
      </div>

      {/* Analyze Again Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            padding: '14px 40px',
            backgroundColor: 'transparent',
            color: '#38bdf8',
            border: '1px solid rgba(56,189,248,0.4)',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = 'rgba(56,189,248,0.1)'
            e.target.style.borderColor = '#38bdf8'
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'rgba(56,189,248,0.4)'
          }}
        >
          🔄 Analyze Another Job
        </button>
      </div>

    </div>
  )
}

export default ResultSection