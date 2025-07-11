
import { logger } from './logger';

export const handleError = (error: unknown, toast?: any) => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  logger.error('Handled error', error, {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });

  if (toast) {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });
  }

  return errorMessage;
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  toast?: any,
  fallbackValue?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    handleError(error, toast);
    return fallbackValue;
  }
};
