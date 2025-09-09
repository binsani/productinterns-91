import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useRealtimeApplications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`applications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'applications',
        filter: `intern_id=eq.${user.id}`
      }, (payload) => {
        logger.info('New application created', { payload });
        queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
        
        toast({
          title: 'Application Submitted',
          description: 'Your application has been submitted successfully.',
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'applications',
        filter: `intern_id=eq.${user.id}`
      }, (payload) => {
        logger.info('Application status updated', { payload });
        queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
        
        const application = payload.new as any;
        const oldApplication = payload.old as any;
        
        // Show toast for status changes
        if (application.status !== oldApplication.status) {
          const statusMessage = {
            accepted: 'Your application has been accepted! 🎉',
            rejected: 'Your application status has been updated.',
            interview: 'You have been invited for an interview! 📅',
            pending: 'Your application is being reviewed.'
          }[application.status] || 'Your application status has been updated.';
          
          toast({
            title: 'Application Update',
            description: statusMessage,
            variant: application.status === 'accepted' ? 'default' : 'default',
          });
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to applications real-time updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      logger.info('Unsubscribed from applications channel');
    };
  }, [user?.id, queryClient, toast]);
};

export const useRealtimeEmployerApplications = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`employer-applications:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'applications'
      }, (payload) => {
        logger.info('New application received', { payload });
        queryClient.invalidateQueries({ queryKey: ['employer-applications', user.id] });
        
        toast({
          title: 'New Application',
          description: 'You have received a new application.',
        });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to employer applications real-time updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient, toast]);
};