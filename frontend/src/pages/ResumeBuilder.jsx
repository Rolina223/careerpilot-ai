import { useEffect, useRef, useState } from 'react';
import { validators } from '../utils/validation';
import ResumePreview from '../components/ResumePreview';
import TemplateCard from '../components/TemplateCard';
import { exportResumeToPdf } from '../utils/pdfExport';
import { generateProfessionalSummary, improveExperienceDescription, suggestSkills } from '../services/aiService';
import { defaultResumeData, getStoredResume, getStoredTemplate, resumeTemplates, saveResumeData, saveSelectedTemplate } from '../utils/resumeStorage';

function ResumeBuilder() {
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState(getStoredTemplate());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const previewRef = useRef(null);

  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  const stored = getStoredResume();
  setResumeData(stored);
  setIsLoaded(true);
}, []);

useEffect(() => {
  if (!isLoaded) return;
  saveResumeData(resumeData);
}, [resumeData, isLoaded]);

  useEffect(() => {
    saveSelectedTemplate(selectedTemplate);
  }, [selectedTemplate]);

  const validateField = (fieldName, value, label) => {
  let errorMsg = '';
  if (validators[fieldName]) {
    errorMsg = validators[fieldName](value, label);
  }
  setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
  return errorMsg;
};

const validateArrayField = (section, index, field, value, validatorKey, label) => {
  let errorMsg = '';
  if (validators[validatorKey]) {
    errorMsg = validators[validatorKey](value, label);
  }
  setErrors((prev) => ({ ...prev, [`${section}-${index}-${field}`]: errorMsg }));
  return errorMsg;
};

  const updatePersonalInfo = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResumeData((prev) => {
      const nextItems = [...prev[section]];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, [section]: nextItems };
    });
  };

  const updateAchievement = (experienceIndex, achievementIndex, value) => {
    setResumeData((prev) => {
      const nextExperience = prev.experience.map((item, index) => {
        if (index !== experienceIndex) return item;
        const nextAchievements = [...item.achievements];
        nextAchievements[achievementIndex] = value;
        return { ...item, achievements: nextAchievements };
      });
      return { ...prev, experience: nextExperience };
    });
  };

  const addAchievement = (experienceIndex) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, index) =>
        index !== experienceIndex
          ? item
          : { ...item, achievements: [...item.achievements, ''] }
      ),
    }));
  };

  const removeAchievement = (experienceIndex, achievementIndex) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((item, index) =>
        index !== experienceIndex
          ? item
          : {
              ...item,
              achievements: item.achievements.filter((_, idx) => idx !== achievementIndex) || [''],
            }
      ),
    }));
  };

  const addArrayItem = (section, template) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const addSkill = () => addArrayItem('skills', '');

  const updateSkill = (index, value) => {
    setResumeData((prev) => {
      const skills = [...prev.skills];
      skills[index] = value;
      return { ...prev, skills };
    });
  };

  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonalInfo('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const generateProfessionalSummaryHandler = async () => {
    setIsLoading(true);
    const summary = await generateProfessionalSummary(resumeData.personalInfo, resumeData.experience, resumeData.education);
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, summary },
    }));
    setIsLoading(false);
  };

  const generateSuggestedSkills = async () => {
    setIsLoading(true);
    const suggestions = await suggestSkills(resumeData.experience, resumeData.projects, resumeData.certifications);
    setResumeData((prev) => ({ ...prev, skills: suggestions }));
    setIsLoading(false);
  };

  const handleImproveExperience = async (index) => {
    setIsLoading(true);
    const experienceItem = resumeData.experience[index];
    const improved = await improveExperienceDescription(experienceItem.description, experienceItem.achievements);
    updateArrayItem('experience', index, 'description', improved);
    setIsLoading(false);
  };

  const downloadAsPdf = async () => {
    if (!previewRef.current) return;
    await exportResumeToPdf(previewRef.current, resumeData.personalInfo.fullName || 'careerpilot_resume');
  };

  const sectionStyle = {
    marginBottom: '32px',
    padding: '24px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '18px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '16px',
    background: 'rgba(0, 0, 0, 0.28)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
  };

  const errorTextStyle = {
  color: '#fb7185',
  fontSize: '12px',
  marginTop: '-12px',
  marginBottom: '14px',
  display: 'block',
};

