import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { User, Session } from '@supabase/supabase-js';
import type { Tables } from '../types/supabase';

type Profile = Tables<'profiles'>;

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: string;
  signUp: (email: string, password: string, fullName: string, country: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, session, isLoading, setUser, setSession, setProfile, setLoading, logout } = useAuthStore();

  useEffect(() => {
    let mounted = true;



    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAndCreateProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || !profile) {
          // Check if profile exists, if not create it (fallback for external auth/failed signup)
          checkAndCreateProfile(session.user);
        } else {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    async function checkAndCreateProfile(user: User) {
      if (!mounted) return;
      setLoading(true);
      
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        console.log('Profile missing, creating auto-healed profile...', user.id);
        
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'New Patient',
          country: user.user_metadata?.country || 'Unknown',
          role: 'patient',
        });
        
        if (insertError) {
          console.error('Error creating missing profile:', insertError);
        } else {
          // Fetch again after creation
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (mounted) setProfile(newProfile ?? null);
        }
      } else {
        if (mounted) setProfile(existingProfile);
      }
      if (mounted) setLoading(false);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, country: string) => {
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: fullName, 
          country: country 
        },
      },
    });
    
    if (authError) {
      console.error('Auth Error:', authError);
      return { data: null, error: authError };
    }

    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    logout();
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    role: profile?.role ?? 'patient',
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
