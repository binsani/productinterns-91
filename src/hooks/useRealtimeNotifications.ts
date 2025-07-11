
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useRealtimeNotifications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        logger.info('New notification received', { payload });
        
        // Invalidate notifications query to refetch
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        
        // Show toast notification
        const notification = payload.new as any;
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default'
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to notifications channel');
        } else if (status === 'CHANNEL_ERROR') {
          logger.error('Failed to subscribe to notifications channel');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      logger.info('Unsubscribed from notifications channel');
    };
  }, [user?.id, queryClient, toast]);
};
