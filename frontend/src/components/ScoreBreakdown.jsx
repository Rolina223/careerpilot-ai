function ScoreBreakdown({ scores }) {
  const items = [
    { label: 'ATS Compatibility', value: scores.atsCompatibility, color: '#0ea5e9' },
    { label: 'Completeness', value: scores.completeness, color: '#38bdf8' },
    { label: 'Experience', value: scores.experienceQuality, color: '#7c3aed' },
    { label: 'Skills', value: scores.skillsQuality, color: '#14b8a6' },
    { label: 'Projects', value: scores.projects, color: '#22c55e' },
    { label: 'Education', value: scores.education, color: '#f59e0b' },
    { label: 'Certifications', value: scores.certifications, color: '#fb923c' },
    { label: 'Professional Presence', value: scores.professionalPresence, color: '#ec4899' },
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
