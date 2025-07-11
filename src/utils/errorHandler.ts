
import { useToast } from '@/hooks/use-toast';

export type ErrorType = 'network' | 'validation' | 'auth' | 'permission' | 'unknown';

interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

export const createAppError = (type: ErrorType, message: string, details?: any): AppError => ({
  type,
  message,
  details,
  timestamp: new Date()
});

export const handleError = (error: any, toast?: ReturnType<typeof useToast>['toast']) => {
  let appError: AppError;

  // Handle Supabase errors
  if (error?.code) {
    switch (error.code) {
      case 'PGRST301':
        appError = createAppError('auth', 'Authentication required', error);
        break;
      case 'PGRST116':
        appError = createAppError('permission', 'Access denied', error);
        break;
      case '23505':
        appError = createAppError('validation', 'Duplicate entry', error);
        break;
      case '23503':
        appError = createAppError('validation', 'Invalid reference', error);
        break;
      default:
        appError = createAppError('unknown', error.message || 'An error occurred', error);
    }
  } else if (error?.message) {
    appError = createAppError('unknown', error.message, error);
  } else {
    appError = createAppError('unknown', 'An unexpected error occurred', error);
  }

  // Log error for monitoring
  console.error('Application Error:', {
    type: appError.type,
    message: appError.message,
    details: appError.details,
    timestamp: appError.timestamp,
    stack: error?.stack
  });

  // Show user-friendly error message
  if (toast) {
    const userMessages = {
      network: 'Connection error. Please check your internet connection.',
      validation: 'Invalid input. Please check your data and try again.',
      auth: 'Please sign in to continue.',
      permission: 'You don\'t have permission to perform this action.',
      unknown: 'Something went wrong. Please try again.'
    };

    toast({
      title: 'Error',
      description: userMessages[appError.type] || appError.message,
      variant: 'destructive'
    });
  }

  return appError;
};

export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  toast?: ReturnType<typeof useToast>['toast']
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, toast);
      throw error;
    }
  }) as T;
};
