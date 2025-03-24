
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, UserData, getSession } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: UserData | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip processing if this is a mock admin session
        if (session?.user?.id !== 'admin-user-id') {
          setSession(session);
          
          if (session?.user) {
            const userData = await getCurrentUser();
            setUser(userData);
          } else {
            setUser(null);
          }
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session, including the mock admin
    getSession().then(session => {
      setSession(session);
      
      if (session) {
        getCurrentUser().then(userData => {
          setUser(userData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // Check if it's the admin user
      if (user?.id === 'admin-user-id') {
        // Clear the mock admin session
        localStorage.removeItem('supabase.auth.token');
        setUser(null);
        setSession(null);
        navigate('/login');
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        });
        return;
      }

      // Regular sign out for other users
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