const getInputStyle = (hasError) => ({
  ...inputStyle,
  border: hasError ? '1px solid #fb7185' : '1px solid var(--border)',
  marginBottom: hasError ? '6px' : '16px',
});

  const buttonStyle = {
    padding: '12px 18px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    transition: 'all 0.2s ease',
  };

  const primaryButton = {
    ...buttonStyle,
    background: 'var(--primary)',
    color: '#fff',
  };

  const secondaryButton = {
    ...buttonStyle,
    background: 'var(--secondary)',
    color: '#fff',
  };

  const dangerButton = {
    ...buttonStyle,
    background: '#f43f5e',
    color: '#fff',
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '60px 24px' }}>
      <header style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Resume Builder
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '760px' }}>
          Build a smarter resume with live templates, AI enhancements, and shared resume data across Builder and Templates.
        </p>
      </header>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--primary)' }}>Choose a Template</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          {resumeTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} active={selectedTemplate === template.id} onSelect={setSelectedTemplate} />
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '28px', alignItems: 'start' }}>
        <div>
          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Personal Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
  <label style={labelStyle}>Full Name</label>
  <input
    value={resumeData.personalInfo.fullName}
    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
    onBlur={(e) => validateField('fullName', e.target.value)}
    style={getInputStyle(errors.fullName)}
    placeholder="John Doe"
  />
  {errors.fullName && <span style={errorTextStyle}>⚠ {errors.fullName}</span>}
</div>
<div>
  <label style={labelStyle}>Email</label>
  <input
    type="email"
    value={resumeData.personalInfo.email}
    onChange={(e) => updatePersonalInfo('email', e.target.value)}
    onBlur={(e) => validateField('email', e.target.value)}
    style={getInputStyle(errors.email)}
    placeholder="john@example.com"
  />
  {errors.email && <span style={errorTextStyle}>⚠ {errors.email}</span>}
</div>
<div>
  <label style={labelStyle}>Phone</label>
  <input
    value={resumeData.personalInfo.phone}
    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
    onBlur={(e) => validateField('phone', e.target.value)}
    style={getInputStyle(errors.phone)}
    placeholder="+91 98765 43210"
  />
  {errors.phone && <span style={errorTextStyle}>⚠ {errors.phone}</span>}
</div>
<div>
  <label style={labelStyle}>Location</label>
  <input
    value={resumeData.personalInfo.location}
    onChange={(e) => updatePersonalInfo('location', e.target.value)}
    onBlur={(e) => validateField('location', e.target.value)}
    style={getInputStyle(errors.location)}
    placeholder="New York, NY"
  />
  {errors.location && <span style={errorTextStyle}>⚠ {errors.location}</span>}
</div>
<div>
  <label style={labelStyle}>LinkedIn URL</label>
  <input
    type="url"
    value={resumeData.personalInfo.linkedin}
    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
    onBlur={(e) => validateField('linkedin', e.target.value)}
    style={getInputStyle(errors.linkedin)}
    placeholder="https://linkedin.com/in/username"
  />
  {errors.linkedin && <span style={errorTextStyle}>⚠ {errors.linkedin}</span>}
</div>
<div>
  <label style={labelStyle}>GitHub URL</label>
  <input
    type="url"
    value={resumeData.personalInfo.github}
    onChange={(e) => updatePersonalInfo('github', e.target.value)}
    onBlur={(e) => validateField('github', e.target.value)}
    style={getInputStyle(errors.github)}
    placeholder="https://github.com/username"
  />
  {errors.github && <span style={errorTextStyle}>⚠ {errors.github}</span>}
