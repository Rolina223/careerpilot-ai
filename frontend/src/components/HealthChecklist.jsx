function HealthChecklist({ items }) {
  return (
    <div className="health-checklist">
      {items.map((item) => (
        <div key={item.label} className={`health-row ${item.status ? 'success' : 'warning'}`}>
          <span className="health-badge">{item.status ? '✔' : '⚠'}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default HealthChecklist;
