import { useState } from 'react'
import { generateMessage as generateMessageAI } from '../services/aiService'
import { getCurrentUsage } from '../services/paymentService'
import { useAuth } from '../AuthProvider'

const messageTypes = [
  {
    id: 'linkedin-connect',
    icon: '🤝',
    title: 'LinkedIn Connection',
    description: 'Send to HR or employee at target company',
    color: '#38bdf8',
  },
  {
    id: 'linkedin-referral',
    icon: '🌟',
    title: 'Referral Request',
    description: 'Ask someone to refer you internally',
    color: '#818cf8',
  },
  {
    id: 'hr-cold',
    icon: '💼',
    title: 'HR Cold Message',
    description: 'Reach out to HR directly about opening',
    color: '#34d399',
  },
  {
    id: 'follow-up',
    icon: '🔔',
    title: 'Follow Up Message',
    description: 'Follow up after applying or interview',
    color: '#fb7185',
  },
]

const generateMessage = (type, form) => {
  const { name, company, role, yourName, experience, skills, interviewDate } = form

  switch (type) {
    case 'linkedin-connect':
      return `Hi ${name || '[Name]'},

I came across your profile while exploring opportunities at ${company || '[Company]'}. I'm ${yourName || '[Your Name]'}, a ${experience || 'fresher'} with skills in ${skills || '[Your Skills]'}.

I'm very interested in the ${role || '[Role]'} position at ${company || '[Company]'} and would love to connect with you.

Looking forward to connecting!

Best regards,
${yourName || '[Your Name]'}`

    case 'linkedin-referral':
      return `Hi ${name || '[Name]'},

Hope you're doing well! I noticed you work at ${company || '[Company]'} and I'm reaching out because I'm very interested in the ${role || '[Role]'} position there.

I'm ${yourName || '[Your Name]'}, a ${experience || 'fresher'} with experience in ${skills || '[Your Skills]'}. I believe I'd be a great fit for this role.

Would you be open to referring me for this position? I've already applied through the official portal. I'd be happy to share my resume for your review.

Thank you so much for your time!

Best regards,
${yourName || '[Your Name]'}`

    case 'hr-cold':
      return `Hi ${name || '[Hiring Manager]'},

I hope this message finds you well. I'm ${yourName || '[Your Name]'}, a ${experience || 'fresher'} actively looking for ${role || '[Role]'} opportunities.

I came across ${company || '[Company]'} and I'm genuinely excited about your work. My key skills include ${skills || '[Your Skills]'}, and I believe I can add real value to your team.

I'd love to explore if there are any suitable openings. I'm attaching my resume for your reference.

Would you be open to a quick 15-minute call?

Thank you for your time!

Best regards,
${yourName || '[Your Name]'}`

    case 'follow-up':
      return `Hi ${name || '[Name]'},

I hope you're doing well! I'm following up on my application for the ${role || '[Role]'} position at ${company || '[Company]'}${interviewDate ? ` after our interview on ${interviewDate}` : ''}.

I wanted to reiterate my strong interest in this opportunity. I'm ${yourName || '[Your Name]'} with skills in ${skills || '[Your Skills]'} and I'm very excited about the possibility of joining ${company || '[Company]'}.

Could you please update me on the status of my application?

Thank you for your time and consideration!

Best regards,
${yourName || '[Your Name]'}`

    default:
      return ''
  }
}

