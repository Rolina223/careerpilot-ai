import { useState, useRef } from 'react'
import ResultSection from './ResultSection'

function useTilt() {
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const card = ref.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return { ref, handleMouseMove, handleMouseLeave }
}

const roles = [
  { value: 'dotnet', label: '.NET Developer', icon: '⚙️' },
  { value: 'frontend', label: 'Frontend Developer', icon: '🎨' },
  { value: 'fullstack', label: 'Full Stack Developer', icon: '🚀' },
  { value: 'backend', label: 'Backend Developer', icon: '🔧' },
  { value: 'qa', label: 'QA Tester', icon: '🧪' },
  { value: 'dataanalyst', label: 'Data Analyst', icon: '📊' },
  { value: 'devops', label: 'DevOps Engineer', icon: '☁️' },
  { value: 'android', label: 'Android Developer', icon: '📱' },
]

const mockResult = {
  matchScore: 72,
  matchedSkills: ['C#', 'ASP.NET', 'SQL Server', 'REST API', 'Git'],
  missingSkills: ['Docker', 'Azure', 'CI/CD', 'Redis', 'Microservices'],
  suggestions: [
    'Add quantifiable achievements — e.g. "Reduced API response time by 30%"',
    'Include GitHub profile link with your projects',
    'Add a strong professional summary at the top',
    'Use more action verbs — Built, Developed, Optimized, Designed',
  ],
  questions: [
    'What is the difference between ASP.NET MVC and Web API?',
    'Explain Entity Framework and Code First approach.',
    'What are the SOLID principles? Give an example.',
    'How does dependency injection work in .NET Core?',
    'What is the difference between IEnumerable and IQueryable?',
  ],
  coverLetter: `Dear Hiring Manager,

I am excited to apply for this position. With my experience in C#, ASP.NET, and SQL Server, I am confident in my ability to contribute effectively to your team.

During my experience, I have developed strong skills in building REST APIs, working with MVC architecture, and writing optimized SQL queries. I am a quick learner and passionate about writing clean, maintainable code.

I would love the opportunity to discuss how my skills align with your team's goals.

Warm regards,
[Your Name]`,

hrMessage: `Hi [Hiring Manager's Name],

I came across your opening for a .NET Developer and I'm very interested in this opportunity.

I have hands-on experience with C#, ASP.NET MVC, SQL Server, and REST APIs. I've built and maintained web applications and am comfortable working in agile environments.

I'd love to connect and discuss how I can contribute to your team.

Best regards,
[Your Name]
[LinkedIn Profile]
[Phone Number]`,

resumeBullets: [
  '• Developed and maintained RESTful APIs using ASP.NET Web API, improving response time by 25%',
  '• Designed and optimized SQL Server databases, reducing query execution time by 30%',
  '• Implemented MVC architecture using ASP.NET MVC for scalable web applications',
  '• Collaborated with cross-functional teams using Agile/Scrum methodology',
  '• Integrated third-party APIs and services to enhance application functionality',
]
}

