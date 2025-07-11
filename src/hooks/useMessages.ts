
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useMessages = (applicationId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['messages', applicationId],
    queryFn: async () => {
      try {
        logger.info('Fetching messages', { applicationId });
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(name, avatar_url)
          `)
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        logger.info('Messages fetched successfully', { count: data?.length });
        return data || [];
      } catch (error) {
        logger.error('Failed to fetch messages', error, { applicationId });
        handleError(error, toast);
        throw error;
      }
    },
    enabled: !!applicationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (messageData: {
      sender_id: string;
      recipient_id: string;
      application_id: string;
      content: string;
    }) => {
      logger.info('Sending message', { 
        senderId: messageData.sender_id,
        recipientId: messageData.recipient_id,
        applicationId: messageData.application_id 
      });
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      logger.info('Message sent successfully', { messageId: data.id });
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered.',
      });
    },
    onError: (error) => {
      logger.error('Failed to send message', error);
      handleError(error, toast);
    },
  });
};
