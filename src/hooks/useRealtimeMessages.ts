
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export const useRealtimeMessages = (applicationId?: string) => {
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!applicationId) return;

    const channel = supabase
      .channel(`messages:${applicationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `application_id=eq.${applicationId}`
      }, (payload) => {
        // Invalidate and refetch messages
        queryClient.invalidateQueries({ queryKey: ['messages', applicationId] });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `application_id=eq.${applicationId}`
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['messages', applicationId] });
      })
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [applicationId, queryClient]);

  return { isSubscribed };
};
