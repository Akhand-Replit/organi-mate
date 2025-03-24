
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  // TEMPORARY: Authentication check is disabled, allowing all access
  return <>{children}</>;

  // Original authentication logic, commented out for now:
  /*
  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length > 0 && user.role && !allowedRoles.includes(user.role)) {
    // User doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
  */
};

export default ProtectedRoute;
