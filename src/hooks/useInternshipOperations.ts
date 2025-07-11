
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

interface CreateInternshipData {
  title: string;
  description: string;
  company_id?: string;
  location?: string;
  is_remote?: boolean;
  duration?: string;
  stipend_amount?: number;
  stipend_currency?: string;
  skills_required?: string[];
  requirements?: string[];
  benefits?: string[];
  application_deadline?: string;
  start_date?: string;
}

interface UpdateInternshipData extends Partial<CreateInternshipData> {
  id: string;
}

export const useInternshipOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuthStore();

  const createInternshipMutation = useMutation({
    mutationFn: async (data: CreateInternshipData) => {
      if (!profile?.id) throw new Error('User not authenticated');
      
      const internshipData = {
        ...data,
        employer_id: profile.id,
        status: 'active'
      };

      logger.info('Creating internship', { internshipData });

      const { data: internship, error } = await supabase
        .from('internships')
        .insert(internshipData)
        .select()
        .single();

      if (error) throw error;
      return internship;
    },
    onSuccess: (internship) => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      logger.info('Internship created successfully', { internshipId: internship.id });
      toast({
        title: 'Success',
        description: 'Internship posted successfully'
      });
    },
    onError: (error) => {
      logger.error('Failed to create internship', error);
      toast({
        title: 'Error',
        description: 'Failed to create internship',
        variant: 'destructive'
      });
    }
  });

  const updateInternshipMutation = useMutation({
    mutationFn: async ({ id, ...data }: UpdateInternshipData) => {
      logger.info('Updating internship', { internshipId: id, updateData: data });

      const { data: internship, error } = await supabase
        .from('internships')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return internship;
    },
    onSuccess: (internship) => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      logger.info('Internship updated successfully', { internshipId: internship.id });
      toast({
        title: 'Success',
        description: 'Internship updated successfully'
      });
    },
    onError: (error) => {
      logger.error('Failed to update internship', error);
      toast({
        title: 'Error',
        description: 'Failed to update internship',
        variant: 'destructive'
      });
    }
  });

  const deleteInternshipMutation = useMutation({
    mutationFn: async (internshipId: string) => {
      logger.info('Deleting internship', { internshipId });

      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', internshipId);

      if (error) throw error;
    },
    onSuccess: (_, internshipId) => {
      queryClient.invalidateQueries({ queryKey: ['internships'] });
      logger.info('Internship deleted successfully', { internshipId });
      toast({
        title: 'Success',
        description: 'Internship deleted successfully'
      });
    },
    onError: (error) => {
      logger.error('Failed to delete internship', error);
      toast({
        title: 'Error',
        description: 'Failed to delete internship',
        variant: 'destructive'
      });
    }
  });

  return {
    createInternship: createInternshipMutation.mutateAsync,
    updateInternship: updateInternshipMutation.mutateAsync,
    deleteInternship: deleteInternshipMutation.mutateAsync,
    isCreating: createInternshipMutation.isPending,
    isUpdating: updateInternshipMutation.isPending,
    isDeleting: deleteInternshipMutation.isPending
  };
};