function AnalyzeSection() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [resume, setResume] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const resultRef = useRef(null)
  const tiltResume = useTilt()
  const tiltJD = useTilt()

  const handleAnalyze = () => {
    if (!selectedRole) {
      alert('Please select your target role first!')
      return
    }
    if (!resume.trim()) {
      alert('Please paste your resume!')
      return
    }
    if (!jobDescription.trim()) {
      alert('Please paste the job description!')
      return
    }

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      setResult(mockResult)
      setLoading(false)
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }, 2500)
  }

  return (
    <div style={{
      padding: '60px 32px',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>

      {/* Section Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          Analyze Your Resume
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Paste your resume and job description — AI will do the rest
        </p>
      </div>

      {/* Custom Dropdown */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '1px'
        }}>
          SELECT YOUR TARGET ROLE
        </label>

        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            padding: '14px 20px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: dropdownOpen
              ? '1px solid rgba(56,189,248,0.6)'
              : '1px solid rgba(56,189,248,0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backdropFilter: 'blur(20px)',
            boxShadow: dropdownOpen ? 'var(--glow)' : 'none',
            transition: 'all 0.3s ease',
          }}>
          <span style={{
            fontSize: '15px',
            color: selectedRole ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: selectedRole ? '600' : '400'
          }}>
            {selectedRole
              ? `${selectedRole.icon} ${selectedRole.label}`
              : '🎯 Choose your role...'}
          </span>
          <span style={{
            color: 'var(--primary)',
            fontSize: '18px',
            transition: 'transform 0.3s ease',
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block'
          }}>
            ▾
          </span>
        </div>

        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '0',
            right: '0',
            backgroundColor: '#0f1f35',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
            zIndex: '50',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)',
          }}>
            {roles.map((role, index) => (
              <div
                key={role.value}
                onClick={() => {
                  setSelectedRole(role)
                  setDropdownOpen(false)
                }}
                style={{
                  padding: '14px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: index < roles.length - 1
                    ? '1px solid rgba(255,255,255,0.05)'
                    : 'none',
                  backgroundColor: selectedRole?.value === role.value
                    ? 'rgba(56,189,248,0.1)'
                    : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.08)'
                  e.currentTarget.style.paddingLeft = '24px'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor =
                    selectedRole?.value === role.value
                      ? 'rgba(56,189,248,0.1)'
                      : 'transparent'
                  e.currentTarget.style.paddingLeft = '20px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{role.icon}</span>
                <span style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: selectedRole?.value === role.value
                    ? 'var(--primary)'
                    : 'var(--text-primary)'
                }}>
                  {role.label}
                </span>
                {selectedRole?.value === role.value && (
                  <span style={{
                    marginLeft: 'auto',
                    color: 'var(--primary)',
                    fontSize: '16px'
                  }}>✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Textareas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>

        {/* Resume Card */}
        <div
          ref={tiltResume.ref}
          onMouseMove={tiltResume.handleMouseMove}
          onMouseLeave={tiltResume.handleMouseLeave}
          className="tilt-card"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              📄 YOUR RESUME
            </label>
            <span style={{
              color: resume.length > 0 ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {resume.length} chars
            </span>
          </div>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here...

Example:
John Doe — Software Engineer
Skills: C#, ASP.NET, SQL Server, React
Experience: 1 year at ABC Corp"
            style={{
              width: '100%',
              height: '280px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.7',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(56,189,248,0.6)'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(56,189,248,0.2)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {resume && (
            <button
              onClick={() => setResume('')}
              style={{
                marginTop: '8px',
                padding: '5px 12px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* JD Card */}
        <div
          ref={tiltJD.ref}
          onMouseMove={tiltJD.handleMouseMove}
          onMouseLeave={tiltJD.handleMouseLeave}
          className="tilt-card"
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              💼 JOB DESCRIPTION
            </label>
            <span style={{
              color: jobDescription.length > 0 ? 'var(--primary)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {jobDescription.length} chars
            </span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here...

Example:
Looking for .NET Developer
Requirements:
- 0-2 years experience
- C#, ASP.NET MVC, SQL Server"
            style={{
              width: '100%',
              height: '280px',
              padding: '16px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(56,189,248,0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.7',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(56,189,248,0.6)'
              e.target.style.boxShadow = '0 0 0 3px rgba(56,189,248,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(56,189,248,0.2)'
              e.target.style.boxShadow = 'none'
            }}
          />
          {jobDescription && (
            <button
              onClick={() => setJobDescription('')}
              style={{
                marginTop: '8px',
                padding: '5px 12px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          className="btn-primary"
          onClick={handleAnalyze}
          style={{
            padding: '16px 56px',
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '0.5px',
            borderRadius: '12px',
          }}>
          {loading ? '⏳ Analyzing...' : '✨ Analyze Now'}
        </button>
        <p style={{
          marginTop: '12px',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          Free to use · No signup required
        </p>
      </div>

      {/* Loading Animation */}
      {loading && (
        <div className="fade-in" style={{
          textAlign: 'center',
          padding: '48px',
          marginTop: '32px',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(56,189,248,0.2)',
            borderTop: '3px solid #38bdf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            AI is analyzing your resume...
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            marginTop: '8px',
            opacity: '0.6'
          }}>
            Matching skills, finding gaps, preparing suggestions
          </p>
        </div>
      )}

      {/* Result Section */}
      <div ref={resultRef}>
        <ResultSection result={result} />
      </div>

    </div>
  )
}

export default AnalyzeSection