</div>
<div>
  <label style={labelStyle}>Portfolio Website</label>
  <input
    type="url"
    value={resumeData.personalInfo.portfolio}
    onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
    onBlur={(e) => validateField('portfolio', e.target.value)}
    style={getInputStyle(errors.portfolio)}
    placeholder="https://yourportfolio.com"
  />
 {errors.portfolio && <span style={errorTextStyle}>⚠ {errors.portfolio}</span>}
</div>
<div>
  <label style={labelStyle}>Profile Photo</label>
  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={inputStyle} />
</div>
<div>
            </div>
          </div>
        </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Professional Summary</h2>
            <textarea value={resumeData.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }} placeholder="Summarize your experience, strengths, and goals." />
            <button onClick={generateProfessionalSummaryHandler} disabled={isLoading} style={{ ...secondaryButton, marginTop: '10px' }}>
              Generate Professional Summary
            </button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Experience</h2>
            {resumeData.experience.map((item, index) => (
              <div key={index} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)', marginBottom: '18px', background: 'rgba(15,23,42,0.9)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input value={item.company} onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)} style={inputStyle} placeholder="Company name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Position</label>
                    <input value={item.position} onChange={(e) => updateArrayItem('experience', index, 'position', e.target.value)} style={inputStyle} placeholder="Role title" />
                  </div>
                </div>
                <label style={labelStyle}>Duration</label>
                <input value={item.duration} onChange={(e) => updateArrayItem('experience', index, 'duration', e.target.value)} style={inputStyle} placeholder="Jan 2022 - Dec 2023" />
                <label style={labelStyle}>Description</label>
                <textarea value={item.description} onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Describe your responsibilities and impact." />

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Achievements</h3>
                    <button onClick={() => addAchievement(index)} style={{ ...secondaryButton, padding: '10px 14px', fontSize: '13px' }}>
                      + Add Achievement
                    </button>
                  </div>
                  {item.achievements.map((achievement, achIndex) => (
                    <div key={achIndex} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                      <input value={achievement} onChange={(e) => updateAchievement(index, achIndex, e.target.value)} style={{ ...inputStyle, marginBottom: '0', flex: 1 }} placeholder="Achievement bullet point" />
                      {item.achievements.length > 1 && (
                        <button onClick={() => removeAchievement(index, achIndex)} style={{ ...dangerButton, padding: '10px 14px', fontSize: '13px' }}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleImproveExperience(index)} disabled={isLoading} style={secondaryButton}>
                    Improve Experience Description
                  </button>
                  {resumeData.experience.length > 1 && (
                    <button onClick={() => removeArrayItem('experience', index)} style={dangerButton}>
                      Remove Experience
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('experience', { company: '', position: '', duration: '', description: '', achievements: [''] })} style={secondaryButton}>
              + Add Experience
            </button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Projects</h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)', marginBottom: '18px', background: 'rgba(15,23,42,0.9)' }}>
                <label style={labelStyle}>Project Name</label>
                <input value={project.name} onChange={(e) => updateArrayItem('projects', index, 'name', e.target.value)} style={inputStyle} placeholder="Project name" />
                <label style={labelStyle}>Tech Stack</label>
                <input value={project.techStack} onChange={(e) => updateArrayItem('projects', index, 'techStack', e.target.value)} style={inputStyle} placeholder="React, Node.js, AWS" />
                <label style={labelStyle}>Description</label>
                <textarea value={project.description} onChange={(e) => updateArrayItem('projects', index, 'description', e.target.value)} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Explain the outcome and your role." />
                <label style={labelStyle}>GitHub Link</label>
                <input type="url" value={project.githubLink} onChange={(e) => updateArrayItem('projects', index, 'githubLink', e.target.value)} style={inputStyle} placeholder="https://github.com/yourrepo" />
                {resumeData.projects.length > 1 && (
                  <button onClick={() => removeArrayItem('projects', index)} style={dangerButton}>
                    Remove Project
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('projects', { name: '', techStack: '', description: '', githubLink: '' })} style={secondaryButton}>
              + Add Project
            </button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Certifications</h2>
            {resumeData.certifications.map((certification, index) => (
              <div key={index} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)', marginBottom: '18px', background: 'rgba(15,23,42,0.9)' }}>
                <label style={labelStyle}>Certification Name</label>
                <input value={certification.name} onChange={(e) => updateArrayItem('certifications', index, 'name', e.target.value)} style={inputStyle} placeholder="Certification name" />
                <label style={labelStyle}>Issuer</label>
                <input value={certification.issuer} onChange={(e) => updateArrayItem('certifications', index, 'issuer', e.target.value)} style={inputStyle} placeholder="Issuer or platform" />
                <label style={labelStyle}>Year</label>
                <input value={certification.year} onChange={(e) => updateArrayItem('certifications', index, 'year', e.target.value)} style={inputStyle} placeholder="2024" />
                {resumeData.certifications.length > 1 && (
                  <button onClick={() => removeArrayItem('certifications', index)} style={dangerButton}>
                    Remove Certification
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('certifications', { name: '', issuer: '', year: '' })} style={secondaryButton}>
              + Add Certification
            </button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Education</h2>
            {resumeData.education.map((item, index) => (
              <div key={index} style={{ padding: '18px', borderRadius: '16px', border: '1px solid rgba(148,163,184,0.2)', marginBottom: '18px', background: 'rgba(15,23,42,0.9)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>School/University</label>
                    <input value={item.school} onChange={(e) => updateArrayItem('education', index, 'school', e.target.value)} style={inputStyle} placeholder="Institution" />
                  </div>
                  <div>
                    <label style={labelStyle}>Degree</label>
                    <input value={item.degree} onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)} style={inputStyle} placeholder="Degree type" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Field of Study</label>
                    <input value={item.field} onChange={(e) => updateArrayItem('education', index, 'field', e.target.value)} style={inputStyle} placeholder="Field of study" />
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <input value={item.year} onChange={(e) => updateArrayItem('education', index, 'year', e.target.value)} style={inputStyle} placeholder="2024" />
                  </div>
                </div>
                {resumeData.education.length > 1 && (
                  <button onClick={() => removeArrayItem('education', index)} style={dangerButton}>
                    Remove Education
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => addArrayItem('education', { school: '', degree: '', field: '', year: '' })} style={secondaryButton}>
              + Add Education
            </button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px', color: 'var(--primary)' }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              {resumeData.skills.filter(Boolean).map((skill, index) => (
                <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '999px', background: 'rgba(56, 189, 248, 0.18)', color: '#fff', fontSize: '13px', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                  {skill}
                  <button type="button" onClick={() => removeArrayItem('skills', index)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
            {resumeData.skills.map((skill, index) => (
              <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <input value={skill} onChange={(e) => updateSkill(index, e.target.value)} style={{ ...inputStyle, marginBottom: '0', flex: 1 }} placeholder="Add a skill" />
                {resumeData.skills.length > 1 && (
                  <button onClick={() => removeSkill(index)} style={{ ...dangerButton, padding: '10px 14px' }}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <button onClick={addSkill} style={secondaryButton}>
                + Add Skill
              </button>
              <button onClick={generateSuggestedSkills} disabled={isLoading} style={secondaryButton}>
                Generate Skills Suggestions
              </button>
            </div>
          </div>
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div style={{ padding: '24px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Live preview updates as you type.</p>
                <h2 style={{ margin: '10px 0 0', fontSize: '20px', color: 'var(--text-primary)' }}>Preview</h2>
              </div>
              <button onClick={downloadAsPdf} style={primaryButton}>
                Export PDF
              </button>
            </div>
            <ResumePreview ref={previewRef} resumeData={resumeData} selectedTemplate={selectedTemplate} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ResumeBuilder;
