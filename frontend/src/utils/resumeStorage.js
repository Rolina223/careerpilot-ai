export const STORAGE_KEY = 'careerpilot_resume_data';
export const TEMPLATE_KEY = 'careerpilot_selected_template';

export const resumeTemplates = [
  {
    id: 'ats',
    name: 'ATS Friendly',
    icon: '💼',
    description: 'Clean layout built for applicant tracking systems.',
    accent: '#1e40af',
    layout: 'ats',
  },
  {
    id: 'modern',
    name: 'Modern Tech',
    icon: '💻',
    description: 'A colorful layout for product and engineering roles.',
    accent: '#0ea5e9',
    layout: 'modern',
  },
  {
    id: 'executive',
    name: 'Executive',
    icon: '👔',
    description: 'A polished executive resume with bold sections.',
    accent: '#4338ca',
    layout: 'executive',
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    description: 'A visual layout for designers and marketing professionals.',
    accent: '#f97316',
    layout: 'creative',
  },
];

export const defaultResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    linkedin: '',
    github: '',
    portfolio: '',
    photo: '',
  },
  experience: [
    {
      company: '',
      position: '',
      duration: '',
      description: '',
      achievements: [''],
    },
  ],
  education: [
    { school: '', degree: '', field: '', year: '' },
  ],
  projects: [
    { name: '', techStack: '', description: '', githubLink: '' },
  ],
  certifications: [
    { name: '', issuer: '', year: '' },
  ],
  skills: [''],
};

export function getStoredResume() {
  if (typeof window === 'undefined') return defaultResumeData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultResumeData;
  } catch {
    return defaultResumeData;
  }
}

export function saveResumeData(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getStoredTemplate() {
  if (typeof window === 'undefined') return resumeTemplates[0].id;
  return localStorage.getItem(TEMPLATE_KEY) || resumeTemplates[0].id;
}

export function saveSelectedTemplate(templateId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEMPLATE_KEY, templateId);
}
