
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';
import { useRealtimeApplications } from './useRealtimeApplications';

export const useApplications = (userId?: string) => {
  const { toast } = useToast();
  
  // Enable real-time updates for applications
  useRealtimeApplications();
  
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
