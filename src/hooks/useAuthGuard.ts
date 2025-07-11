
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { logger } from '@/utils/logger';

interface UseAuthGuardOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  allowedRoles?: UserRole[];
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { user, profile, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { requiredRole, redirectTo = '/', allowedRoles } = options;

  useEffect(() => {
    if (isLoading) return;

    if (!user || !profile) {
      logger.warn('Unauthorized access attempt', { 
        path: window.location.pathname,
        requiredRole,
        allowedRoles 
      });
      navigate('/auth', { replace: true });
      return;
    }

    // Check specific role requirement
    if (requiredRole && profile.role !== requiredRole) {
      logger.warn('Insufficient permissions', { 
        userRole: profile.role,
        requiredRole,
        userId: user.id 
      });
      navigate('/unauthorized', { replace: true });
      return;
    }

    // Check allowed roles
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
      logger.warn('Role not allowed', { 
        userRole: profile.role,
        allowedRoles,
        userId: user.id 
      });
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [user, profile, isLoading, requiredRole, allowedRoles, navigate]);

  return {
    isAuthenticated: !!user && !!profile,
    isAuthorized: !requiredRole || profile?.role === requiredRole,
    user,
    profile,
    isLoading
  };
};
