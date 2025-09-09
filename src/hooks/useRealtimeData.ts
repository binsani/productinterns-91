import { useRealtimeNotifications } from './useRealtimeNotifications';
import { useRealtimeApplications, useRealtimeEmployerApplications } from './useRealtimeApplications';
import { useRealtimeInternships } from './useRealtimeInternships';
import { useRealtimeProfiles, useRealtimeCompanyProfiles } from './useRealtimeProfiles';
import { useRealtimeMessages } from './useRealtimeMessages';
import { useAuthStore } from '@/stores/authStore';

/**
 * Master hook that enables all real-time data subscriptions
 * Call this hook in your main App component to enable real-time updates across the entire application
 */
export const useRealtimeData = () => {
  const { user } = useAuthStore();

  // Enable real-time updates for all data types
  useRealtimeNotifications();
  useRealtimeInternships();
  useRealtimeProfiles();
  useRealtimeCompanyProfiles();

  // Role-specific real-time subscriptions
  if (user?.id) {
    const profile = user as any; // Type assertion for profile data
    
    if (profile.role === 'intern') {
      useRealtimeApplications();
    } else if (profile.role === 'employer') {
      useRealtimeEmployerApplications();
    }
  }

  return {
    isRealtimeEnabled: !!user?.id,
  };
};