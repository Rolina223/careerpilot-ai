import { forwardRef } from 'react';

const templateStyles = {
  ats: {
    accent: '#1e40af',
    background: 'var(--color-on-brand)fff',
    text: 'var(--color-surface)',
    sectionBackground: 'var(--color-text)',
    border: '#c7d2fe',
    tagline: 'Clean and readable for recruiters and ATS scanners.',
  },
  modern: {
    accent: 'var(--color-brand)',
    background: 'var(--color-text)',
    text: 'var(--color-canvas)',
    sectionBackground: 'var(--color-on-brand)fff',
    border: '#bae6fd',
    tagline: 'Structured sections with a professional sidebar.',
  },
  executive: {
    accent: '#4338ca',
    background: 'var(--color-on-brand)fff',
    text: 'var(--color-surface)',
    sectionBackground: '#f3f4f6',
    border: '#e0e7ff',
    tagline: 'Executive resume with bold header and sharp hierarchy.',
  },
  creative: {
    accent: 'var(--color-warning)',
    background: 'var(--color-canvas)',
    text: 'var(--color-text)',
    sectionBackground: 'var(--color-surface)',
    border: 'var(--color-warning)',
    tagline: 'Bold visuals for designers and modern portfolios.',
  },
};

function renderContact(personalInfo, color) {
  const lines = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.portfolio,
  ].filter(Boolean);

  return lines.length > 0 ? (
    <p style={{ margin: '18px 0 0', fontSize: '14px', lineHeight: '1.8', color }}>{lines.join(' • ')}</p>
  ) : (
    <p style={{ margin: '18px 0 0', fontSize: '14px', lineHeight: '1.8', color }}>Add your contact details, LinkedIn, GitHub, or portfolio URL.</p>
  );
}

