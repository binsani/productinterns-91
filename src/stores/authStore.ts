
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'intern' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  position?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole, companyName?: string) => Promise<void>;
  updateUser: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      login: async (email: string, password: string, role: UserRole) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0].replace(/[^a-zA-Z ]/g, '').replace(/\b\w/g, l => l.toUpperCase()),
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          companyName: role === 'employer' ? 'Tech Company Inc.' : undefined,
          position: role === 'intern' ? 'Product Management Intern' : role === 'employer' ? 'Hiring Manager' : 'Platform Administrator'
        };
        
        set({ user, isLoading: false });
      },
      signup: async (email: string, password: string, name: string, role: UserRole, companyName?: string) => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          companyName: role === 'employer' ? companyName : undefined,
          position: role === 'intern' ? 'Product Management Intern' : role === 'employer' ? 'Hiring Manager' : 'Platform Administrator'
        };
        
        set({ user, isLoading: false });
      },
      updateUser: (userData: User) => {
        set({ user: userData });
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
