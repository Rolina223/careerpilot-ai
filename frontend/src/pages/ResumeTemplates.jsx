import { useState } from 'react';

const templates = [
  {
    id: 1,
    name: "Professional ATS",
    icon: "💼",
    color: "#1e40af",
    type: "ATS Friendly"
  },
  {
    id: 2,
    name: "Modern Tech",
    icon: "💻",
    color: "#0ea5e9",
    type: "Developer"
  },
  {
    id: 3,
    name: "Executive",
    icon: "👔",
    color: "#4338ca",
    type: "Premium"
  },
  {
    id: 4,
    name: "Creative",
    icon: "🎨",
    color: "#c026d3",
    type: "Creative"
  }
];

function ResumeTemplates() {
  const [selected, setSelected] = useState(null);

  // Demo User Data (baad mein ResumeAnalyzer se connect karenge)
  const userData = {
    name: "Aarav Sharma",
    title: "Software Engineer | CSE Fresher",
    contact: "contact@aarav.dev | +91 98765 43210",
    education: "B.Tech Computer Science & Engineering - NIT Trichy (CGPA 8.75)",
    skills: "React, Node.js, Python, Django, Machine Learning, SQL, Git, AWS",
    projects: "CareerPilot AI - AI Powered Resume Builder & Job Tracker"
  };

  const downloadAsPDF = (template) => {
    const resumeHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 50px; background: white; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">
        <div style="text-align: center; border-bottom: 4px solid ${template.color}; padding-bottom: 25px;">
          <h1 style="margin:0; color: ${template.color};">${userData.name}</h1>
          <p style="margin:10px 0; color:#333;">${userData.title}</p>
          <p style="color:#555;">${userData.contact}</p>
        </div>

        <h3 style="color:${template.color}; margin-top:30px;">EDUCATION</h3>
        <p>${userData.education}</p>

        <h3 style="color:${template.color}; margin-top:25px;">SKILLS</h3>
        <p>${userData.skills}</p>

        <h3 style="color:${template.color}; margin-top:25px;">PROJECTS</h3>
        <p>${userData.projects}</p>
      </div>
    `;

    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>${userData.name} - ${template.name}</title></head><body>${resumeHTML}</body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 600);
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 32px', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '44px', fontWeight: '800', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Choose Your Resume Template
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Professional • ATS Friendly • Instant Download</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setSelected(template)}
            style={{
              background: 'rgba(15,23,42,0.9)',
              borderRadius: '24px',
              overflow: 'hidden',
              border: selected?.id === template.id ? '3px solid #38bdf8' : '1px solid rgba(148,163,184,0.2)',
              transition: 'all 0.4s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-12px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Preview */}
            <div style={{ height: '460px', background: 'white', padding: '30px', color: '#111' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '48px' }}>{template.icon}</span>
                <h3 style={{ color: template.color }}>{template.name}</h3>
                <p style={{ color: '#666' }}>{template.type}</p>
              </div>

              <div style={{ fontSize: '14.5px', lineHeight: '1.65' }}>
                <strong>{userData.name}</strong><br />
                {userData.title}<br />
                {userData.contact}<br /><br />

                <strong style={{ color: template.color }}>EDUCATION</strong><br />
                {userData.education}<br /><br />

                <strong style={{ color: template.color }}>SKILLS</strong><br />
                {userData.skills}<br /><br />

                <strong style={{ color: template.color }}>PROJECT</strong><br />
                {userData.projects}
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); downloadAsPDF(template); }}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: '#38bdf8',
                  color: '#000',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '700',
                  fontSize: '16.5px'
                }}
              >
                📥 Download as PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResumeTemplates;