import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

export const useRealtimeProfiles = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`profile:${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        logger.info('Profile updated', { payload });
        // Update the local auth store with new profile data
        const updatedProfile = payload.new as any;
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        queryClient.setQueryData(['profile', user.id], updatedProfile);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to profile real-time updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      logger.info('Unsubscribed from profile channel');
    };
  }, [user?.id, queryClient]);
};

export const useRealtimeCompanyProfiles = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('companies-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'companies'
      }, (payload) => {
        logger.info('New company registered', { payload });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'companies'
      }, (payload) => {
        logger.info('Company profile updated', { payload });
        queryClient.invalidateQueries({ queryKey: ['companies'] });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to companies real-time updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};