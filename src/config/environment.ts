
// Environment configuration with validation
interface EnvironmentConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  NODE_ENV: 'development' | 'production' | 'test';
  APP_URL: string;
  ENABLE_LOGGING: boolean;
  ENABLE_ANALYTICS: boolean;
  MAX_FILE_SIZE: number;
  SUPPORTED_FILE_TYPES: string[];
}

const getEnvironmentConfig = (): EnvironmentConfig => {
  // Validate required environment variables
  const requiredVars = {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || "https://zwzqedkkvdjlwzqmvdsd.supabase.co",
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3enFlZGtrdmRqbHd6cW12ZHNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTM3NDQsImV4cCI6MjA2NjI2OTc0NH0.gs2qTWfs2sxXAWMtWagbpSHqL4_yc-SJh-aDfrUGOoI"
  };

  // Check for missing required variables
  const missingVars = Object.entries(requiredVars).filter(([key, value]) => !value);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.map(([key]) => key).join(', ')}`);
  }

  return {
    SUPABASE_URL: requiredVars.SUPABASE_URL,
    SUPABASE_ANON_KEY: requiredVars.SUPABASE_ANON_KEY,
    NODE_ENV: (import.meta.env.MODE as any) || 'development',
    APP_URL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
    ENABLE_LOGGING: import.meta.env.MODE === 'development',
    ENABLE_ANALYTICS: import.meta.env.MODE === 'production',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FILE_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ]
  };
};

export const env = getEnvironmentConfig();

// Utility functions for environment checking
export const isDevelopment = () => env.NODE_ENV === 'development';
export const isProduction = () => env.NODE_ENV === 'production';
export const isTest = () => env.NODE_ENV === 'test';

// Feature flags based on environment
export const features = {
  enableDevTools: isDevelopment(),
  enableAnalytics: isProduction(),
  enableLogging: isDevelopment(),
  enableErrorReporting: isProduction(),
  enablePerformanceMonitoring: isProduction(),
  maxRetries: isProduction() ? 3 : 1,
  cacheTimeout: isProduction() ? 5 * 60 * 1000 : 1000, // 5 minutes in prod, 1 second in dev
};

export default env;
