
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

export const useInternships = (filters?: { location?: string; skills?: string[] }) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['internships', filters],
    queryFn: async () => {
      try {
        logger.info('Fetching internships', { filters });
        
        let query = supabase
          .from('internships')
          .select(`
            *,
            companies (
              id,
              name,
              logo_url,
              industry
            )
          `)
          .eq('status', 'active');

        if (filters?.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }

        if (filters?.skills?.length) {
          query = query.overlaps('skills_required', filters.skills);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        
        logger.info('Internships fetched successfully', { count: data?.length });
        return data || [];
      } catch (error) {
        logger.error('Failed to fetch internships', error, { filters });
        handleError(error, toast);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useApplications = (userId?: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['applications', userId],
    queryFn: async () => {
      try {
        logger.info('Fetching applications', { userId });
        
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            internships (
              id,
              title,
              company_id,
              companies (
                name,
                logo_url
              )
            )
          `)
          .eq('intern_id', userId)
          .order('applied_at', { ascending: false });

        if (error) throw error;
        
        logger.info('Applications fetched successfully', { count: data?.length });
        return data || [];
      } catch (error) {
        logger.error('Failed to fetch applications', error, { userId });
        handleError(error, toast);
        throw error;
      }
    },
    enabled: !!userId,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (applicationData: {
      internship_id: string;
      intern_id: string;
      cover_letter: string;
      resume_url?: string;
    }) => {
      logger.info('Creating application', { 
        internshipId: applicationData.internship_id,
        internId: applicationData.intern_id 
      });
      
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      logger.info('Application created successfully', { applicationId: data.id });
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully.',
      });
    },
    onError: (error) => {
      logger.error('Failed to create application', error);
      handleError(error, toast);
    },
  });
};

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
