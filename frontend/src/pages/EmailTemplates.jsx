import { useState } from 'react'

const emailTypes = [
  {
    id: 'follow-up',
    icon: '🔔',
    title: 'Follow Up',
    description: 'After applying for a job',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(56,189,248,0.02))',
  },
  {
    id: 'thank-you',
    icon: '🙏',
    title: 'Thank You',
    description: 'After interview',
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(129,140,248,0.02))',
  },
  {
    id: 'offer-accept',
    icon: '✅',
    title: 'Offer Acceptance',
    description: 'Accept a job offer',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.02))',
  },
  {
    id: 'joining-delay',
    icon: '📅',
    title: 'Joining Delay',
    description: 'Request date extension',
    color: '#fb7185',
    gradient: 'linear-gradient(135deg, rgba(251,113,133,0.15), rgba(251,113,133,0.02))',
  },
  {
    id: 'negotiation',
    icon: '💰',
    title: 'Salary Negotiation',
    description: 'Negotiate your offer',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.02))',
  },
  {
    id: 'withdrawal',
    icon: '↩️',
    title: 'Withdrawal',
    description: 'Withdraw application',
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, rgba(148,163,184,0.15), rgba(148,163,184,0.02))',
  },
]

const generateEmail = (type, form) => {
  const { yourName, hrName, company, role, interviewDate, joiningDate, newJoiningDate, currentCTC, expectedCTC, reason } = form

  switch (type) {
    case 'follow-up':
      return {
        subject: `Follow Up — Application for ${role || '[Role]'} at ${company || '[Company]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nI hope this email finds you well.\n\nI am writing to follow up on my application for the ${role || '[Role]'} position at ${company || '[Company]'}, which I submitted recently.\n\nI am very enthusiastic about this opportunity and believe my skills would be a great fit for your team. I wanted to check if there are any updates regarding the status of my application.\n\nPlease let me know if you need any additional information from my end.\n\nThank you for your time and consideration.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    case 'thank-you':
      return {
        subject: `Thank You — Interview for ${role || '[Role]'} at ${company || '[Company]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nThank you for taking the time to interview me for the ${role || '[Role]'} position at ${company || '[Company]'} on ${interviewDate || '[Date]'}.\n\nIt was a pleasure learning more about the role and your team. I am even more excited about the opportunity after our conversation. The discussion about ${reason || '[something specific discussed]'} was particularly interesting.\n\nI believe my skills in ${form.skills || '[Your Skills]'} align well with what your team is looking for. I look forward to hearing from you regarding the next steps.\n\nThank you once again for this opportunity.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    case 'offer-accept':
      return {
        subject: `Offer Acceptance — ${role || '[Role]'} at ${company || '[Company]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nI am delighted to formally accept the offer for the ${role || '[Role]'} position at ${company || '[Company]'}.\n\nI am grateful for this opportunity and look forward to joining the team on ${joiningDate || '[Joining Date]'}. I am excited to contribute to the organization and grow professionally.\n\nPlease let me know if there are any documents or formalities I need to complete before my joining date.\n\nThank you once again for this wonderful opportunity.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    case 'joining-delay':
      return {
        subject: `Request for Joining Date Extension — ${role || '[Role]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nI hope you are doing well.\n\nI am writing regarding my joining date of ${joiningDate || '[Current Joining Date]'} for the ${role || '[Role]'} position at ${company || '[Company]'}.\n\nDue to ${reason || '[personal/family/academic reasons]'}, I would like to request an extension of my joining date to ${newJoiningDate || '[New Joining Date]'}. I sincerely apologize for any inconvenience this may cause.\n\nI am very excited about joining ${company || '[Company]'} and assure you that I will be fully committed from the new joining date.\n\nThank you for your understanding.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    case 'negotiation':
      return {
        subject: `Regarding Offer — ${role || '[Role]'} at ${company || '[Company]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nThank you for offering me the ${role || '[Role]'} position at ${company || '[Company]'}. I am genuinely excited about this opportunity.\n\nAfter careful consideration, I would like to discuss the compensation package. Based on my research and skills in ${form.skills || '[Your Skills]'}, I was expecting a CTC of ${expectedCTC || '[Expected CTC]'} LPA, compared to the offered ${currentCTC || '[Offered CTC]'} LPA.\n\nI am confident that I can add significant value to your team and would appreciate your consideration of this request.\n\nThank you for your time.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    case 'withdrawal':
      return {
        subject: `Withdrawal of Application — ${role || '[Role]'} at ${company || '[Company]'}`,
        body: `Dear ${hrName || 'Hiring Manager'},\n\nI hope you are doing well.\n\nI am writing to formally withdraw my application for the ${role || '[Role]'} position at ${company || '[Company]'}.\n\nAfter careful consideration, I have decided to ${reason || 'pursue another opportunity that better aligns with my current career goals'}. This was a difficult decision as I have great respect for ${company || '[Company]'} and the team.\n\nI sincerely apologize for any inconvenience caused and thank you for the time and consideration.\n\nThank you once again.\n\nBest regards,\n${yourName || '[Your Name]'}`
      }
    default:
      return { subject: '', body: '' }
  }
}

function EmailTemplates() {
  const [selectedType, setSelectedType] = useState('follow-up')
  const [form, setForm] = useState({
    yourName: '', hrName: '', company: '', role: '',
    skills: '', interviewDate: '', joiningDate: '',
    newJoiningDate: '', currentCTC: '', expectedCTC: '', reason: '',
  })
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedSubject, setCopiedSubject] = useState(false)

  const email = generateEmail(selectedType, form)
  const selectedTypeData = emailTypes.find(t => t.id === selectedType)

  const getFields = () => {
    const common = [
      { key: 'yourName', label: 'Your Name', placeholder: 'e.g. Rahul Kumar' },
      { key: 'hrName', label: 'HR / Manager Name', placeholder: 'e.g. Priya Sharma' },
      { key: 'company', label: 'Company', placeholder: 'e.g. TCS' },
      { key: 'role', label: 'Role', placeholder: 'e.g. .NET Developer' },
    ]
    switch (selectedType) {
      case 'thank-you':
        return [...common,
          { key: 'skills', label: 'Your Key Skills', placeholder: 'e.g. C#, ASP.NET' },
          { key: 'interviewDate', label: 'Interview Date', placeholder: 'e.g. 15 June 2025' },
          { key: 'reason', label: 'Topic Discussed', placeholder: 'e.g. microservices' },
        ]
      case 'offer-accept':
        return [...common, { key: 'joiningDate', label: 'Joining Date', placeholder: 'e.g. 1 July 2025' }]
      case 'joining-delay':
        return [...common,
          { key: 'joiningDate', label: 'Current Joining Date', placeholder: 'e.g. 1 July 2025' },
          { key: 'newJoiningDate', label: 'New Requested Date', placeholder: 'e.g. 15 July 2025' },
          { key: 'reason', label: 'Reason', placeholder: 'e.g. family emergency' },
        ]
      case 'negotiation':
        return [...common,
          { key: 'skills', label: 'Your Key Skills', placeholder: 'e.g. C#, ASP.NET' },
          { key: 'currentCTC', label: 'Offered CTC (LPA)', placeholder: 'e.g. 3.5' },
          { key: 'expectedCTC', label: 'Expected CTC (LPA)', placeholder: 'e.g. 4.5' },
        ]
      case 'withdrawal':
        return [...common, { key: 'reason', label: 'Reason (optional)', placeholder: 'e.g. accepted another offer' }]
      default:
        return common
    }
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 32px',
      position: 'relative',
    }}>

      {/* Background Orbs */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '20%',
        right: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

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
          boxShadow: '0 0 20px rgba(56,189,248,0.1)',
        }}>
          ✦ Professional Email Generator
        </div>
        <h2 style={{
          fontSize: '40px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
          letterSpacing: '-1px',
        }}>
          Email Templates
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: '1.7',
        }}>
          Professional emails for every job situation — ready in seconds
        </p>
      </div>

      {/* Email Type Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        marginBottom: '48px',
      }}>
        {emailTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            style={{
              padding: '24px',
              background: selectedType === type.id ? type.gradient : 'rgba(255,255,255,0.02)',
              border: selectedType === type.id
                ? `1px solid ${type.color}55`
                : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.3s ease',
              boxShadow: selectedType === type.id
                ? `0 0 30px ${type.color}20, inset 0 0 30px ${type.color}05`
                : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              if (selectedType !== type.id) {
                e.currentTarget.style.borderColor = `${type.color}33`
                e.currentTarget.style.background = `${type.gradient}`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={e => {
              if (selectedType !== type.id) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            {/* Glow orb */}
            {selectedType === type.id && (
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${type.color}30, transparent)`,
                pointerEvents: 'none',
              }} />
            )}

            {/* Icon */}
            <div style={{
              width: '52px',
              height: '52px',
              minWidth: '52px',
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${type.color}25, ${type.color}08)`,
              border: `1px solid ${type.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: selectedType === type.id ? `0 0 20px ${type.color}30` : 'none',
            }}>
              {type.icon}
            </div>

            <div>
              <p style={{
                fontSize: '15px',
                fontWeight: '700',
                color: selectedType === type.id ? type.color : 'var(--text-primary)',
                marginBottom: '4px',
                transition: 'color 0.2s ease',
              }}>
                {type.title}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
              }}>
                {type.description}
              </p>
            </div>

            {/* Active indicator */}
            {selectedType === type.id && (
              <div style={{
                marginLeft: 'auto',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: type.color,
                boxShadow: `0 0 10px ${type.color}`,
                animation: 'pulse 2s ease-in-out infinite',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '420px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>

        {/* Left — Form */}
        <div style={{
          padding: '32px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${selectedTypeData?.color}25`,
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 40px ${selectedTypeData?.color}08`,
          position: 'sticky',
          top: '80px',
        }}>
          {/* Form Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: `1px solid ${selectedTypeData?.color}20`,
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${selectedTypeData?.color}25, ${selectedTypeData?.color}08)`,
              border: `1px solid ${selectedTypeData?.color}33`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
            }}>
              {selectedTypeData?.icon}
            </div>
            <div>
              <p style={{
                color: selectedTypeData?.color,
                fontSize: '14px',
                fontWeight: '700',
              }}>
                {selectedTypeData?.title}
              </p>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '12px',
              }}>
                Fill in details below
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {getFields().map((field) => (
              <div key={field.key}>
                <label style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}>
                  {field.label}
                </label>
                <input
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-primary)',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderRadius: '10px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = `${selectedTypeData?.color}66`
                    e.target.style.boxShadow = `0 0 0 3px ${selectedTypeData?.color}10`
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.06)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.target.style.boxShadow = 'none'
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.04)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right — Generated Email */}
        <div style={{
          padding: '32px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${selectedTypeData?.color}25`,
          borderRadius: '20px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 0 40px ${selectedTypeData?.color}08`,
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: `1px solid ${selectedTypeData?.color}20`,
          }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1px',
            }}>
              ✉️ GENERATED EMAIL
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`)
                setCopiedAll(true)
                setTimeout(() => setCopiedAll(false), 2000)
              }}
              style={{
                padding: '8px 20px',
                background: copiedAll
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.05))'
                  : `linear-gradient(135deg, ${selectedTypeData?.color}20, ${selectedTypeData?.color}05)`,
                color: copiedAll ? '#34d399' : selectedTypeData?.color,
                border: copiedAll
                  ? '1px solid rgba(52,211,153,0.4)'
                  : `1px solid ${selectedTypeData?.color}40`,
                borderRadius: '10px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '700',
                transition: 'all 0.2s ease',
                boxShadow: copiedAll ? '0 0 15px rgba(52,211,153,0.2)' : `0 0 15px ${selectedTypeData?.color}15`,
              }}
            >
              {copiedAll ? '✓ Copied!' : '📋 Copy All'}
            </button>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <label style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '1px',
              }}>
                SUBJECT LINE
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(email.subject)
                  setCopiedSubject(true)
                  setTimeout(() => setCopiedSubject(false), 2000)
                }}
                style={{
                  padding: '3px 10px',
                  backgroundColor: 'transparent',
                  color: copiedSubject ? '#34d399' : '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                {copiedSubject ? '✓' : '📋 Copy'}
              </button>
            </div>
            <div style={{
              padding: '14px 18px',
              background: `linear-gradient(135deg, ${selectedTypeData?.color}12, ${selectedTypeData?.color}04)`,
              border: `1px solid ${selectedTypeData?.color}30`,
              borderRadius: '12px',
              fontSize: '14px',
              color: selectedTypeData?.color,
              fontWeight: '600',
              boxShadow: `0 0 20px ${selectedTypeData?.color}10`,
            }}>
              {email.subject}
            </div>
          </div>

          {/* Body */}
          <div>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '8px',
            }}>
              EMAIL BODY
            </label>
            <div style={{
              padding: '24px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: '2',
              whiteSpace: 'pre-line',
              fontFamily: 'Inter, sans-serif',
              minHeight: '320px',
            }}>
              {email.body}
            </div>
          </div>

          {/* Pro Tip */}
          <div style={{
            marginTop: '20px',
            padding: '14px 18px',
            background: `linear-gradient(135deg, ${selectedTypeData?.color}08, transparent)`,
            border: `1px solid ${selectedTypeData?.color}20`,
            borderRadius: '12px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <div>
              <p style={{
                fontSize: '12px',
                color: selectedTypeData?.color,
                fontWeight: '700',
                marginBottom: '3px',
              }}>
                Pro Tip
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {selectedType === 'follow-up' && 'Wait 5-7 days after applying before following up. Keep it short and polite.'}
                {selectedType === 'thank-you' && 'Send within 24 hours of the interview. Personalize with something specific discussed.'}
                {selectedType === 'offer-accept' && 'Reply within 24-48 hours of receiving the offer letter.'}
                {selectedType === 'joining-delay' && 'Request extension as early as possible. Offer a specific new date.'}
                {selectedType === 'negotiation' && 'Be polite and data-driven. Research industry salary before negotiating.'}
                {selectedType === 'withdrawal' && 'Always withdraw professionally — you may need them in the future.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailTemplates