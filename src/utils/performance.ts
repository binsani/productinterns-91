// Performance monitoring utilities
export const performance = {
  // Mark performance events
  mark: (name: string) => {
    if ('performance' in window && 'mark' in window.performance) {
      window.performance.mark(name);
    }
  },

  // Measure time between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if ('performance' in window && 'measure' in window.performance) {
      try {
        if (endMark) {
          window.performance.measure(name, startMark, endMark);
        } else {
          window.performance.measure(name, startMark);
        }
        
        const measures = window.performance.getEntriesByName(name, 'measure');
        const latestMeasure = measures[measures.length - 1];
        return latestMeasure?.duration || 0;
      } catch (error) {
        console.warn('Performance measurement failed:', error);
        return 0;
      }
    }
    return 0;
  },

  // Get web vitals
  getWebVitals: () => {
    if (!('performance' in window)) return null;

    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    return {
      // First Contentful Paint
      fcp: navigation.responseStart - navigation.fetchStart,
      
      // Largest Contentful Paint (approximation)
      lcp: navigation.loadEventEnd - navigation.fetchStart,
      
      // Time to Interactive (approximation)
      tti: navigation.domInteractive - navigation.fetchStart,
      
      // First Input Delay (needs to be measured with real interactions)
      fid: 0,
      
      // Cumulative Layout Shift (needs to be measured with layout shift events)
      cls: 0
    };
  },

  // Resource loading optimization
  prefetchResource: (url: string, type: 'script' | 'style' | 'image' | 'fetch' = 'fetch') => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (type !== 'fetch') {
      link.as = type;
    }
    document.head.appendChild(link);
  },

  // Preload critical resources
  preloadResource: (url: string, type: 'script' | 'style' | 'image' | 'font', crossorigin?: boolean) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    if (crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if ('memory' in window.performance) {
      const memory = (window.performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }
};