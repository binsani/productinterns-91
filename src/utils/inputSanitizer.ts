
import DOMPurify from 'dompurify';

export const sanitizeInput = {
  // Sanitize HTML content
  html: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target'],
    });
  },

  // Sanitize plain text (remove HTML tags entirely)
  text: (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  },

  // Sanitize and validate email
  email: (input: string): string => {
    const sanitized = DOMPurify.sanitize(input.trim().toLowerCase(), { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Invalid email format');
    }
    
    return sanitized;
  },

  // Sanitize URLs
  url: (input: string): string => {
    const sanitized = DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    
    try {
      const url = new URL(sanitized);
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid URL protocol');
      }
      return url.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  },

  // Sanitize and limit text length
  limitedText: (input: string, maxLength: number): string => {
    const sanitized = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return sanitized.slice(0, maxLength);
  },

  // Sanitize arrays (for skills, requirements, etc.)
  array: (input: string[]): string[] => {
    return input
      .map(item => DOMPurify.sanitize(item, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }))
      .filter(item => item.trim().length > 0)
      .slice(0, 20); // Limit array size
  }
};
