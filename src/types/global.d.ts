// Global type definitions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    customAnalytics?: {
      track: (event: any) => void;
    };
  }
  
  const gtag: (...args: any[]) => void;
}

export {};