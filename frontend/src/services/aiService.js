import { supabase } from '../supabaseClient';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-resume-helper`;

async function callAiHelper(payload) {
  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData?.session?.access_token;

  if (!accessToken) {
    throw new Error('You must be logged in to use AI features.');
  }

  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    if (errorBody.error === 'FREE_LIMIT_REACHED') {
      throw new Error(errorBody.message || 'Free limit reached. Upgrade to Premium for unlimited access.');
    }
    throw new Error(errorBody.error || 'AI service failed. Please try again.');
  }

  const data = await response.json();
  return data.result;
}

export async function generateProfessionalSummary(personalInfo, experience, education) {
  try {
    return await callAiHelper({
      action: 'summary',
      personalInfo,
      experience,
      education,
    });
  } catch (err) {
    console.error('generateProfessionalSummary error:', err);
    throw err;
  }
}

export async function suggestSkills(experience, projects, certifications) {
  try {
    const raw = await callAiHelper({
      action: 'skills',
      experience,
      projects,
      certifications,
    });

    // Gemini returns skills as a JSON array string, e.g. ["React","Node.js"]
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('suggestSkills error:', err);
    throw err;
  }
}

export async function improveExperienceDescription(description, achievements) {
  try {
    return await callAiHelper({
      action: 'improve_bullet',
      description,
      achievements,
    });
  } catch (err) {
    console.error('improveExperienceDescription error:', err);
    throw err;
  }
}