'use server'

import { supabase } from '../lib/supabaseClient';
import { supabaseAdmin } from '../lib/supabaseAdminClient';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

// 1. Securely log a new blood sugar reading
export async function logGlucoseReading(formData: FormData, token: string) {
  // Cryptographically verify the session token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');

  const glucose_level = parseInt(formData.get('glucose_level') as string);
  const context_tag = formData.get('context_tag') as string;
  const meal_reference = formData.get('meal_reference') as string || null;
  const hours_offset = formData.get('hours_offset') ? parseFloat(formData.get('hours_offset') as string) : null;
  const notes = formData.get('notes') as string || null;

  const { error } = await supabaseAdmin
    .from('glucose_readings')
    .insert([
      { 
        user_id: user.id, // Using the securely validated ID!
        glucose_level, 
        context_tag, 
        meal_reference, 
        hours_offset, 
        notes 
      }
    ]);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}

// 2. Fetch the data to compile the combination report
export async function getCombinationReport(token: string, meal?: string, tag?: string, fromDate?: string, toDate?: string, _ts?: number) {
  noStore();
  // Cryptographically verify the session token
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');
  
  let query = supabaseAdmin
    .from('glucose_readings')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false });

  if (meal) query = query.eq('meal_reference', meal);
  if (tag) query = query.eq('context_tag', tag);
  if (fromDate) query = query.gte('recorded_at', new Date(fromDate).toISOString());
  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    query = query.lte('recorded_at', end.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// 3. Log a Blood Pressure reading
export async function logBloodPressureReading(formData: FormData, token: string) {
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');

  const systolic = parseInt(formData.get('systolic') as string);
  const diastolic = parseInt(formData.get('diastolic') as string);
  const pulse = parseInt(formData.get('pulse') as string);
  const context_tag = formData.get('context_tag') as string || null;
  const notes = formData.get('notes') as string || null;

  const { error } = await supabaseAdmin
    .from('blood_pressure_readings')
    .insert([
      { 
        user_id: user.id,
        systolic,
        diastolic,
        pulse,
        context_tag, 
        notes 
      }
    ]);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return { success: true };
}

// 4. Fetch Blood Pressure report data
export async function getBloodPressureReport(token: string, tag?: string, fromDate?: string, toDate?: string, _ts?: number) {
  noStore();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) throw new Error('Unauthorized request');
  
  let query = supabaseAdmin
    .from('blood_pressure_readings')
    .select('*')
    .eq('user_id', user.id)
    .order('recorded_at', { ascending: false });

  if (tag) query = query.eq('context_tag', tag);
  if (fromDate) query = query.gte('recorded_at', new Date(fromDate).toISOString());
  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);
    query = query.lte('recorded_at', end.toISOString());
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}
