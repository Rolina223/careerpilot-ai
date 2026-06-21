import { supabase } from '../supabaseClient';

// Fetch all available sets of a given type (e.g. 'aptitude', 'coding_mcq', 'coding_problem', 'interview')
export async function fetchQuestionSets(type) {
  const { data, error } = await supabase
    .from('question_sets')
    .select('id, title, category, role, difficulty, is_premium, created_at')
    .eq('type', type)
    .order('created_at', { ascending: true });

  return { data: data || [], error };
}

// Fetch all questions belonging to one specific set, in order
export async function fetchQuestionsForSet(setId) {
  const { data, error } = await supabase
    .from('questions')
    .select('id, data, order_index')
    .eq('set_id', setId)
    .order('order_index', { ascending: true });

  if (error) return { data: [], error };

  // Flatten: merge the question's own id with its stored `data` JSON
  const flattened = (data || []).map((row) => ({
    id: row.id,
    ...row.data,
  }));

  return { data: flattened, error: null };
}