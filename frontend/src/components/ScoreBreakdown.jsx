function ScoreBreakdown({ scores }) {
  const items = [
    { label: 'ATS Compatibility', value: scores.atsCompatibility, color: 'var(--color-brand)' },
    { label: 'Completeness', value: scores.completeness, color: 'var(--color-brand)' },
    { label: 'Experience', value: scores.experienceQuality, color: 'var(--color-accent)' },
    { label: 'Skills', value: scores.skillsQuality, color: 'var(--color-success)' },
    { label: 'Projects', value: scores.projects, color: 'var(--color-success)' },
    { label: 'Education', value: scores.education, color: 'var(--color-warning)' },
    { label: 'Certifications', value: scores.certifications, color: 'var(--color-warning)' },
    { label: 'Professional Presence', value: scores.professionalPresence, color: 'var(--color-danger)' },
  ];

  return (
    <div className="breakdown-list">
      {items.map((item) => (
        <div key={item.label} className="breakdown-row">
          <div className="breakdown-title">
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
          <div className="breakdown-track">
            <div className="breakdown-fill" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ScoreBreakdown;
