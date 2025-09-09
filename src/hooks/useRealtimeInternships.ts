import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useRealtimeInternships = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('internships-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'internships'
      }, (payload) => {
        logger.info('New internship posted', { payload });
        queryClient.invalidateQueries({ queryKey: ['internships'] });
        
        const internship = payload.new as any;
        toast({
          title: 'New Opportunity',
          description: `A new internship "${internship.title}" has been posted.`,
        });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'internships'
      }, (payload) => {
        logger.info('Internship updated', { payload });
        queryClient.invalidateQueries({ queryKey: ['internships'] });
        
        const internship = payload.new as any;
        const oldInternship = payload.old as any;
        
        // Notify if deadline is approaching or other important changes
        if (internship.application_deadline !== oldInternship.application_deadline) {
          toast({
            title: 'Internship Updated',
            description: `"${internship.title}" application deadline has been updated.`,
          });
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'internships'
      }, (payload) => {
        logger.info('Internship deleted', { payload });
        queryClient.invalidateQueries({ queryKey: ['internships'] });
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Subscribed to internships real-time updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
      logger.info('Unsubscribed from internships channel');
    };
  }, [queryClient, toast]);
};