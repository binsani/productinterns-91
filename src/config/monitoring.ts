import { features, isProduction } from './environment';
import { logger } from '@/utils/logger';

// Analytics configuration
export const analyticsConfig = {
  enabled: features.enableAnalytics,
  trackingId: isProduction() ? 'GA_MEASUREMENT_ID' : undefined,
  events: {
    pageView: 'page_view',
    userSignup: 'user_signup',
    jobApplication: 'job_application',
    profileUpdate: 'profile_update',
    searchPerformed: 'search_performed',
    errorOccurred: 'error_occurred'
  }
};

// Performance monitoring
export const performanceMonitoring = {
  // Core Web Vitals tracking
  trackWebVitals: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        logger.info('LCP recorded', { value: lastEntry.startTime });
        
        if (analyticsConfig.enabled) {
          analytics.track('web_vital', {
            name: 'LCP',
            value: lastEntry.startTime,
            rating: lastEntry.startTime > 2500 ? 'poor' : lastEntry.startTime > 1200 ? 'needs-improvement' : 'good'
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          logger.info('FID recorded', { value: entry.processingStart - entry.startTime });
          
          if (analyticsConfig.enabled) {
            analytics.track('web_vital', {
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              rating: (entry.processingStart - entry.startTime) > 100 ? 'poor' : (entry.processingStart - entry.startTime) > 50 ? 'needs-improvement' : 'good'
            });
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        logger.info('CLS recorded', { value: clsValue });
        
        if (analyticsConfig.enabled) {
          analytics.track('web_vital', {
            name: 'CLS',
            value: clsValue,
            rating: clsValue > 0.25 ? 'poor' : clsValue > 0.1 ? 'needs-improvement' : 'good'
          });
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Resource loading performance
  trackResourceLoading: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const resources = performance.getEntriesByType('resource');

          logger.info('Performance metrics', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalResources: resources.length,
            slowResources: resources.filter(r => r.duration > 1000).length
          });
        }, 0);
      });
    }
  }
};

// Error monitoring
export const errorMonitoring = {
  // Global error handler
  setupGlobalErrorHandling: () => {
    if (typeof window !== 'undefined') {
      // Catch JavaScript errors
      window.addEventListener('error', (event) => {
        logger.error('Global JavaScript error', event.error, {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          message: event.message
        });

        if (analyticsConfig.enabled) {
          analytics.track(analyticsConfig.events.errorOccurred, {
            type: 'javascript',
            message: event.message,
            filename: event.filename,
            line: event.lineno
          });
        }
      });

      // Catch unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', event.reason);

        if (analyticsConfig.enabled) {
          analytics.track(analyticsConfig.events.errorOccurred, {
            type: 'promise_rejection',
            reason: String(event.reason)
          });
        }
      });

      // Catch network errors
      window.addEventListener('offline', () => {
        logger.warn('Application went offline');
      });

      window.addEventListener('online', () => {
        logger.info('Application came back online');
      });
    }
  }
};

// Analytics implementation
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (!analyticsConfig.enabled) return;

    logger.info('Analytics event', { event, properties });

    // In production, this would send to your analytics service
    if (isProduction()) {
      // Example: Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event, properties);
      }

      // Example: Custom analytics endpoint
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, properties, timestamp: Date.now() })
      }).catch(err => logger.error('Failed to send analytics', err));
    }
  },

  identify: (userId: string, traits?: Record<string, any>) => {
    if (!analyticsConfig.enabled) return;

    logger.info('User identified', { userId, traits });

    if (isProduction() && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', analyticsConfig.trackingId, {
        user_id: userId,
        custom_map: traits
      });
    }
  },

  page: (name: string, properties?: Record<string, any>) => {
    if (!analyticsConfig.enabled) return;

    analytics.track(analyticsConfig.events.pageView, {
      page: name,
      ...properties
    });
  }
};

// Initialize monitoring
export const initializeMonitoring = () => {
  if (typeof window !== 'undefined') {
    errorMonitoring.setupGlobalErrorHandling();
    performanceMonitoring.trackWebVitals();
    performanceMonitoring.trackResourceLoading();
    
    logger.info('Monitoring initialized', {
      analytics: analyticsConfig.enabled,
      environment: isProduction() ? 'production' : 'development'
    });
  }
};