import { useMemo, useState } from 'react'
import { getStoredResume, getStoredTemplate, resumeTemplates } from '../utils/resumeStorage'
import { calculateResumeScore, buildKeywordCoverage, getHealthChecklist, getRoleBenchmark, getTemplateAtsImpact } from '../utils/scoreUtils'
import ScoreChart from '../components/ScoreChart'
import ScoreBreakdown from '../components/ScoreBreakdown'
import HealthChecklist from '../components/HealthChecklist'
import InsightsPanel from '../components/InsightsPanel'
import { AnimatedProgress } from '../components/motion/MotionPrimitives'

const roles = [
  { value: 'dotnet', label: '.NET Developer' },
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'fullstack', label: 'Full Stack Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'qa', label: 'QA Tester' },
  { value: 'dataanalyst', label: 'Data Analyst' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'android', label: 'Android Developer' },
]

const defaultJobDescription = `Looking for a results-driven software engineer with experience in modern web development, cloud architecture, strong communication skills, and practical project delivery.`

function ResumeScore() {
  const [resumeData] = useState(getStoredResume())
  const [selectedTemplate, setSelectedTemplate] = useState(getStoredTemplate())
  const [targetRole, setTargetRole] = useState('fullstack')
  const [jobDescription] = useState(defaultJobDescription)
  const templateAtsImpact = useMemo(() => getTemplateAtsImpact(selectedTemplate), [selectedTemplate])

  const keywordCoverage = useMemo(() => buildKeywordCoverage(resumeData, jobDescription), [resumeData, jobDescription])
  const scores = useMemo(() => calculateResumeScore(resumeData, selectedTemplate, jobDescription), [resumeData, selectedTemplate, jobDescription])
  const healthItems = useMemo(() => getHealthChecklist(resumeData), [resumeData])
  const benchmark = useMemo(() => getRoleBenchmark(targetRole), [targetRole])

  const strengths = [
    resumeData.projects.some((project) => project.name && project.description) ? 'Strong project portfolio' : 'Add more project detail',
    resumeData.skills.filter(Boolean).length >= 5 ? 'Good skills breadth' : 'Add more core skills',
    resumeData.experience.some((item) => item.company && item.position) ? 'Relevant work experience' : 'Add detailed experience entries',
  ].filter(Boolean)

  const weaknesses = [
    !resumeData.personalInfo.summary && 'Missing professional summary',
    !resumeData.personalInfo.linkedin && 'LinkedIn profile not added',
    !resumeData.personalInfo.github && 'GitHub profile not added',
    !resumeData.experience.some((item) => (item.achievements || []).some(Boolean)) && 'Missing measurable achievements in experience',
    keywordCoverage.coverage < 40 && 'Low keyword match to target job description',
  ].filter(Boolean)

  const templateCards = resumeTemplates.map((template) => ({
    ...template,
    atsScore: calculateResumeScore(resumeData, template.id, jobDescription).atsCompatibility,
  }))

  return (
    <div className="resume-score-page">
      <header className="page-hero">
        <span className="hero-eyebrow">Resume Score</span>
        <h1>Your resume health dashboard</h1>
        <p className="hero-copy">Track resume quality, ATS compatibility, keyword coverage, and improvement opportunities across templates and target roles.</p>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-main">
          <div className="card hero-card glass-card">
            <div className="hero-row">
              <div>
                <span className="small-label">Live resume score</span>
                <h2>{scores.overall}</h2>
              </div>
              <div className="badge-group">
                <span className="badge-pill">ATS {scores.atsCompatibility}%</span>
                <span className="badge-pill badge-success">Complete {scores.completeness}%</span>
              </div>
            </div>
            <div className="hero-footer">
              <span className="metric-pill">Template ATS impact: {templateAtsImpact.label}</span>
              <span className="metric-pill metric-neutral">Score uses your selected template, role, and resume details.</span>
            </div>
          </div>

          <div className="grid-two">
            <div className="card panel-card glass-card">
              <div className="panel-heading">
                <h3>Target role benchmark</h3>
              </div>
              <div className="panel-content">
                <label htmlFor="role-select">Role</label>
                <select id="role-select" value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <div className="benchmark-list">
                  <div>
                    <span>Average resume score</span>
                    <strong>{benchmark.average}</strong>
                  </div>
                  <div>
                    <span>Top 10% candidate</span>
                    <strong>{benchmark.top10}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card panel-card glass-card">
              <div className="panel-heading">
                <h3>Keyword coverage</h3>
              </div>
              <div className="panel-content">
                <div className="coverage-summary">
                  <span>{keywordCoverage.matchedKeywords.length} matched</span>
                  <span>{keywordCoverage.missingKeywords.length} missing</span>
                </div>
                <div className="progress-bar">
                  <AnimatedProgress value={keywordCoverage.coverage} />
                </div>
                <p>{keywordCoverage.coverage}% keyword coverage against the target role.</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="dashboard-side">
          <div className="card chart-card glass-card">
            <ScoreChart score={scores.overall} />
          </div>
          <div className="card panel-card glass-card">
            <h3>Health checklist</h3>
            <HealthChecklist items={healthItems} />
          </div>
        </aside>
      </section>

      <section className="section-grid">
        <div className="card panel-card glass-card">
          <h3>Score breakdown</h3>
          <ScoreBreakdown scores={scores} />
        </div>

        <div className="card recommendation-card glass-card">
          <h3>AI Recommendations</h3>
          <ul className="recommendation-list">
            {!resumeData.personalInfo.linkedin && <li>Add your LinkedIn profile</li>}
            {!resumeData.personalInfo.github && <li>Add your GitHub profile</li>}
            {!resumeData.personalInfo.portfolio && <li>Add your portfolio URL</li>}
            {!resumeData.personalInfo.summary && <li>Write a professional summary</li>}
            {resumeData.projects.filter((project) => project.name && project.description).length < 2 && <li>Add at least 2 strong projects</li>}
            {resumeData.certifications.filter((item) => item.name && item.issuer).length === 0 && <li>Add relevant certifications</li>}
            {!resumeData.experience.some((item) => (item.achievements || []).some(Boolean)) && <li>Include measurable achievements in work experience</li>}
          </ul>
        </div>
      </section>

      <section className="section-card glass-card">
        <div className="section-header">
          <h3>Template ATS score preview</h3>
        </div>
        <div className="template-grid">
          {templateCards.map((template) => (
            <button
              key={template.id}
              className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="template-meta">
                <span className="template-icon">{template.icon}</span>
                <span>{template.name}</span>
              </div>
              <p>{template.description}</p>
              <div className="template-score">
                <span>ATS Score</span>
                <strong>{template.atsScore}%</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section-card glass-card">
        <h3>Resume strengths & weaknesses</h3>
        <InsightsPanel strengths={strengths} weaknesses={weaknesses} />
      </section>
    </div>
  )
}

export default ResumeScore
