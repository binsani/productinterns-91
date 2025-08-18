import { features } from './environment';

// Security configuration for production
export const securityConfig = {
  // Content Security Policy
  csp: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      // Only include unsafe-inline in development
      ...(import.meta.env.MODE === 'development' ? ["'unsafe-inline'"] : []),
      'https://zwzqedkkvdjlwzqmvdsd.supabase.co'
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:', 'blob:'],
    'font-src': ["'self'", 'https:', 'data:'],
    'connect-src': [
      "'self'",
      'https://zwzqedkkvdjlwzqmvdsd.supabase.co',
      'wss://zwzqedkkvdjlwzqmvdsd.supabase.co'
    ],
    'media-src': ["'self'", 'blob:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true
  },

  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Rate limiting configuration
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: features.enableDevTools ? 1000 : 100, // Higher limit in dev
    message: 'Too many requests from this IP, please try again later.'
  },

  // Input validation rules
  validation: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ],
    maxStringLength: 10000,
    maxArrayLength: 100
  }
};

// Generate CSP string
export const generateCSPString = (): string => {
  return Object.entries(securityConfig.csp)
    .map(([key, value]) => {
      if (key === 'upgrade-insecure-requests') {
        return value ? 'upgrade-insecure-requests' : '';
      }
      return `${key} ${Array.isArray(value) ? value.join(' ') : value}`;
    })
    .filter(Boolean)
    .join('; ');
};

// Security utility functions
export const securityUtils = {
  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .slice(0, securityConfig.validation.maxStringLength);
  },

  // Validate file upload
  validateFile: (file: File): { isValid: boolean; error?: string } => {
    if (file.size > securityConfig.validation.maxFileSize) {
      return { isValid: false, error: 'File size exceeds maximum allowed size' };
    }

    if (!securityConfig.validation.allowedFileTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' };
    }

    return { isValid: true };
  },

  // Generate secure headers for fetch requests
  getSecureHeaders: (): Record<string, string> => {
    return {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...securityConfig.headers
    };
  }
};