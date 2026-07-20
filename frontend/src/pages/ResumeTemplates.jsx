import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ResumePreview from '../components/ResumePreview';
import TemplateCard from '../components/TemplateCard';
import { exportResumeToPdf } from '../utils/pdfExport';
import { getStoredResume, getStoredTemplate, resumeTemplates, saveSelectedTemplate } from '../utils/resumeStorage';

function ResumeTemplates() {
  const [resumeData] = useState(getStoredResume());
  const [selectedTemplate, setSelectedTemplate] = useState(getStoredTemplate());
  const previewRef = useRef(null);

  useEffect(() => {
    saveSelectedTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const downloadTemplatePdf = async () => {
    if (!previewRef.current || !resumeData) return;
    await exportResumeToPdf(previewRef.current, resumeData.personalInfo.fullName || 'careerpilot_resume');
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 24px', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '44px', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Resume Templates
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '760px', margin: '0 auto' }}>
          Select the best template for your career stage. Your resume data is loaded from the Resume Builder automatically.
        </p>
      </header>

      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>Switch Templates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {resumeTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              active={selectedTemplate === template.id}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
      </section>

      {!resumeData ? (
        <div style={{ padding: '32px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '22px', color: 'var(--text-primary)' }}>No resume data found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '18px' }}>Please complete the Resume Builder first so your selected template can render live content.</p>
          <Link to="/resume-builder" style={{ display: 'inline-block', padding: '12px 20px', borderRadius: '12px', background: 'var(--primary)', color: 'var(--color-on-brand)', textDecoration: 'none' }}>
            Open Resume Builder
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: '28px' }}>
          <div>
            <div style={{ padding: '24px', borderRadius: '20px', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '22px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>Template Preview</h3>
              <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)' }}>Preview the selected resume layout using the shared builder data.</p>
            </div>
            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <ResumePreview ref={previewRef} resumeData={resumeData} selectedTemplate={selectedTemplate} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>Download</h3>
              <p style={{ margin: '12px 0 18px', color: 'var(--text-secondary)' }}>Export this template as a professional PDF with your saved data.</p>
              <button onClick={downloadTemplatePdf} style={{ padding: '14px 18px', borderRadius: '14px', border: 'none', background: 'var(--primary)', color: 'var(--color-on-brand)', fontWeight: 700, cursor: 'pointer' }}>
                Download PDF
              </button>
            </div>

            <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>Manage Resume Data</h3>
              <p style={{ margin: '12px 0 16px', color: 'var(--text-secondary)' }}>Your resume data is shared between Resume Builder and Templates. Any updates in the builder persist here.</p>
              <Link to="/resume-builder" style={{ display: 'inline-block', padding: '12px 20px', borderRadius: '14px', background: 'var(--secondary)', color: 'var(--color-on-brand)', textDecoration: 'none', fontWeight: 700 }}>
                Edit Resume in Builder
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeTemplates;
