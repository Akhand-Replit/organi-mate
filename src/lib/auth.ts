
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'company' | 'branch_manager' | 'assistant_manager' | 'employee' | 'job_seeker';

export interface UserData extends User {
  role?: UserRole;
  company_id?: string;
  branch_id?: string;
  name?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company_id?: string;
  branch_id?: string;
}

export async function signIn(email: string, password: string) {
  // Special case for admin static credentials
  if (email.toLowerCase() === 'admin') {
    // When "admin" is provided, use the correct email in the database
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@system.com',
      password,
    });
    
    if (error) throw error;
    return data;
  }
  
  // Regular sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(userData: CreateUserData) {
  const { email, password, name, role, company_id, branch_id } = userData;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        company_id,
        branch_id
      },
    },
  });
  
  if (error) throw error;
  return data;
}

export async function createUser(userData: CreateUserData, adminKey?: string) {
  // This is used by admins and companies to create users
  const { email, password, name, role, company_id, branch_id } = userData;
  
  const { data, error } = await supabase.functions.invoke('create-user', {
    body: {
      email,
      password,
      userData: {
        name,
        role,
        company_id,
        branch_id
      }
    }
  });
  
  if (error) throw error;
  return data;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<UserData | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Get profile data to include role, company_id, etc.
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      return {
        ...user,
        role: profile.role,
        company_id: profile.company_id,
        branch_id: profile.branch_id,
        name: profile.name
      };
    }
  }
  
  return user as UserData | null;
}

export async function getSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
