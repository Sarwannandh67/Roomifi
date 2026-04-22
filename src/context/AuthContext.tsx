import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Define the user profile interface
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  language_preference?: string;
  currency_preference?: string;
  is_premium?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched successfully:', data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      return null;
    }
  };

  // Create a new profile for a user
  const createProfile = async (userId: string, email: string) => {
    try {
      console.log('Creating profile for user:', userId);
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        setProfile(existingProfile);
        return existingProfile;
      }
      
      // Create new profile using 'id'
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            email,
            language_preference: 'en',
            currency_preference: 'USD',
            is_premium: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      console.log('Profile created successfully:', data);
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Unexpected error creating profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Loading timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, 5000); // 5 second timeout
    
    // Check active sessions and sets the user
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
        
        console.log('Session check result:', data?.session ? 'Session found' : 'No session');
        setUser(data?.session?.user ?? null);
        
        if (data?.session?.user) {
          try {
            await fetchProfile(data.session.user.id);
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            // Continue even if profile fetch fails
          }
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error('Unexpected error checking session:', e);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        clearTimeout(loadingTimeout); // Clear timeout when done
      }
    };
    
    checkSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'User session exists' : 'No user session');
      
      try {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          try {
            await fetchProfile(currentUser.id);
          } catch (profileError) {
            console.error('Error fetching profile on auth change:', profileError);
            // Continue even if profile fetch fails
          }
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error('Error in auth state change handler:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('Unsubscribing from auth state changes');
      subscription.unsubscribe();
      clearTimeout(loadingTimeout); // Clear timeout on cleanup
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Create a profile for the new user
      if (data.user) {
        await createProfile(data.user.id, email);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    
    try {
      const projectRef = (() => {
        try {
          const hostname = new URL(import.meta.env.VITE_SUPABASE_URL).hostname;
          return hostname.split('.')[0] || hostname;
        } catch {
          return undefined;
        }
      })();

      // First check if the user exists
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.log('No existing session found, attempting to sign in');
      } else {
        console.log('Existing user found:', userData);
      }
      
      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Provide more specific error messages based on the error code
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email before signing in. Check your inbox for a confirmation link.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error(
            `Invalid email or password. If you signed up in a different Supabase project, update VITE_SUPABASE_URL${projectRef ? ` (current: ${projectRef})` : ''}.`
          );
        } else {
          throw error;
        }
      }
      
      console.log('Sign in successful:', data);
      
      // Fetch the user's profile
      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } catch (err) {
      console.error('Caught error during sign in:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user completely');
      
      // First clear local state before calling Supabase
      // This ensures UI updates immediately
      setUser(null);
      setProfile(null);
      
      // Call Supabase signOut with the most thorough options
      // This will clear all active sessions including refresh tokens
      const { error } = await supabase.auth.signOut({
        scope: 'global' // This logs out from all devices
      });
      
      if (error) {
        console.error('Error signing out from Supabase:', error);
        throw error;
      }
      
      console.log('Supabase sign out successful');
      
      // Clear any Supabase-related items from localStorage
      // This is a fallback in case the Supabase signOut doesn't clear everything
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('User completely logged out and all auth data cleared');
      return true;
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    console.log('Attempting to sign in with Google');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
      
      console.log('Google sign in initiated, URL:', data?.url);
      
      // Redirect the user to the OAuth URL
      if (data?.url) {
        window.location.href = data.url;
      }
      
      return data;
    } catch (err) {
      console.error('Caught error during Google sign in:', err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) throw new Error('User must be logged in to update profile');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Refresh the profile data
      await fetchProfile(user.id);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
