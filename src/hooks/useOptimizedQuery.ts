
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { handleError } from '@/utils/errorHandler';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<T>;
  enableErrorHandling?: boolean;
  retryOnError?: boolean;
}

export const useOptimizedQuery = <T>({
  queryKey,
  queryFn,
  enableErrorHandling = true,
  retryOnError = true,
  ...options
}: OptimizedQueryOptions<T>) => {
  const { toast } = useToast();
  const [errorCount, setErrorCount] = useState(0);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await queryFn();
        setErrorCount(0); // Reset error count on success
        return result;
      } catch (error) {
        setErrorCount(prev => prev + 1);
        
        if (enableErrorHandling) {
          handleError(error, toast);
        }
        
        throw error;
      }
    },
    retry: retryOnError ? (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3 && errorCount < 5) {
        return true;
      }
      return false;
    } : false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: false,
    ...options
  });

  // Performance monitoring
  useEffect(() => {
    if (query.isError && errorCount > 3) {
      logger.warn('High error count for query', { 
        queryKey, 
        errorCount,
        error: query.error 
      });
    }
  }, [query.isError, errorCount, queryKey, query.error]);

  return {
    ...query,
    errorCount
  };
};
