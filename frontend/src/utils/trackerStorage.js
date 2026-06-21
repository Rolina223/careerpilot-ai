import { supabase } from '../supabaseClient';

export async function getCurrentUserId() {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
}

export async function fetchApplications() {
  const userId = await getCurrentUserId();
  if (!userId) return { data: [], error: 'Not logged in' };

  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data: data || [], error };
}

export async function createApplication(app) {
  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      user_id: userId,
      company: app.company,
      role: app.role,
      location: app.location || null,
      status: app.status,
      applied_date: app.appliedDate || null,
      follow_up_date: app.followUp || null,
      notes: app.notes || null,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateApplication(id, app) {
  const userId = await getCurrentUserId();
  if (!userId) return { data: null, error: 'Not logged in' };

  const { data, error } = await supabase
    .from('job_applications')
    .update({
      company: app.company,
      role: app.role,
      location: app.location || null,
      status: app.status,
      applied_date: app.appliedDate || null,
      follow_up_date: app.followUp || null,
      notes: app.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  return { data, error };
}

export async function deleteApplication(id) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'Not logged in' };

  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  return { error };
}

export async function updateApplicationStatus(id, status) {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'Not logged in' };

  const { error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);

  return { error };
}

// Converts a database row (snake_case) into the shape the Tracker UI expects (camelCase)
export function mapDbRowToApp(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location || '',
    status: row.status,
    appliedDate: row.applied_date || '',
    followUp: row.follow_up_date || '',
    notes: row.notes || '',
  };
}