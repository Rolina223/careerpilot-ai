import { supabase } from '../supabaseClient';
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
    accent: 'var(--color-brand)',
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
    accent: 'var(--color-warning)',
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

// ----- DATABASE FUNCTIONS (real persistence per logged-in user) -----

export async function loadResumeFromDb() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('resumes')
    .select('id, resume_data, selected_template, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('loadResumeFromDb error:', error);
    return null;
  }

  return data;
}

export async function saveResumeToDb(resumeId, resumeData, selectedTemplate) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return { error: 'Not logged in' };

  if (resumeId) {
    const { data, error } = await supabase
      .from('resumes')
      .update({
        resume_data: resumeData,
        selected_template: selectedTemplate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .select('id')
      .single();

    return { data, error };
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      resume_data: resumeData,
      selected_template: selectedTemplate,
    })
    .select('id')
    .single();

  return { data, error };
}
