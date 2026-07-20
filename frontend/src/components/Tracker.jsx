import { useState, useEffect } from 'react'
import { fetchApplications, createApplication, updateApplication, deleteApplication, updateApplicationStatus, mapDbRowToApp } from '../utils/trackerStorage'
import { useAuth } from '../AuthProvider'

const statusConfig = {
  Applied: { color: 'var(--color-brand)', bg: 'rgba(56,189,248,0.1)', border: 'rgba(56,189,248,0.3)' },
  Interview: { color: 'var(--color-accent)', bg: 'rgba(129,140,248,0.1)', border: 'rgba(129,140,248,0.3)' },
  Offer: { color: 'var(--color-success)', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  Rejected: { color: 'var(--color-danger)', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)' },
}

const emptyForm = {
  company: '',
  role: '',
  location: '',
  status: 'Applied',
  appliedDate: '',
  followUp: '',
  notes: '',
}

function Tracker() {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [isLoadingApps, setIsLoadingApps] = useState(true)
  const [actionError, setActionError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    async function loadApps() {
      if (!user) {
        setApplications([])
        setIsLoadingApps(false)
        return
      }
      setIsLoadingApps(true)
      const { data, error } = await fetchApplications()
      if (error) {
        console.error('fetchApplications error:', error)
        setActionError('Could not load your applications.')
      } else {
        setApplications(data.map(mapDbRowToApp))
      }
      setIsLoadingApps(false)
    }
    loadApps()
  }, [user])

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }

  const filteredApps = filterStatus === 'All'
    ? applications
    : applications.filter(a => a.status === filterStatus)

