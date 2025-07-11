
import { supabase } from '@/integrations/supabase/client';

export const queryOptimizer = {
  // Paginated queries with optimized select
  paginatedInternships: async (page: number = 1, limit: number = 10, filters?: any) => {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('internships')
      .select(`
        id,
        title,
        description,
        location,
        is_remote,
        stipend_amount,
        stipend_currency,
        application_deadline,
        start_date,
        duration,
        skills_required,
        benefits,
        status,
        created_at,
        company_id,
        companies!inner(
          name,
          logo_url,
          industry
        )
      `)
      .eq('status', 'active')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.skills) {
      query = query.contains('skills_required', filters.skills);
    }
    if (filters?.isRemote !== undefined) {
      query = query.eq('is_remote', filters.isRemote);
    }

    return query;
  },

  // Optimized applications query
  userApplications: async (userId: string, page: number = 1, limit: number = 10) => {
    const offset = (page - 1) * limit;
    
    return supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        reviewed_at,
        cover_letter,
        internships!inner(
          id,
          title,
          location,
          companies!inner(
            name,
            logo_url
          )
        )
      `)
      .eq('intern_id', userId)
      .range(offset, offset + limit - 1)
      .order('applied_at', { ascending: false });
  },

  // Count queries for pagination
  countInternships: async (filters?: any) => {
    let query = supabase
      .from('internships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters?.skills) {
      query = query.contains('skills_required', filters.skills);
    }
    if (filters?.isRemote !== undefined) {
      query = query.eq('is_remote', filters.isRemote);
    }

    return query;
  },

  // Batch operations
  batchUpdateApplications: async (applicationIds: string[], updates: any) => {
    return supabase
      .from('applications')
      .update(updates)
      .in('id', applicationIds);
  }
};