const ResumePreview = forwardRef(({ resumeData, selectedTemplate }, ref) => {
  const theme = templateStyles[selectedTemplate] || templateStyles.ats;
  const { personalInfo, experience, education, projects, certifications, skills } = resumeData;
  const isModern = selectedTemplate === 'modern';
  const isExecutive = selectedTemplate === 'executive';
  const isCreative = selectedTemplate === 'creative';

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        padding: '28px',
        backgroundColor: theme.background,
        color: theme.text,
        borderRadius: '24px',
        boxShadow: isCreative ? '0 28px 90px rgba(0, 0, 0, 0.35)' : '0 28px 80px rgba(15, 23, 42, 0.12)',
        border: `1px solid ${theme.border}`,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {isExecutive ? (
        <div style={{ backgroundColor: theme.accent, color: 'var(--color-on-brand)', borderRadius: '20px', padding: '24px 28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ minWidth: '240px' }}>
              <h1 style={{ margin: 0, fontSize: '32px', lineHeight: '1.05', fontWeight: 900 }}>{personalInfo.fullName || 'Your Name'}</h1>
              <p style={{ margin: '10px 0 0', fontSize: '14px', opacity: 0.9 }}>{personalInfo.summary || 'Add a sharp executive summary for hiring managers.'}</p>
            </div>
            <div style={{ minWidth: '180px', textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Executive Summary</p>
              {renderContact(personalInfo, '#f3f4f6')}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px', justifyContent: 'space-between' }}>
          <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
            <h1 style={{ margin: 0, fontSize: '30px', lineHeight: '1.1', fontWeight: 800 }}>{personalInfo.fullName || 'Your Name'}</h1>
            <p style={{ margin: '12px 0 8px', color: theme.accent, fontWeight: 700 }}>{theme.tagline}</p>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.8', color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)' }}>{personalInfo.summary || 'Add a professional summary to make your resume stand out.'}</p>
            {renderContact(personalInfo, isCreative ? 'var(--color-text)' : 'var(--color-subtle)')}
          </div>
          {personalInfo.photo && (
            <div style={{ width: '120px', height: '120px', borderRadius: '24px', overflow: 'hidden', backgroundColor: 'var(--color-on-brand)', flex: '0 0 120px' }}>
              <img src={personalInfo.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      )}

      <div style={{ display: isModern ? 'grid' : 'grid', gridTemplateColumns: isModern ? '1.5fr 0.85fr' : '1fr 1fr', gap: '22px' }}>
        <div style={{ backgroundColor: theme.sectionBackground, borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', color: theme.accent, fontSize: '18px' }}>Experience</h2>
          {experience.filter((item) => item.company || item.position).length > 0 ? (
            experience.map((item, index) => (
              <div key={`${item.company}-${index}`} style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{item.position || 'Role Title'}{item.company ? ` — ${item.company}` : ''}</h3>
                <p style={{ margin: 0, color: 'var(--color-subtle)', fontSize: '13px' }}>{item.duration || 'Duration'}</p>
                <p style={{ margin: '14px 0 0', fontSize: '14px', lineHeight: '1.75', color: isCreative ? 'var(--color-text)' : 'var(--color-border)' }}>{item.description || 'Add a short description of your role, impact, and technologies used.'}</p>
                {item.achievements?.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '14px 0 0', color: isCreative ? 'var(--color-text)' : 'var(--color-border)', lineHeight: '1.75' }}>
                    {item.achievements.filter(Boolean).map((achievement, idx) => (
                      <li key={idx} style={{ marginBottom: '6px', fontSize: '14px' }}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)', fontSize: '14px' }}>Add your experience entries to show projects, results, and promotions.</p>
          )}
        </div>

        <div style={{ display: 'grid', gap: '22px' }}>
          <div style={{ backgroundColor: theme.sectionBackground, borderRadius: '20px', padding: '22px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: theme.accent, fontSize: '18px' }}>Projects</h2>
            {projects.filter((item) => item.name).length > 0 ? (
              projects.map((project, index) => (
                <div key={`${project.name}-${index}`} style={{ marginBottom: '18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{project.name}</h3>
                  <p style={{ margin: 0, color: 'var(--color-subtle)', fontSize: '13px' }}>{project.techStack || 'Tech Stack'}</p>
                  <p style={{ margin: '10px 0 0', fontSize: '14px', lineHeight: '1.75', color: isCreative ? 'var(--color-text)' : 'var(--color-border)' }}>{project.description || 'Describe the project outcome and your contribution.'}</p>
                  {project.githubLink && <p style={{ margin: '8px 0 0', fontSize: '13px', color: theme.accent }}>{project.githubLink}</p>}
                </div>
              ))
            ) : (
              <p style={{ color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)', fontSize: '14px' }}>Add projects to demonstrate your technical work and impact.</p>
            )}
          </div>

          <div style={{ backgroundColor: theme.sectionBackground, borderRadius: '20px', padding: '22px' }}>
            <h2 style={{ marginTop: 0, marginBottom: '16px', color: theme.accent, fontSize: '18px' }}>Education</h2>
            {education.filter((item) => item.school).length > 0 ? (
              education.map((item, index) => (
                <div key={`${item.school}-${index}`} style={{ marginBottom: '18px' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{item.school}</h3>
                  <p style={{ margin: 0, color: 'var(--color-subtle)', fontSize: '13px' }}>{item.degree} in {item.field}</p>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: isCreative ? 'var(--color-text)' : 'var(--color-border)' }}>{item.year}</p>
                </div>
              ))
            ) : (
              <p style={{ color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)', fontSize: '14px' }}>List your school, degree, and graduation year here.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isModern ? '1fr' : '1fr 1fr', gap: '22px', marginTop: '22px' }}>
        <div style={{ backgroundColor: theme.sectionBackground, borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', color: theme.accent, fontSize: '18px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {skills.filter(Boolean).map((skill, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 12px', borderRadius: '999px', backgroundColor: theme.accent, color: 'var(--color-on-brand)', fontSize: '13px' }}>{skill}</span>
            ))}
            {skills.filter(Boolean).length === 0 && <p style={{ color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)', fontSize: '14px' }}>Add skill tags to make your resume searchable and relevant.</p>}
          </div>
        </div>

        <div style={{ backgroundColor: theme.sectionBackground, borderRadius: '20px', padding: '22px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '16px', color: theme.accent, fontSize: '18px' }}>Certifications</h2>
          {certifications.filter((item) => item.name).length > 0 ? (
            certifications.map((item, index) => (
              <div key={`${item.name}-${index}`} style={{ marginBottom: '18px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 700 }}>{item.name}</h3>
                <p style={{ margin: 0, color: 'var(--color-subtle)', fontSize: '13px' }}>{item.issuer}</p>
                <p style={{ margin: '8px 0 0', fontSize: '13px', color: isCreative ? 'var(--color-text)' : 'var(--color-border)' }}>{item.year}</p>
              </div>
            ))
          ) : (
            <p style={{ color: isCreative ? 'var(--color-muted)' : 'var(--color-subtle)', fontSize: '14px' }}>List certifications that support your credibility.</p>
          )}
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;