function Messages() {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState('linkedin-connect')
  const [level, setLevel] = useState('fresher')
  const [form, setForm] = useState({
    yourName: '',
    name: '',
    company: '',
    role: '',
    experience: '',
    skills: '',
    interviewDate: '',
  })
  const [copied, setCopied] = useState(false)
  const [aiMessage, setAiMessage] = useState('')
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState('')
  const [isPremium, setIsPremium] = useState(false)

  useState(() => {
    if (user) {
      getCurrentUsage().then(u => setIsPremium(u.isPremium))
    }
  }, [user])

  const actionMap = {
    'linkedin-connect': 'linkedin_connect',
    'linkedin-referral': 'referral_request',
    'hr-cold': 'hr_cold',
    'follow-up': 'follow_up_message',
  }

  const staticMessage = generateMessage(selectedType, form)
  const message = aiMessage || staticMessage

  const handleCopy = () => {
    navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateAI = async () => {
    if (!isPremium) return
    setGenerating(true)
    setAiError('')
    setAiMessage('')
    try {
      const action = actionMap[selectedType]
      const result = await generateMessageAI(action, form, level)
      setAiMessage(result)
    } catch (err) {
      setAiError(err.message || 'Failed to generate. Please try again.')
    }
    setGenerating(false)
  }

  const selectedTypeData = messageTypes.find(t => t.id === selectedType)

  const levels = [
    { value: 'fresher', label: '🎓 Fresher', desc: '0-1 yr' },
    { value: 'intermediate', label: '💼 Intermediate', desc: '1-3 yrs' },
    { value: 'experienced', label: '🚀 Experienced', desc: '3+ yrs' },
  ]

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '60px 32px',
    }}>

      {/* Heading */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          ✦ Free Message Generator
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Message Generator
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          Generate professional LinkedIn and HR messages in seconds — just fill in the details
        </p>
      </div>

      {/* Message Type Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '16px',
        marginBottom: '40px',
      }}>
        {messageTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            style={{
              padding: '20px',
              backgroundColor: selectedType === type.id
                ? `rgba(56,189,248,0.1)`
                : 'rgba(255,255,255,0.03)',
              border: selectedType === type.id
                ? `1px solid ${type.color}66`
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              boxShadow: selectedType === type.id
                ? `0 0 20px ${type.color}22`
                : 'none',
            }}
            onMouseEnter={e => {
              if (selectedType !== type.id) {
                e.currentTarget.style.borderColor = `${type.color}44`
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              }
            }}
            onMouseLeave={e => {
              if (selectedType !== type.id) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
              }
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{type.icon}</div>
            <p style={{
              fontSize: '13px',
              fontWeight: '700',
              color: selectedType === type.id ? type.color : 'var(--text-primary)',
              marginBottom: '4px',
            }}>
              {type.title}
            </p>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              lineHeight: '1.4',
            }}>
              {type.description}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>

        {/* Left — Form */}
        <div style={{
          padding: '32px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
        }}>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}>
            📝 FILL IN DETAILS
          </p>

          {/* Experience Level Selector */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px' }}>
              YOUR EXPERIENCE LEVEL
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {levels.map(l => (
                <button
                  key={l.value}
                  onClick={() => { setLevel(l.value); setAiMessage(''); }}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                    background: level === l.value
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.05)',
                    color: level === l.value ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {l.label}<br/>
                  <span style={{ fontSize: '10px', opacity: 0.8 }}>{l.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'yourName', label: 'Your Name', placeholder: 'e.g. Rahul Kumar' },
              { key: 'name', label: 'Recipient Name', placeholder: 'e.g. Priya Sharma' },
              { key: 'company', label: 'Company', placeholder: 'e.g. TCS, Infosys' },
              { key: 'role', label: 'Target Role', placeholder: 'e.g. .NET Developer' },
              { key: 'experience', label: 'Your Experience', placeholder: 'e.g. Fresher, 1 year' },
              { key: 'skills', label: 'Key Skills', placeholder: 'e.g. C#, ASP.NET, SQL' },
              ...(selectedType === 'follow-up' ? [{ key: 'interviewDate', label: 'Interview Date', placeholder: 'e.g. 15 June 2025' }] : []),
            ].map((field) => (
              <div key={field.key}>
                <label style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  marginBottom: '6px',
                }}>
                  {field.label}
                </label>
                <input
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(56,189,248,0.2)'}
                />
              </div>
            ))}
          </div>

          {/* AI Generate Button */}
          <div style={{ marginTop: '24px' }}>
            {isPremium ? (
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: 'none', cursor: generating ? 'wait' : 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', fontSize: '14px', fontWeight: '700',
                  opacity: generating ? 0.7 : 1, transition: 'opacity 0.2s',
                }}
              >
                {generating ? '✨ Generating...' : '✨ Generate with AI'}
              </button>
            ) : (
              <div style={{
                padding: '12px 16px', borderRadius: '10px',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.2)',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: '#818cf8', fontWeight: '600', margin: '0 0 4px' }}>
                  ⭐ AI Generation is Premium
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                  Upgrade to ₹21/month for personalized AI messages
                </p>
              </div>
            )}
            {aiError && (
              <p style={{ color: '#fb7185', fontSize: '13px', marginTop: '8px' }}>⚠️ {aiError}</p>
            )}
          </div>
        </div>

        {/* Right — Generated Message */}
        <div style={{
          padding: '32px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: `1px solid ${selectedTypeData?.color}33`,
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '1px',
            }}>
              ✉️ GENERATED MESSAGE
            </p>
            {aiMessage && isPremium && (
              <button
                onClick={handleGenerateAI}
                disabled={generating}
                style={{
                  padding: '6px 14px', marginRight: '8px',
                  backgroundColor: 'rgba(99,102,241,0.1)',
                  color: '#818cf8',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '8px', fontSize: '13px',
                  cursor: generating ? 'wait' : 'pointer',
                  fontWeight: '600', transition: 'all 0.2s ease',
                }}
              >
                {generating ? '...' : '🔄 Regenerate'}
              </button>
            )}
         
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 16px',
                backgroundColor: copied ? 'rgba(52,211,153,0.1)' : 'transparent',
                color: copied ? '#34d399' : '#94a3b8',
                border: copied
                  ? '1px solid rgba(52,211,153,0.3)'
                  : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>

          {/* Message Preview */}
          <div style={{
            flex: 1,
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.8',
            whiteSpace: 'pre-line',
            fontFamily: 'Inter, sans-serif',
            overflowY: 'auto',
            minHeight: '300px',
          }}>
            {message}
          </div>

          {/* Tips */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: `${selectedTypeData?.color}08`,
            border: `1px solid ${selectedTypeData?.color}20`,
            borderRadius: '10px',
          }}>
            <p style={{
              fontSize: '12px',
              color: selectedTypeData?.color,
              fontWeight: '600',
              marginBottom: '4px',
            }}>
              💡 Pro Tip:
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {selectedType === 'linkedin-connect' && 'Keep it short and genuine. Personalize with something specific about their profile.'}
              {selectedType === 'linkedin-referral' && 'Always apply first before asking for referral. Attach your resume.'}
              {selectedType === 'hr-cold' && 'Send on Tuesday-Thursday morning for best response rates.'}
              {selectedType === 'follow-up' && 'Wait 5-7 days after applying before following up. Be polite and concise.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages