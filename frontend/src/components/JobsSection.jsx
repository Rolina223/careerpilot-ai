import { useState } from 'react'

const allJobs = [
  {
    id: 1,
    company: 'TCS',
    role: '.NET Developer',
    location: 'Bangalore',
    experience: '0-2 years',
    salary: '3-5 LPA',
    type: 'Full Time',
    tags: ['.NET', 'C#', 'SQL'],
    category: 'dotnet',
    logo: '🏢',
    posted: '2 days ago',
    link: 'https://www.tcs.com/careers',
  },
  {
    id: 2,
    company: 'Infosys',
    role: 'React Developer',
    location: 'Pune',
    experience: '0-1 year',
    salary: '3-4 LPA',
    type: 'Full Time',
    tags: ['React', 'JavaScript', 'CSS'],
    category: 'frontend',
    logo: '🌐',
    posted: '1 day ago',
    link: 'https://www.infosys.com/careers',
  },
  {
    id: 3,
    company: 'Wipro',
    role: 'Full Stack Developer',
    location: 'Hyderabad',
    experience: '0-2 years',
    salary: '4-6 LPA',
    type: 'Full Time',
    tags: ['React', '.NET', 'SQL'],
    category: 'fullstack',
    logo: '💻',
    posted: '3 days ago',
    link: 'https://careers.wipro.com',
  },
  {
    id: 4,
    company: 'Capgemini',
    role: 'QA Engineer',
    location: 'Chennai',
    experience: '0-1 year',
    salary: '2-4 LPA',
    type: 'Full Time',
    tags: ['Selenium', 'Manual Testing', 'JIRA'],
    category: 'qa',
    logo: '🔍',
    posted: '1 day ago',
    link: 'https://www.capgemini.com/careers',
  },
  {
    id: 5,
    company: 'Accenture',
    role: 'Backend Developer',
    location: 'Mumbai',
    experience: '0-2 years',
    salary: '4-5 LPA',
    type: 'Full Time',
    tags: ['Node.js', 'Python', 'REST API'],
    category: 'backend',
    logo: '⚡',
    posted: '4 days ago',
    link: 'https://www.accenture.com/careers',
  },
  {
    id: 6,
    company: 'HCL Technologies',
    role: '.NET Developer',
    location: 'Noida',
    experience: '0-1 year',
    salary: '3-4 LPA',
    type: 'Full Time',
    tags: ['ASP.NET', 'MVC', 'SQL Server'],
    category: 'dotnet',
    logo: '🏗️',
    posted: '2 days ago',
    link: 'https://www.hcltech.com/careers',
  },
  {
    id: 7,
    company: 'Cognizant',
    role: 'Data Analyst',
    location: 'Bangalore',
    experience: '0-2 years',
    salary: '3-5 LPA',
    type: 'Full Time',
    tags: ['Python', 'SQL', 'Power BI'],
    category: 'dataanalyst',
    logo: '📊',
    posted: '1 day ago',
    link: 'https://careers.cognizant.com',
  },
  {
    id: 8,
    company: 'Tech Mahindra',
    role: 'Android Developer',
    location: 'Pune',
    experience: '0-1 year',
    salary: '3-4 LPA',
    type: 'Full Time',
    tags: ['Kotlin', 'Android', 'Firebase'],
    category: 'android',
    logo: '📱',
    posted: '5 days ago',
    link: 'https://careers.techmahindra.com',
  },
  {
    id: 9,
    company: 'Mphasis',
    role: 'DevOps Engineer',
    location: 'Bangalore',
    experience: '0-2 years',
    salary: '4-6 LPA',
    type: 'Full Time',
    tags: ['Docker', 'AWS', 'CI/CD'],
    category: 'devops',
    logo: '☁️',
    posted: '3 days ago',
    link: 'https://www.mphasis.com/careers',
  },
  {
    id: 10,
    company: 'Persistent Systems',
    role: 'Full Stack Developer',
    location: 'Remote',
    experience: '0-1 year',
    salary: '4-5 LPA',
    type: 'Remote',
    tags: ['React', 'Node.js', 'MongoDB'],
    category: 'fullstack',
    logo: '🚀',
    posted: '1 day ago',
    link: 'https://www.persistent.com/careers',
  },
]

const filters = [
  { label: 'All Jobs', value: 'all' },
  { label: '⚙️ .NET', value: 'dotnet' },
  { label: '🎨 Frontend', value: 'frontend' },
  { label: '🚀 Full Stack', value: 'fullstack' },
  { label: '🔧 Backend', value: 'backend' },
  { label: '🧪 QA', value: 'qa' },
  { label: '📊 Data Analyst', value: 'dataanalyst' },
  { label: '☁️ DevOps', value: 'devops' },
  { label: '📱 Android', value: 'android' },
]

function JobsSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [savedJobs, setSavedJobs] = useState([])

  const filteredJobs = activeFilter === 'all'
    ? allJobs
    : allJobs.filter(job => job.category === activeFilter)

  const toggleSave = (id) => {
    setSavedJobs(prev =>
      prev.includes(id) ? prev.filter(j => j !== id) : [...prev, id]
    )
  }

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 32px',
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
          ✦ Updated Daily
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Browse Jobs
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
        }}>
          Curated fresher jobs — updated daily
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '32px',
        justifyContent: 'center',
      }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            style={{
              padding: '8px 18px',
              backgroundColor: activeFilter === f.value
                ? 'rgba(56,189,248,0.15)'
                : 'rgba(255,255,255,0.03)',
              color: activeFilter === f.value
                ? '#38bdf8'
                : '#94a3b8',
              border: activeFilter === f.value
                ? '1px solid rgba(56,189,248,0.5)'
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeFilter === f.value
                ? '0 0 15px rgba(56,189,248,0.2)'
                : 'none',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Job Count */}
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '20px',
        fontWeight: '500',
      }}>
        Showing {filteredJobs.length} jobs
        {activeFilter !== 'all' && ` for ${filters.find(f => f.value === activeFilter)?.label}`}
      </p>

      {/* Jobs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              padding: '24px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(56,189,248,0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(56,189,248,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Top Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}>
              {/* Company Info */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56,189,248,0.1)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {job.logo}
                </div>
                <div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '2px',
                  }}>
                    {job.company}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#38bdf8',
                    fontWeight: '500',
                  }}>
                    {job.role}
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={() => toggleSave(job.id)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: savedJobs.includes(job.id)
                    ? 'rgba(56,189,248,0.15)'
                    : 'rgba(255,255,255,0.05)',
                  border: savedJobs.includes(job.id)
                    ? '1px solid rgba(56,189,248,0.4)'
                    : '1px solid rgba(255,255,255,0.1)',
                  color: savedJobs.includes(job.id) ? '#38bdf8' : '#94a3b8',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {savedJobs.includes(job.id) ? '🔖' : '🤍'}
              </button>
            </div>

            {/* Details Row */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px',
              flexWrap: 'wrap',
            }}>
              {[
                { icon: '📍', text: job.location },
                { icon: '⏱️', text: job.experience },
                { icon: '💰', text: job.salary },
                { icon: '🏷️', text: job.type },
              ].map((detail, i) => (
                <span key={i} style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {detail.icon} {detail.text}
                </span>
              ))}
            </div>

            {/* Tags */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              marginBottom: '20px',
            }}>
              {job.tags.map((tag, i) => (
                <span key={i} style={{
                  padding: '3px 10px',
                  backgroundColor: 'rgba(129,140,248,0.1)',
                  border: '1px solid rgba(129,140,248,0.2)',
                  borderRadius: '100px',
                  fontSize: '11px',
                  color: '#818cf8',
                  fontWeight: '500',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Bottom Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}>
                🕐 {job.posted}
              </span>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  background: 'var(--gradient)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 0 15px rgba(56,189,248,0.2)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.target.style.boxShadow = '0 0 25px rgba(56,189,248,0.4)'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={e => {
                  e.target.style.boxShadow = '0 0 15px rgba(56,189,248,0.2)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                Apply Now →
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default JobsSection