'use server'

import { supabase } from '../../lib/supabaseClient';
import { supabaseAdmin } from '../../lib/supabaseAdminClient';

export async function getProfile(token: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for a new user
    throw new Error(error.message);
  }

  return data;
}

export async function updateProfile(formData: FormData, token: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');

  const updates = {
    user_id: user.id,
    name: formData.get('name') as string || null,
    age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
    gender: formData.get('gender') as string || null,
    blood_group: formData.get('blood_group') as string || null,
    diabetes_type: formData.get('diabetes_type') as string || null,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert(updates, { onConflict: 'user_id' });

  if (error) throw new Error(error.message);
  return { success: true };
}
