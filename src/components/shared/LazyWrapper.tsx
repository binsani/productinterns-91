import { Suspense, ComponentType, lazy } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorBoundary } from './ErrorBoundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

// Enhanced lazy wrapper with error boundary
export const LazyWrapper = ({ 
  children, 
  fallback = <LoadingSpinner size="lg" text="Loading..." />,
  errorFallback
}: LazyWrapperProps) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  loadingComponent?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyWrapper fallback={loadingComponent}>
      <LazyComponent {...(props as any)} />
    </LazyWrapper>
  );
};

// Utility for creating lazy route components
export const createLazyRoute = (
  importFn: () => Promise<{ default: ComponentType<any> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFn);
  
  return () => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent />
    </LazyWrapper>
  );
};