
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { hashPassword, comparePassword } from './passwordUtils';

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
const ADMIN_PASSWORD = 'admin123'; // Updated to match the displayed password in Login.tsx

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
    
    // Store mock admin session in localStorage to persist it
    const mockSession = {
      access_token: 'mock-admin-token',
      refresh_token: 'mock-admin-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: mockAdminUser
    };
    
    localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
    
    // Return a mock session object
    return {
      user: mockAdminUser,
      session: mockSession
    };
  }
  
  // Find credentials by username (email)
  const { data, error } = await supabase
    .from('user_credentials')
    .select('user_id, password_hash')
    .eq('username', email)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Invalid username or password.");

  const { user_id, password_hash } = data;

  const passwordValid = await comparePassword(password, password_hash);
  if (!passwordValid) throw new Error("Invalid username or password.");

  // Issue a Supabase session (let's use the native auth)
  // Use "magic link" or token-based login if required. Here, we can sign in directly:
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) throw authError;

  return {
    user: authData.user,
    session: authData.session,
  };
}

/**
 * Sign up a new user: creates a user row, then saves username and password hash in user_credentials.
 */
export async function signUp(userData: CreateUserData) {
  // We expect "email" as the username in this model
  const { email, password, name, role, company_id, branch_id } = userData;

  // Create auth user first with Supabase native signup (for "auth.users" record + session)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, name, company_id, branch_id }
    }
  });

  if (signUpError) throw signUpError;

  const user_id = signUpData?.user?.id;
  if (!user_id) throw new Error("User ID not found after sign up.");

  // Hash password and store in user_credentials
  const password_hash = await hashPassword(password);

  const { error: credentialsError } = await supabase
    .from('user_credentials')
    .insert([
      {
        user_id,
        username: email,
        password_hash,
      }
    ]);

  if (credentialsError) throw credentialsError;

  return signUpData;
}

export async function createUser(userData: CreateUserData) {
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
    
    // For admin creating a company user, we'll first try with Edge Function
    // but have a direct Supabase API fallback in case the function fails
    const isAdminCreatingCompany = role === 'company';
    
    // Get current session
    const session = await getSession();
    
    if (isAdminCreatingCompany) {
      try {
        // Try Edge Function first
        let headers: Record<string, string> = {};
        
        // For static admin (which has no actual JWT token)
        if (session?.user.id === 'admin-user-id') {
          headers = {
            'X-Admin-Auth': 'static-admin-token'
          };
        } 
        // For normal authenticated users with valid tokens
        else if (session?.access_token) {
          headers = {
            'Authorization': `Bearer ${session.access_token}`
          };
        }
        
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
          },
          headers
        });
        
        if (error) throw error;
        
        if (!data) {
          throw new Error("No data returned from function");
        }
        
        return data;
      } catch (edgeFunctionError) {
        console.log("Edge Function failed, falling back to direct API:", edgeFunctionError);
        
        // Fall back to direct API approach if Edge Function fails
        // Register the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              company_id,
              branch_id
            }
          }
        });
        
        if (authError) throw authError;
        
        // Create company record
        if (authData?.user) {
          const { error: companyError } = await supabase
            .from('companies')
            .insert({
              name,
              user_id: authData.user.id
            });
            
          if (companyError) throw companyError;
        }
        
        return authData;
      }
    } else {
      // For other user types, still try the Edge Function as before
      let headers: Record<string, string> = {};
      
      // For static admin (which has no actual JWT token)
      if (session?.user.id === 'admin-user-id') {
        headers = {
          'X-Admin-Auth': 'static-admin-token'
        };
      } 
      // For normal authenticated users with valid tokens
      else if (session?.access_token) {
        headers = {
          'Authorization': `Bearer ${session.access_token}`
        };
      }
      
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
        },
        headers
      });
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("No data returned from function");
      }
      
      return data;
    }
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
  localStorage.removeItem('supabase.auth.token');
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
