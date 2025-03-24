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

// Static admin credentials - stored directly in code as requested
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Not hashed as per request

export async function signIn(email: string, password: string) {
  // Special case for admin static credentials
  if (email.toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Create a mock admin session
    const mockAdminUser: UserData = {
      id: 'admin-user-id',
      email: 'admin@system.com',
      role: 'admin',
      name: 'System Administrator',
      // Add other required User properties with mock values
      app_metadata: {},
      user_metadata: {
        role: 'admin',
        name: 'System Administrator'
      },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    };
    
    // Return a mock session object
    return {
      user: mockAdminUser,
      session: {
        access_token: 'mock-admin-token',
        refresh_token: 'mock-admin-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockAdminUser
      }
    };
  }
  
  // Regular sign in for other users
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
  
  try {
    console.log("Invoking create-user function with data:", {
      email,
      role,
      name,
      company_id,
      branch_id
    });
    
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
    
    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(`Function error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("No data returned from function");
    }
    
    return data;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
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
  // Check for mock admin session in localStorage
  const sessionStr = localStorage.getItem('supabase.auth.token');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.user?.id === 'admin-user-id') {
        return session.user as UserData;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

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
  // Check for mock admin session in localStorage
  const sessionStr = localStorage.getItem('supabase.auth.token');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.user?.id === 'admin-user-id') {
        return session as Session;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }
  
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
