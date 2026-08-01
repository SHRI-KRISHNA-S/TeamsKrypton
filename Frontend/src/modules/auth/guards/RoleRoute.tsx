import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AccessDenied } from '../../common/components/AccessDenied';

interface RoleRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ element, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return element;
};
