function TemplateCard({ template, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '24px',
        borderRadius: '24px',
        border: active ? `2px solid ${template.accent}` : '1px solid rgba(148, 163, 184, 0.25)',
        backgroundColor: active ? 'rgba(56, 189, 248, 0.1)' : 'rgba(15, 23, 42, 0.9)',
        color: active ? '#fff' : '#cbd5e1',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <span style={{ fontSize: '28px' }}>{template.icon}</span>
        <span style={{ color: template.accent, fontWeight: 700, fontSize: '14px' }}>{template.name}</span>
      </div>
      <p style={{ margin: 0, lineHeight: '1.6', color: active ? '#e2e8f0' : '#94a3b8', fontSize: '14px' }}>{template.description}</p>
    </button>
  );
}

export default TemplateCard;
