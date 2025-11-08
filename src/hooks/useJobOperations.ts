import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

interface CreateJobData {
  title: string;
  description: string;
  company_id?: string;
  location?: string;
  job_type?: 'full-time' | 'part-time' | 'contract';
  experience_level?: 'entry-level' | 'mid-level' | 'senior' | 'lead';
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  skills_required?: string[];
  is_remote?: boolean;
  application_deadline?: string;
  start_date?: string;
  status?: 'active' | 'paused' | 'closed' | 'draft';
}

interface UpdateJobData extends Partial<CreateJobData> {
  id: string;
}

export const useJobOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJobMutation = useMutation({
    mutationFn: async (data: CreateJobData) => {
      logger.info('Creating job', { title: data.title });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: job, error } = await supabase
        .from('jobs')
        .insert([{
          ...data,
          employer_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      
      logger.info('Job created successfully', { jobId: job.id });
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
    },
    onError: (error) => {
      logger.error('Failed to create job', error);
      handleError(error, toast);
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateJobData) => {
      logger.info('Updating job', { jobId: id });
      
      const { data: job, error } = await supabase
        .from('jobs')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      logger.info('Job updated successfully', { jobId: id });
      return job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posting updated successfully",
      });
    },
    onError: (error) => {
      logger.error('Failed to update job', error);
      handleError(error, toast);
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      logger.info('Deleting job', { jobId });
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      logger.info('Job deleted successfully', { jobId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posting deleted successfully",
      });
    },
    onError: (error) => {
      logger.error('Failed to delete job', error);
      handleError(error, toast);
    },
  });

  return {
    createJob: createJobMutation.mutateAsync,
    updateJob: updateJobMutation.mutateAsync,
    deleteJob: deleteJobMutation.mutateAsync,
    isCreating: createJobMutation.isPending,
    isUpdating: updateJobMutation.isPending,
    isDeleting: deleteJobMutation.isPending,
  };
};
