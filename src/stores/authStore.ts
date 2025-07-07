
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
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
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole, companyName?: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error?: string }>;
  fetchProfile: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      session: null,
      isLoading: false,

      initialize: () => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            set({ 
              session, 
              user: session?.user ?? null,
              isLoading: false 
            });
            
            // Fetch profile when user logs in
            if (session?.user && event === 'SIGNED_IN') {
              setTimeout(() => {
                get().fetchProfile();
              }, 0);
            } else if (event === 'SIGNED_OUT') {
              set({ profile: null });
            }
          }
        );

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
          console.log('Initial session check:', session?.user?.email);
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
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          console.log('Login successful:', data.user?.email);
          return {};
        } catch (error) {
          set({ isLoading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      signup: async (email: string, password: string, name: string, role: UserRole, companyName?: string) => {
        set({ isLoading: true });
        try {
          const redirectUrl = `${window.location.origin}/`;
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: redirectUrl,
              data: {
                name,
                role,
                company_name: companyName,
              },
            },
          });

          if (error) {
            set({ isLoading: false });
            return { error: error.message };
          }

          console.log('Signup successful:', data.user?.email);
          set({ isLoading: false });
          return {};
        } catch (error) {
          set({ isLoading: false });
          return { error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Logout error:', error.message);
          }
          set({ 
            user: null, 
            profile: null, 
            session: null, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error.message);
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
          } else {
            // If no profile exists, create one using user metadata
            const metadata = user.user_metadata || {};
            const newProfileData = {
              id: user.id,
              email: user.email || '',
              name: metadata.name || user.email || 'User',
              role: metadata.role || 'intern',
              company_name: metadata.company_name,
            };

            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert(newProfileData)
              .select()
              .single();

            if (insertError) {
              console.error('Error creating profile:', insertError.message);
              return;
            }

            if (newProfile) {
              const profile: UserProfile = {
                id: newProfile.id,
                email: newProfile.email,
                name: newProfile.name,
                role: newProfile.role,
                avatar_url: newProfile.avatar_url,
                company_name: newProfile.company_name,
                position: newProfile.position,
                bio: newProfile.bio,
                skills: newProfile.skills,
                locations: newProfile.locations,
                verified: newProfile.verified,
              };
              set({ profile });
            }
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      },

      updateProfile: async (profileData: Partial<UserProfile>) => {
        const { user, profile } = get();
        if (!user || !profile) return { error: 'No user logged in' };

        try {
          const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', user.id);

          if (error) {
            return { error: error.message };
          }

          set({ profile: { ...profile, ...profileData } });
          return {};
        } catch (error) {
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
