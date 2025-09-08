import { useCallback } from 'react';
import { isProduction } from '@/config/environment';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const useAnalytics = () => {
  const track = useCallback((event: AnalyticsEvent) => {
    if (!isProduction()) {
      console.log('Analytics Event:', event);
      return;
    }

    // Google Analytics 4 tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.custom_parameters
      });
    }

    // Custom analytics endpoint (if needed)
    if (typeof window !== 'undefined' && window.customAnalytics) {
      window.customAnalytics.track(event);
    }
  }, []);

  const trackPageView = useCallback((page_path: string, page_title?: string) => {
    if (!isProduction()) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path,
        page_title: page_title || document.title
      });
    }
  }, []);

  const trackUser = useCallback((user_id: string, user_properties?: Record<string, any>) => {
    if (!isProduction()) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        user_id,
        custom_map: user_properties
      });
    }
  }, []);

  const trackConversion = useCallback((conversion_name: string, value?: number, currency = 'USD') => {
    if (!isProduction()) return;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `AW-CONVERSION_ID/${conversion_name}`,
        value,
        currency
      });
    }
  }, []);

  return {
    track,
    trackPageView,
    trackUser,
    trackConversion
  };
};

// Predefined events for common actions
export const AnalyticsEvents = {
  USER_SIGNUP: { action: 'sign_up', category: 'engagement' },
  USER_LOGIN: { action: 'login', category: 'engagement' },
  APPLICATION_SUBMIT: { action: 'application_submit', category: 'conversion' },
  JOB_VIEW: { action: 'job_view', category: 'engagement' },
  PROFILE_COMPLETE: { action: 'profile_complete', category: 'conversion' },
  SEARCH_PERFORMED: { action: 'search', category: 'engagement' },
  MESSAGE_SENT: { action: 'message_sent', category: 'engagement' }
};