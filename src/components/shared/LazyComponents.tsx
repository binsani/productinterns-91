
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
export const LazyInternDashboard = lazy(() => import('@/components/dashboards/InternDashboard'));
export const LazyEmployerDashboard = lazy(() => import('@/components/dashboards/EmployerDashboard'));
export const LazyAdminDashboard = lazy(() => import('@/components/dashboards/AdminDashboard'));
export const LazyApplicationReview = lazy(() => import('@/components/employer/ApplicationReview'));
export const LazyInternshipBrowser = lazy(() => import('@/components/intern/InternshipBrowser'));
export const LazyResumeBuilder = lazy(() => import('@/components/intern/ResumeBuilder'));
export const LazyMessagingSystem = lazy(() => import('@/components/shared/MessagingSystem'));

// Loading fallback component
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  </div>
);

// Wrapper component for lazy loaded components
export const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);
