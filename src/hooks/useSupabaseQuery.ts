
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';

export const useInternships = (filters?: { location?: string; skills?: string[] }) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['internships', filters],
    queryFn: async () => {
      try {
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
        return data || [];
      } catch (error) {
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
        return data || [];
      } catch (error) {
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
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully.',
      });
    },
    onError: (error) => {
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
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_id_fkey(name, avatar_url)
          `)
          .eq('application_id', applicationId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
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
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast({
        title: 'Message sent',
        description: 'Your message has been delivered.',
      });
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });
};
