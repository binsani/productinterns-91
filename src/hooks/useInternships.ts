
import { useQuery } from '@tanstack/react-query';
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
