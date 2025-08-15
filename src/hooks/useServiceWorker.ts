import { useEffect, useState } from 'react';
import { logger } from '@/utils/logger';
import { useToast } from './use-toast';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
}

export const useServiceWorker = () => {
  const { toast } = useToast();
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    isOffline: !navigator.onLine,
  });

  useEffect(() => {
    if (!state.isSupported) {
      logger.warn('Service Workers not supported');
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({ ...prev, isRegistered: true }));
        logger.info('Service Worker registered successfully');

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, isUpdateAvailable: true }));
              
              toast({
                title: 'Update Available',
                description: 'A new version of the app is available. Refresh to update.',
              });
            }
          });
        });

        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'CACHE_UPDATED') {
            logger.info('App cache updated');
          }
        });

      } catch (error) {
        logger.error('Service Worker registration failed', error);
      }
    };

    // Online/offline status
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOffline: false }));
      toast({
        title: 'Back Online',
        description: 'Your internet connection has been restored.',
      });
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOffline: true }));
      toast({
        title: 'You\'re Offline',
        description: 'Some features may be limited while offline.',
        variant: 'destructive'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.isSupported, toast]);

  const updateServiceWorker = async () => {
    if (!state.isSupported || !state.isUpdateAvailable) return;

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    } catch (error) {
      logger.error('Failed to update service worker', error);
    }
  };

  return {
    ...state,
    updateServiceWorker,
  };
};