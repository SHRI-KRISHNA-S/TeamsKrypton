import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AccessDenied } from '../components/AccessDenied';

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
  const { currentRole } = useApp();
  if (allowedRoles.includes(currentRole)) {
    return element;
  }
  return <AccessDenied />;
};
