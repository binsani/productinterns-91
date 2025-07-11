
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'intern' | 'employer' | 'admin';
  redirectTo?: string;
}

export const AuthGuard = ({ 
  children, 
  requiredRole, 
  redirectTo = '/auth' 
}: AuthGuardProps) => {
  const { user, profile, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate(redirectTo);
      return;
    }

    if (!isLoading && user && requiredRole && profile?.role !== requiredRole) {
      navigate('/unauthorized');
      return;
    }
  }, [user, profile, isLoading, requiredRole, navigate, redirectTo]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
