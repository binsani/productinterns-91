import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isProduction } from '@/config/environment';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isProduction()) return;

    // Track page views
    const trackPageView = () => {
      // Update document title with route info
      const routeName = location.pathname === '/' ? 'Home' : 
        location.pathname.slice(1).replace(/\//g, ' - ');
      
      document.title = `${routeName} | InternshipConnect - Your Career Journey Starts Here`;

      // Send analytics event if analytics is available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname + location.search
        });
      }

      // Performance monitoring
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            console.log(`Page load time: ${loadTime}ms`);
          }
        }, 0);
      }
    };

    trackPageView();
  }, [location]);
};