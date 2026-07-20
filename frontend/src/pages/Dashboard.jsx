import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { getStoredResume, getStoredTemplate, resumeTemplates } from '../utils/resumeStorage'
import { calculateResumeScore, buildKeywordCoverage, getHealthChecklist } from '../utils/scoreUtils'

function MiniBar({ value, color = '#38bdf8', max = 100 }) {
  return (
    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '4px',
        transition: 'width 0.8s ease',
      }} />
    </div>
  )
}

function StatCard({ icon, label, value, sub, color = '#38bdf8', glowColor }) {
  return (
    <div style={{
      padding: '22px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(56,189,248,0.12)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      transition: 'all 0.3s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = glowColor || '0 0 24px rgba(56,189,248,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.12)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: '22px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color, letterSpacing: '-0.5px', lineHeight: '1' }}>{value}</div>
      <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontWeight: '500' }}>{label}</div>
      {sub && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

function ActivityItem({ icon, text, time, color = 'rgba(56,189,248,0.15)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.4' }}>{text}</div>
        <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{time}</div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon, label, desc }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        padding: '18px',
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: '14px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(56,189,248,0.15)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>{desc}</div>
      </div>
    </Link>
  )
}

function ScoreRing({ score, size = 120, strokeWidth = 9 }) {
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.min(score, 100) / 100
  const color = score >= 80 ? '#34d399' : score >= 60 ? '#38bdf8' : '#fb7185'

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x={size / 2} y={size / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill={color} fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif"
      >{score}</text>
      <text x={size / 2} y={size / 2 + 19}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif"
      >/ 100</text>
    </svg>
  )
}

function hasMeaningfulResumeContent(resumeData) {
  if (!resumeData) return false

  const personal = resumeData.personalInfo || {}
  const hasText = [personal.fullName, personal.email, personal.phone, personal.location, personal.summary, personal.linkedin, personal.github, personal.portfolio]
    .some(value => value?.toString().trim())

  const hasExperience = (resumeData.experience || []).some(item => item?.company?.trim() || item?.position?.trim() || item?.description?.trim())
  const hasProjects = (resumeData.projects || []).some(item => item?.name?.trim() || item?.description?.trim())
  const hasEducation = (resumeData.education || []).some(item => item?.school?.trim() || item?.degree?.trim())
  const hasSkills = (resumeData.skills || []).some(skill => skill?.trim())

  return hasText || hasExperience || hasProjects || hasEducation || hasSkills
}

function Dashboard() {
  const { user } = useAuth()
  const [resumeData] = useState(getStoredResume())
  const [selectedTemplate] = useState(getStoredTemplate())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const hasResumeContent = useMemo(() => hasMeaningfulResumeContent(resumeData), [resumeData])

  const scores = useMemo(() => {
    if (!hasResumeContent) {
      return {
        overall: 0,
        atsCompatibility: 0,
        completeness: 0,
        experienceQuality: 0,
        skillsQuality: 0,
        projects: 0,
        education: 0,
        certifications: 0,
        professionalPresence: 0,
        templateImpact: 1,
      }
    }

    return calculateResumeScore(resumeData, selectedTemplate, '')
  }, [hasResumeContent, resumeData, selectedTemplate])

  const keywordCoverage = useMemo(() => {
    if (!hasResumeContent) {
      return { matchedKeywords: [], missingKeywords: [], coverage: 0 }
    }

    return buildKeywordCoverage(resumeData, 'javascript react node python sql cloud aws docker kubernetes')
  }, [hasResumeContent, resumeData])

  const healthItems = hasResumeContent
    ? getHealthChecklist(resumeData).map(item => ({
        label: item.label,
        passed: item.status === true,
      }))
    : [
        { label: 'Add your contact details', passed: false },
        { label: 'Add skills and projects', passed: false },
        { label: 'Complete your work history', passed: false },
      ]

  const healthPassed = healthItems.filter(i => i.passed).length

  const userName = useMemo(() => {
    const emailName = user?.email?.split('@')[0]?.replace(/[._-]+/g, ' ').trim() || ''
    if (!emailName) return 'there'

    return emailName.split(' ').filter(Boolean).slice(0, 2).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }, [user?.email])

  const completionTasks = [
    { done: !!resumeData.personalInfo.fullName, label: 'Personal info', path: '/resume-builder' },
    { done: !!resumeData.personalInfo.summary, label: 'Professional summary', path: '/resume-builder' },
    { done: resumeData.experience.some(e => e.company && e.position), label: 'Work experience', path: '/resume-builder' },
    { done: resumeData.projects.some(p => p.name && p.description), label: 'Projects added', path: '/resume-builder' },
    { done: resumeData.skills.filter(Boolean).length >= 4, label: '4+ skills listed', path: '/resume-builder' },
    { done: !!resumeData.personalInfo.linkedin, label: 'LinkedIn linked', path: '/resume-builder' },
    { done: !!resumeData.personalInfo.github, label: 'GitHub linked', path: '/resume-builder' },
    { done: resumeData.certifications.some(c => c.name && c.issuer), label: 'Certification added', path: '/resume-builder' },
  ]

  const doneCount = completionTasks.filter(t => t.done).length
  const completionPct = Math.round((doneCount / completionTasks.length) * 100)

  const scoreBreakdown = [
    { label: 'Overall score', val: scores.overall, color: '#38bdf8' },
    { label: 'ATS compatibility', val: scores.atsCompatibility, color: '#818cf8' },
    { label: 'Completeness', val: scores.completeness, color: '#34d399' },
    { label: 'Keyword coverage', val: keywordCoverage.coverage, color: '#fb923c' },
  ]

  const toolLinks = [
    { to: '/analyze', icon: '✨', label: 'Analyze Resume', desc: 'Match with any job description' },
    { to: '/resume-score', icon: '📊', label: 'Resume Score', desc: 'Get your ATS health score' },
    { to: '/resume-builder', icon: '🛠️', label: 'Resume Builder', desc: 'Build or update your resume' },
    { to: '/interview', icon: '🎯', label: 'Interview Prep', desc: 'Practice with AI mock interviews' },
    { to: '/aptitude', icon: '🧮', label: 'Aptitude Prep', desc: 'MCQs, quants & logical reasoning' },
    { to: '/coding', icon: '💻', label: 'Coding Prep', desc: 'DSA problems with AI hints' },
    { to: '/tracker', icon: '📋', label: 'Job Tracker', desc: 'Track all your applications' },
    { to: '/jobs', icon: '💼', label: 'Browse Jobs', desc: 'Find matching job listings' },
    { to: '/messages', icon: '💬', label: 'Message Generator', desc: 'Cold DMs & follow-ups' },
    { to: '/email-templates', icon: '📧', label: 'Email Templates', desc: 'Professional email drafts' },
    { to: '/resume-templates', icon: '📄', label: 'Templates', desc: 'Choose an ATS-friendly layout' },
  ]

  const card = {
    padding: '24px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(56,189,248,0.12)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px',
          fontSize: '13px', color: '#38bdf8', fontWeight: '500', marginBottom: '16px',
        }}>
          ✦ Your career command center
        </div>
        <h1 style={{
          fontSize: '40px', fontWeight: '800', color: '#f1f5f9',
          letterSpacing: '-0.8px', lineHeight: '1.15', marginBottom: '8px',
        }}>
          {greeting}, {userName} 👋
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', fontWeight: '400' }}>
          {hasResumeContent
            ? "Here's a snapshot of your job-hunt progress today."
            : 'Build your first resume snapshot and these insights will appear automatically.'}
        </p>
      </div>

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon="⚡" label="Resume score" value={scores.overall} sub="Out of 100" color="#38bdf8" />
        <StatCard icon="🎯" label="ATS compatibility" value={`${scores.atsCompatibility}%`} color="#818cf8" glowColor="0 0 24px rgba(129,140,248,0.2)" />
        <StatCard icon="✅" label="Profile complete" value={`${completionPct}%`} sub={`${doneCount} of ${completionTasks.length} done`} color="#34d399" glowColor="0 0 24px rgba(52,211,153,0.2)" />
        <StatCard icon="🔑" label="Keyword coverage" value={`${keywordCoverage.coverage}%`} sub={`${keywordCoverage.matchedKeywords.length} matched`} color="#fb923c" glowColor="0 0 24px rgba(251,146,60,0.2)" />
      </div>

      {/* Main two-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Score breakdown */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>Score breakdown</h2>
              <Link to="/resume-score" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>Full report →</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <ScoreRing score={scores.overall} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {scoreBreakdown.map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{s.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: s.color }}>{s.val}%</span>
                    </div>
                    <MiniBar value={s.val} color={s.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile completion */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>Profile completion</h2>
              <span style={{
                fontSize: '12px', fontWeight: '600',
                color: completionPct === 100 ? '#34d399' : '#fb923c',
                background: completionPct === 100 ? 'rgba(52,211,153,0.1)' : 'rgba(251,146,60,0.1)',
                padding: '3px 10px', borderRadius: '100px',
              }}>{completionPct}%</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <MiniBar value={completionPct} color={completionPct === 100 ? '#34d399' : '#38bdf8'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {completionTasks.map(t => (
                <Link key={t.label} to={t.path} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '8px 10px', borderRadius: '8px',
                    backgroundColor: t.done ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${t.done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = t.done ? 'rgba(52,211,153,0.4)' : 'rgba(56,189,248,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = t.done ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)'}
                  >
                    <span style={{ fontSize: '13px' }}>{t.done ? '✅' : '⭕'}</span>
                    <span style={{ fontSize: '12px', color: t.done ? '#34d399' : '#94a3b8', fontWeight: t.done ? '500' : '400' }}>{t.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Health checks */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>Health checks</h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{healthPassed}/{healthItems.length} passed</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {healthItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  backgroundColor: item.passed ? 'rgba(52,211,153,0.05)' : 'rgba(251,113,133,0.05)',
                }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>{item.passed ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '12px', color: item.passed ? '#94a3b8' : '#fb7185', lineHeight: '1.3' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', marginBottom: '12px', marginTop: 0 }}>Recent activity</h2>
            <ActivityItem icon="📝" text="Resume builder session" time="2 hours ago" color="rgba(56,189,248,0.12)" />
            <ActivityItem icon="📊" text="Checked resume score" time="Yesterday" color="rgba(129,140,248,0.12)" />
            <ActivityItem icon="🎯" text="Interview practice session" time="2 days ago" color="rgba(52,211,153,0.12)" />
            <ActivityItem icon="💬" text="Generated a cold DM" time="3 days ago" color="rgba(251,146,60,0.12)" />
            <div style={{ marginTop: '12px' }}>
              <Link to="/tracker" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Template quick pick */}
      <div style={{ ...card, marginBottom: '20px', background: 'linear-gradient(135deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: 0 }}>Resume templates</h2>
          <Link to="/resume-templates" style={{ fontSize: '12px', color: '#38bdf8', textDecoration: 'none', fontWeight: '500' }}>See all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {resumeTemplates.map(t => (
            <Link to="/resume-templates" key={t.id} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '14px 16px', borderRadius: '12px',
                border: `1px solid ${selectedTemplate === t.id ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.07)'}`,
                backgroundColor: selectedTemplate === t.id ? 'rgba(56,189,248,0.08)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = selectedTemplate === t.id ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.07)'}
              >
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{t.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '3px' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>{t.description}</div>
                {selectedTemplate === t.id && (
                  <div style={{
                    marginTop: '8px', fontSize: '11px', color: '#38bdf8',
                    background: 'rgba(56,189,248,0.1)', padding: '2px 8px',
                    borderRadius: '100px', display: 'inline-block', fontWeight: '500',
                  }}>Active</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All tools grid */}
      <div style={{ ...card, background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(56,189,248,0.04))' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 18px 0' }}>All tools</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px' }}>
          {toolLinks.map(t => (
            <QuickAction key={t.to} {...t} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard