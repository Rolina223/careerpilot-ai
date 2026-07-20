import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../AuthProvider'
import { getStoredResume, getStoredTemplate, resumeTemplates } from '../utils/resumeStorage'
import { calculateResumeScore, buildKeywordCoverage, getHealthChecklist } from '../utils/scoreUtils'
import { calculateResumeProgress, getResumeRecommendations, getPredictiveSuggestions } from '../utils/uxExperience'
import { logActivity } from '../utils/activityStorage'
import { AnimatedCounter, AnimatedProgress, MotionButton, MotionCard, motionTokens } from '../components/motion/MotionPrimitives'

function MiniBar({ value, color = 'var(--color-brand)', max = 100 }) {
  return (
    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
      <AnimatedProgress value={Math.min((value / max) * 100, 100)} className="" style={{
        height: '100%',
        background: color,
        borderRadius: '4px',
      }} />
    </div>
  )
}

function StatCard({ icon, label, value, sub, color = 'var(--color-brand)', glowColor }) {
  return (
    <MotionCard style={{
      padding: '22px',
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(56,189,248,0.12)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      cursor: 'default',
    }}
      whileHover={{ y: -3, boxShadow: glowColor || '0 0 24px rgba(56,189,248,0.18)', borderColor: 'rgba(56,189,248,0.35)' }}
    >
      <div style={{ fontSize: '22px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: '800', color, letterSpacing: '-0.5px', lineHeight: '1' }}>
        {typeof value === 'number' ? <AnimatedCounter value={value} /> : String(value).endsWith('%') ? <AnimatedCounter value={value} suffix="%" /> : value}
      </div>
      <div style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '6px', fontWeight: '500' }}>{label}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--color-subtle)', marginTop: '4px' }}>{sub}</div>}
    </MotionCard>
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
        <div style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: '1.4' }}>{text}</div>
        <div style={{ fontSize: '11px', color: 'var(--color-subtle)', marginTop: '2px' }}>{time}</div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon, label, desc }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <MotionCard style={{
        padding: '18px',
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: '14px',
        cursor: 'pointer',
      }}
      whileHover={{ y: -3, borderColor: 'rgba(56,189,248,0.4)', boxShadow: '0 8px 30px rgba(56,189,248,0.15)' }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '12px', color: 'var(--color-subtle)', lineHeight: '1.4' }}>{desc}</div>
      </MotionCard>
    </Link>
  )
}

function ScoreRing({ score, size = 120, strokeWidth = 9 }) {
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.min(score, 100) / 100
  const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-brand)' : 'var(--color-danger)'

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <motion.circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 0.9, ease: motionTokens.ease }}
        strokeLinecap="round"
      />
      <text x={size / 2} y={size / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill={color} fontSize="22" fontWeight="800" fontFamily="Inter, sans-serif"
      >{score}</text>
      <text x={size / 2} y={size / 2 + 19}
        textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}
        fill="var(--color-subtle)" fontSize="10" fontFamily="Inter, sans-serif"
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

  const progress = useMemo(() => calculateResumeProgress(resumeData), [resumeData])
  const recommendations = useMemo(() => getResumeRecommendations(resumeData), [resumeData])
  const predictiveSuggestions = useMemo(() => getPredictiveSuggestions(resumeData), [resumeData])

  const scoreBreakdown = [
    { label: 'Overall score', val: scores.overall, color: 'var(--color-brand)' },
    { label: 'ATS compatibility', val: scores.atsCompatibility, color: 'var(--color-accent)' },
    { label: 'Completeness', val: scores.completeness, color: 'var(--color-success)' },
    { label: 'Keyword coverage', val: keywordCoverage.coverage, color: 'var(--color-warning)' },
  ]

  const toolLinks = [
    { to: '/analyze', icon: 'AI', label: 'Analyze resume', desc: 'Compare your profile against a target role.' },
    { to: '/resume-score', icon: 'SC', label: 'Resume score', desc: 'Review structure, keywords, and ATS readiness.' },
    { to: '/resume-builder', icon: 'RB', label: 'Resume builder', desc: 'Refine your resume with autosave and undo.' },
    { to: '/interview', icon: 'IV', label: 'Interview practice', desc: 'Practice answers and improve with feedback.' },
    { to: '/aptitude', icon: 'AP', label: 'Aptitude prep', desc: 'Build speed across reasoning and quantitative rounds.' },
    { to: '/coding', icon: 'CP', label: 'Coding prep', desc: 'Train on practical patterns and company-style sets.' },
    { to: '/tracker', icon: 'TR', label: 'Application tracker', desc: 'Keep status, notes, and follow-ups organized.' },
    { to: '/jobs', icon: 'JB', label: 'Browse jobs', desc: 'Find roles worth tailoring for.' },
    { to: '/messages', icon: 'MS', label: 'Message studio', desc: 'Draft focused outreach and follow-ups.' },
    { to: '/email-templates', icon: 'EM', label: 'Email studio', desc: 'Create clear recruiter-ready emails.' },
    { to: '/resume-templates', icon: 'TP', label: 'Templates', desc: 'Choose a clean ATS-friendly layout.' },
  ]
  const card = {
    padding: '24px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(56,189,248,0.12)',
    borderRadius: '16px',
    backdropFilter: 'blur(12px)',
  }

  return (
    <div className="dashboard-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', backgroundColor: 'rgba(56,189,248,0.08)',
            border: '1px solid rgba(56,189,248,0.2)', borderRadius: '100px',
            fontSize: '13px', color: 'var(--color-brand)', fontWeight: '500',
          }}>
            Career command center
          </div>
          <MotionButton
            onClick={() => {
              logActivity('Opened quick search', 'Used the command palette', '/dashboard')
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
            }}
            aria-label="Open quick actions"
            style={{
              padding: '8px 12px', borderRadius: '999px', border: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--color-muted)', cursor: 'pointer'
            }}
          >
            Quick actions
          </MotionButton>
        </div>
        <h1 style={{
          fontSize: '40px', fontWeight: '800', color: 'var(--color-text)',
          letterSpacing: '-0.8px', lineHeight: '1.15', marginBottom: '8px',
        }}>
          {greeting}, {userName}
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--color-subtle)', fontWeight: '400' }}>
          {hasResumeContent
            ? "Your search is organized. Here is what needs attention today."
            : 'Start with your resume. CareerPilot will turn it into a focused operating plan.'}
        </p>
        <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(91,67,232,0.10), rgba(56,189,248,0.08))', border: '1px solid rgba(91,67,232,0.16)', color: 'var(--color-text)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>Progress: {progress.percent}% complete</div>
          <div style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{progress.nextMilestone.message}</div>
        </div>
      </div>

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon="SC" label="Resume score" value={scores.overall} sub="Out of 100" color="var(--color-brand)" />
        <StatCard icon="ATS" label="ATS compatibility" value={`${scores.atsCompatibility}%`} color="var(--color-accent)" glowColor="0 0 24px rgba(129,140,248,0.2)" />
        <StatCard icon="OK" label="Profile complete" value={`${completionPct}%`} sub={`${doneCount} of ${completionTasks.length} done`} color="var(--color-success)" glowColor="0 0 24px rgba(52,211,153,0.2)" />
        <StatCard icon="KW" label="Keyword coverage" value={`${keywordCoverage.coverage}%`} sub={`${keywordCoverage.matchedKeywords.length} matched`} color="var(--color-warning)" glowColor="0 0 24px rgba(251,146,60,0.2)" />
      </div>

      {/* Main two-col layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', marginBottom: '20px', alignItems: 'start' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Recommendations */}
          <div style={{ ...card, background: 'linear-gradient(135deg, rgba(91,67,232,0.07), rgba(56,189,248,0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Smart recommendations</h2>
              <span style={{ fontSize: '12px', color: 'var(--color-brand)' }}>AI guided</span>
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {recommendations.map((item, index) => (
                <Link key={index} to={item.to} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '3px' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: '1.4' }}>{item.detail}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Score breakdown */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Score breakdown</h2>
              <Link to="/resume-score" style={{ fontSize: '12px', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: '500' }}>Full report →</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              <ScoreRing score={scores.overall} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {scoreBreakdown.map(s => (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{s.label}</span>
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
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Profile completion</h2>
              <span style={{
                fontSize: '12px', fontWeight: '600',
                color: completionPct === 100 ? 'var(--color-success)' : 'var(--color-warning)',
                background: completionPct === 100 ? 'rgba(52,211,153,0.1)' : 'rgba(251,146,60,0.1)',
                padding: '3px 10px', borderRadius: '100px',
              }}>{completionPct}%</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <MiniBar value={completionPct} color={completionPct === 100 ? 'var(--color-success)' : 'var(--color-brand)'} />
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
                    <span style={{ fontSize: '12px', color: t.done ? 'var(--color-success)' : 'var(--color-muted)', fontWeight: t.done ? '500' : '400' }}>{t.label}</span>
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
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Health checks</h2>
              <span style={{ fontSize: '12px', color: 'var(--color-subtle)' }}>{healthPassed}/{healthItems.length} passed</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {healthItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  backgroundColor: item.passed ? 'rgba(52,211,153,0.05)' : 'rgba(251,113,133,0.05)',
                }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>{item.passed ? '✅' : '❌'}</span>
                  <span style={{ fontSize: '12px', color: item.passed ? 'var(--color-muted)' : 'var(--color-danger)', lineHeight: '1.3' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div style={card}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', marginBottom: '12px', marginTop: 0 }}>Recent activity</h2>
            <ActivityItem icon="📝" text="Resume builder session" time="2 hours ago" color="rgba(56,189,248,0.12)" />
            <ActivityItem icon="📊" text="Checked resume score" time="Yesterday" color="rgba(129,140,248,0.12)" />
            <ActivityItem icon="🎯" text="Interview practice session" time="2 days ago" color="rgba(52,211,153,0.12)" />
            <ActivityItem icon="💬" text="Generated a cold DM" time="3 days ago" color="rgba(251,146,60,0.12)" />
            <div style={{ marginTop: '12px' }}>
              <Link to="/tracker" style={{ fontSize: '12px', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: '500' }}>
                View all activity →
              </Link>
            </div>
          </div>

          {/* Predictive suggestions */}
          <div style={{ ...card, background: 'rgba(255,255,255,0.025)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0, marginBottom: '12px' }}>Next best steps</h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {predictiveSuggestions.map((item, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'var(--color-muted)', lineHeight: '1.5' }}>• {item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template quick pick */}
      <div style={{ ...card, marginBottom: '20px', background: 'linear-gradient(135deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>Resume templates</h2>
          <Link to="/resume-templates" style={{ fontSize: '12px', color: 'var(--color-brand)', textDecoration: 'none', fontWeight: '500' }}>See all →</Link>
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
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)', marginBottom: '3px' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--color-subtle)', lineHeight: '1.4' }}>{t.description}</div>
                {selectedTemplate === t.id && (
                  <div style={{
                    marginTop: '8px', fontSize: '11px', color: 'var(--color-brand)',
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
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text)', margin: '0 0 18px 0' }}>All tools</h2>
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



