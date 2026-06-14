'use server'

import { supabase } from '../../lib/supabaseClient';
import { supabaseAdmin } from '../../lib/supabaseAdminClient';

async function verifyAdmin(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Unauthorized');
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail || user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new Error('Forbidden: You do not have admin privileges.');
  }
  return user;
}

export async function getAllUsers(token: string) {
  await verifyAdmin(token);
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  
  // Return just the necessary data to prevent leaking sensitive fields
  return users.map(u => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at
  }));
}

export async function createManualUser(token: string, formData: FormData) {
  await verifyAdmin(token);
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Auto-confirm since admin created them
  });

  if (error) throw new Error(error.message);
  return { success: true, user: { id: data.user.id, email: data.user.email } };
}

export async function deleteUser(token: string, userId: string) {
  await verifyAdmin(token);
  
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  return { success: true };
}