const handleSubmit = async () => {
    if (!form.company || !form.role) {
      alert('Company and Role are required!')
      return
    }
    if (!user) {
      setActionError('Please log in to save applications.')
      return
    }

    setActionError('')

    if (editId) {
      const { data, error } = await updateApplication(editId, form)
      if (error) {
        console.error('updateApplication error:', error)
        setActionError('Could not update application.')
        return
      }
      setApplications(prev => prev.map(a => a.id === editId ? mapDbRowToApp(data) : a))
      setEditId(null)
    } else {
      const { data, error } = await createApplication(form)
      if (error) {
        console.error('createApplication error:', error)
        setActionError('Could not save application.')
        return
      }
      setApplications(prev => [mapDbRowToApp(data), ...prev])
    }
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleEdit = (app) => {
    setForm(app)
    setEditId(app.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    const app = applications.find(a => a.id === id)
    const confirm = window.confirm(
      `⚠️ Are you sure you want to delete?\n\n🏢 Company: ${app.company}\n💼 Role: ${app.role}\n\nThis action cannot be undone.`
    )
    if (!confirm) return

    const { error } = await deleteApplication(id)
    if (error) {
      console.error('deleteApplication error:', error)
      setActionError('Could not delete application.')
      return
    }
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  const handleStatusChange = async (id, newStatus) => {
    const previous = applications
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))

    const { error } = await updateApplicationStatus(id, newStatus)
    if (error) {
      console.error('updateApplicationStatus error:', error)
      setActionError('Could not update status.')
      setApplications(previous)
    }
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
          backgroundColor: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.3)',
          borderRadius: '100px',
          fontSize: '13px',
          color: 'var(--color-success)',
          fontWeight: '500',
          marginBottom: '16px',
        }}>
          ✦ Track Everything
        </div>
        <h2 style={{
          fontSize: '36px',
          fontWeight: '800',
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px',
        }}>
          Application Tracker
        </h2>
       <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Track every job you apply to — never miss a follow up
        </p>
        {actionError && (
          <p style={{
            marginTop: '16px',
            fontSize: '14px',
            color: 'var(--color-danger)',
            padding: '10px 16px',
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.3)',
            borderRadius: '10px',
            display: 'inline-block',
          }}>
            ⚠️ {actionError}
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {[
          { label: 'Total', value: stats.total, color: 'var(--color-text)' },
          { label: 'Applied', value: stats.applied, color: 'var(--color-brand)' },
          { label: 'Interview', value: stats.interview, color: 'var(--color-accent)' },
          { label: 'Offer', value: stats.offer, color: 'var(--color-success)' },
          { label: 'Rejected', value: stats.rejected, color: 'var(--color-danger)' },
        ].map((stat) => (
          <div key={stat.label} style={{
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: `1px solid ${stat.color}22`,
            borderRadius: '14px',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '800',
              color: stat.color,
              marginBottom: '4px',
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
              letterSpacing: '0.5px',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Add Button Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '7px 16px',
                backgroundColor: filterStatus === s
                  ? 'rgba(56,189,248,0.15)'
                  : 'rgba(255,255,255,0.03)',
                color: filterStatus === s ? 'var(--color-brand)' : 'var(--color-muted)',
                border: filterStatus === s
                  ? '1px solid rgba(56,189,248,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null) }}
          className="btn-primary"
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '10px',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Application'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fade-in" style={{
          padding: '28px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: '16px',
          marginBottom: '24px',
          backdropFilter: 'blur(20px)',
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '20px',
          }}>
            {editId ? '✏️ Edit Application' : '➕ New Application'}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}>
            {[
              { key: 'company', label: 'Company *', placeholder: 'e.g. TCS' },
              { key: 'role', label: 'Role *', placeholder: 'e.g. .NET Developer' },
              { key: 'location', label: 'Location', placeholder: 'e.g. Bangalore' },
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
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}>
            {/* Status */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}>
                STATUS
              </label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {Object.keys(statusConfig).map(s => (
                  <option key={s} value={s} style={{ backgroundColor: 'var(--color-elevated)' }}>{s}</option>
                ))}
              </select>
            </div>

            {/* Applied Date */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}>
                APPLIED DATE
              </label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={e => setForm({ ...form, appliedDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  colorScheme: 'dark',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Follow Up */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}>
                FOLLOW UP DATE
              </label>
              <input
                type="date"
                value={form.followUp}
                onChange={e => setForm({ ...form, followUp: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  colorScheme: 'dark',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              marginBottom: '6px',
            }}>
              NOTES
            </label>
            <input
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Applied via LinkedIn, HR contacted"
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
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="btn-primary"
            style={{
              padding: '12px 32px',
              fontSize: '14px',
              fontWeight: '700',
              borderRadius: '10px',
            }}
          >
            {editId ? '✓ Update Application' : '+ Save Application'}
          </button>
        </div>
      )}

      {/* Applications List */}
   {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoadingApps ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: 'var(--text-secondary)',
            fontSize: '15px',
          }}>
            Loading your applications...
          </div>
        ) : !user ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: 'var(--text-secondary)',
            fontSize: '15px',
          }}>
            Please log in to track your job applications.
          </div>
        ) : filteredApps.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: 'var(--text-secondary)',
            fontSize: '15px',
          }}>
            No applications yet. Click "Add Application" to start tracking!
          </div>
        ) : (
          filteredApps.map((app) => {
            const status = statusConfig[app.status]
            return (
              <div
                key={app.id}
                className="fade-in"
                style={{
                  padding: '20px 24px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${status.border}`,
                  borderRadius: '14px',
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.boxShadow = `0 4px 20px ${status.color}15`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Left — Company Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                    }}>
                      {app.company}
                    </p>
                    <span style={{
                      padding: '2px 10px',
                      backgroundColor: status.bg,
                      border: `1px solid ${status.border}`,
                      borderRadius: '100px',
                      fontSize: '11px',
                      color: status.color,
                      fontWeight: '600',
                    }}>
                      {app.status}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-brand)',
                    marginBottom: '4px',
                  }}>
                    {app.role} {app.location && `· ${app.location}`}
                  </p>
                  {app.notes && (
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                    }}>
                      📝 {app.notes}
                    </p>
                  )}
                </div>

                {/* Middle — Dates */}
                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                  {app.appliedDate && (
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      📅 {app.appliedDate}
                    </p>
                  )}
                  {app.followUp && (
                    <p style={{ fontSize: '12px', color: 'var(--color-accent)' }}>
                      🔔 {app.followUp}
                    </p>
                  )}
                </div>

                {/* Right — Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Quick Status Change */}
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: status.bg,
                      color: status.color,
                      border: `1px solid ${status.border}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: '600',
                    }}
                  >
                    {Object.keys(statusConfig).map(s => (
                      <option key={s} value={s} style={{ backgroundColor: 'var(--color-elevated)', color: 'white' }}>{s}</option>
                    ))}
                  </select>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(app)}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: 'rgba(129,140,248,0.1)',
                      color: 'var(--color-accent)',
                      border: '1px solid rgba(129,140,248,0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(app.id)}
                    style={{
                      padding: '6px 14px',
                      backgroundColor: 'rgba(251,113,133,0.1)',
                      color: 'var(--color-danger)',
                      border: '1px solid rgba(251,113,133,0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default Tracker