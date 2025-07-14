import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import { sanitizeInput } from '@/utils/inputSanitizer';
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
          // Sanitize inputs
          const sanitizedEmail = sanitizeInput.email(email);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: sanitizedEmail,
            password,
          });

          if (error) {
            logger.warn('Login failed', { email: sanitizedEmail, error: error.message });
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
        logger.info('Signup attempt started', { email, role, hasCompanyName: !!companyName });
        
        try {
          // Enhanced input sanitization
          const sanitizedEmail = sanitizeInput.email(email.trim());
          const sanitizedName = sanitizeInput.text(name.trim());
          const sanitizedCompanyName = companyName ? sanitizeInput.text(companyName.trim()) : undefined;
          
          // Enhanced validation
          if (!sanitizedName || sanitizedName.length < 2) {
            const errorMessage = 'Name must be at least 2 characters long';
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }
          
          if (role === 'employer' && (!sanitizedCompanyName || sanitizedCompanyName.length < 2)) {
            const errorMessage = 'Company name is required for employers';
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }
          
          if (password.length < 6) {
            const errorMessage = 'Password must be at least 6 characters long';
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }

          // Use the current origin for redirect URL - this is critical
          const redirectUrl = `${window.location.origin}/`;
          logger.info('Using redirect URL', { redirectUrl });
          
          const signupData = {
            email: sanitizedEmail,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                name: sanitizedName,
                role: role,
                company_name: sanitizedCompanyName || null,
              },
            },
          };
          
          logger.info('Sending signup request', { 
            email: sanitizedEmail, 
            role, 
            redirectUrl,
            metaData: signupData.options.data 
          });

          const { data, error } = await supabase.auth.signUp(signupData);

          if (error) {
            logger.error('Supabase signup error', error, { 
              email: sanitizedEmail, 
              errorCode: error.status,
              errorMessage: error.message 
            });
            
            // Enhanced error message handling
            let userFriendlyMessage = error.message;
            if (error.message.includes('duplicate key value')) {
              userFriendlyMessage = 'An account with this email already exists. Please try signing in instead.';
            } else if (error.message.includes('invalid email')) {
              userFriendlyMessage = 'Please enter a valid email address.';
            } else if (error.message.includes('password')) {
              userFriendlyMessage = 'Password must be at least 6 characters long.';
            }
            
            set({ isLoading: false, error: userFriendlyMessage });
            return { error: userFriendlyMessage };
          }

          if (data.user) {
            logger.info('Signup successful', { 
              userId: data.user.id, 
              emailConfirmed: data.user.email_confirmed_at ? 'yes' : 'no',
              identities: data.user.identities?.length || 0
            });
            
            // Check if email confirmation is required
            if (!data.user.email_confirmed_at && data.user.identities?.length === 0) {
              logger.info('Email confirmation required for user', { userId: data.user.id });
              set({ isLoading: false, error: null });
              return { 
                error: 'Please check your email and click the confirmation link to complete your registration.' 
              };
            }
            
            set({ isLoading: false, error: null });
            return {};
          } else {
            const errorMessage = 'Failed to create user account - no user data returned';
            logger.error('Signup failed - no user returned', { email: sanitizedEmail });
            set({ isLoading: false, error: errorMessage });
            return { error: errorMessage };
          }
        } catch (error: any) {
          const errorMessage = error.message || 'An unexpected error occurred during signup';
          logger.error('Signup exception', error, { 
            email, 
            stack: error.stack,
            name: error.name 
          });
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
