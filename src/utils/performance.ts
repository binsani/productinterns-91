
import { useState, useEffect, useCallback } from 'react';

// Debounce hook for search inputs
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const [shouldWait, setShouldWait] = useState(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (shouldWait) return;

      callback(...args);
      setShouldWait(true);
      setTimeout(() => setShouldWait(false), delay);
    },
    [callback, delay, shouldWait]
  ) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isIntersecting;
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure component render time
  measureRender: (componentName: string) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (duration > 16) { // Warn if render takes longer than 16ms
        console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    };
  },

  // Measure async operation time
  measureAsync: async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const start = performance.now();
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`${operationName} took ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  },

  // Report Web Vitals
  reportWebVitals: (metric: any) => {
    console.log('Web Vital:', metric);
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics service
      // analytics.track('web_vital', metric);
    }
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  },

  logMemoryUsage: (context: string) => {
    const usage = memoryMonitor.checkMemoryUsage();
    if (usage) {
      console.log(`Memory usage in ${context}:`, usage);
      
      // Warn if memory usage is high
      if (usage.used / usage.limit > 0.8) {
        console.warn('High memory usage detected!');
      }
    }
  }
};
