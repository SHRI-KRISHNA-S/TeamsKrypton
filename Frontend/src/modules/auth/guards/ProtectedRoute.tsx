import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AccessDenied } from '../../common/components/AccessDenied';

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return null; // Prevent brief dashboard flashes during session restoring
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return element;
};
