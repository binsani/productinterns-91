
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { logger } from '@/utils/logger';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({ 
  children, 
  requiredRole, 
  allowedRoles, 
  fallback,
  redirectTo = '/unauthorized'
}: RoleGuardProps) => {
  const { user, profile, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    logger.warn('RoleGuard: User not authenticated', { 
      requiredRole,
      allowedRoles,
      path: window.location.pathname 
    });
    return <Navigate to="/auth" replace />;
  }

  // Check specific role requirement
  if (requiredRole && profile.role !== requiredRole) {
    logger.warn('RoleGuard: Insufficient permissions', { 
      userRole: profile.role,
      requiredRole,
      userId: user.id 
    });
    return fallback ? <>{fallback}</> : <Navigate to={redirectTo} replace />;
  }

  // Check allowed roles
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    logger.warn('RoleGuard: Role not in allowed list', { 
      userRole: profile.role,
      allowedRoles,
      userId: user.id 
    });
    return fallback ? <>{fallback}</> : <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
