
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'intern' | 'employer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  company_name?: string;
  position?: string;
  bio?: string;
  skills?: string[];
  locations?: string[];
  verified?: boolean;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, companyName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error?: string }>;
  fetchProfile: () => Promise<void>;
  initialize: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      initialize: () => {
        logger.info('Initializing auth store');
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            logger.info('Auth state changed', { event, userId: session?.user?.id });
            
            set({ 
              session, 
              user: session?.user ?? null,
              isLoading: false,
              error: null
            });
            
            // Fetch profile when user logs in
            if (session?.user && event === 'SIGNED_IN') {
              setTimeout(() => {
                get().fetchProfile();
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              set({ profile: null });
              logger.info('User signed out, cleared profile');
            }
          }
        );

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
          logger.info('Existing session found', { userId: session?.user?.id });
          set({ 
            session, 
            user: session?.user ?? null,
            isLoading: false 
          });
          
          if (session?.user) {
            get().fetchProfile();
          }
        });

        return () => subscription.unsubscribe();
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        logger.info('Login attempt', { email });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            logger.warn('Login failed', { email, error: error.message });
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          logger.info('Login successful', { userId: data.user?.id });
          set({ isLoading: false });
          return {};
        } catch (error: any) {
          const errorMessage = 'An unexpected error occurred during login';
          logger.error('Login exception', error, { email });
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      signup: async (email: string, password: string, name: string, role: UserRole, companyName?: string) => {
        set({ isLoading: true, error: null });
        logger.info('Signup attempt', { email, role, hasCompanyName: !!companyName });
        
        try {
          // Use the current origin for redirect URL
          const redirectUrl = `${window.location.origin}/`;
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                name,
                role,
                company_name: companyName || null,
              },
            },
          });

          if (error) {
            logger.warn('Signup failed', { email, error: error.message });
            set({ isLoading: false, error: error.message });
            return { error: error.message };
          }

          if (data.user) {
            logger.info('Signup successful', { userId: data.user.id });
            // If user is created but not confirmed, still consider it a success
            set({ isLoading: false });
            return {};
          } else {
            const errorMessage = 'Failed to create user account';
            logger.error('Signup failed - no user returned', { email });
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }
        } catch (error: any) {
          const errorMessage = 'An unexpected error occurred during signup';
          logger.error('Signup exception', error, { email });
          set({ isLoading: false, error: errorMessage });
          return { error: errorMessage };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        logger.info('Logout attempt');
        
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            logger.error('Logout error', error);
            handleError(error);
          } else {
            logger.info('Logout successful');
          }
          
          set({ 
            user: null, 
            profile: null, 
            session: null, 
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          logger.error('Logout exception', error);
          handleError(error);
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) {
          logger.warn('Fetch profile called without user');
          return;
        }

        logger.info('Fetching user profile', { userId: user.id });

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            logger.error('Profile fetch error', error, { userId: user.id });
            handleError(error);
            return;
          }

          if (data) {
            const profile: UserProfile = {
              id: data.id,
              email: data.email,
              name: data.name,
              role: data.role,
              avatar_url: data.avatar_url,
              company_name: data.company_name,
              position: data.position,
              bio: data.bio,
              skills: data.skills,
              locations: data.locations,
              verified: data.verified,
            };
            set({ profile });
            logger.info('Profile fetched successfully', { userId: user.id, role: profile.role });
          } else {
            logger.warn('No profile found for user', { userId: user.id });
            // Profile will be created by the database trigger, so we can wait a bit and try again
            setTimeout(() => {
              get().fetchProfile();
            }, 1000);
          }
        } catch (error: any) {
          logger.error('Profile fetch exception', error, { userId: user.id });
          handleError(error);
        }
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        const { user, profile } = get();
        if (!user || !profile) {
          logger.warn('Update profile called without user or profile');
          return { error: 'No user logged in' };
        }

        logger.info('Updating profile', { userId: user.id, updateData: Object.keys(profileData) });

        try {
          const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id);

          if (error) {
            logger.error('Profile update error', error, { userId: user.id });
            return { error: error.message };
          }

          set({ profile: { ...profile, ...profileData } });
          logger.info('Profile updated successfully', { userId: user.id });
          return {};
        } catch (error: any) {
          logger.error('Profile update exception', error, { userId: user.id });
          return { error: 'An unexpected error occurred' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        session: state.session,
        user: state.user,
        profile: state.profile 
      }),
    }
  )
);
