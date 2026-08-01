import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { AccessDenied } from '../components/AccessDenied';

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
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
