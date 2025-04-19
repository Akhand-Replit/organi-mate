
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BranchLayout from '@/components/layout/BranchLayout';
import { Loader2 } from 'lucide-react';

const BranchDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }
  
  // Check if user has branch_manager role
  const isBranchManager = user?.role === 'branch_manager';
  
  if (!isBranchManager) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to="/company/dashboard" replace />;
  }
  
  // Implement actual branch dashboard here when needed
  // For now, we redirect to company dashboard
  return <Navigate to="/company/dashboard" replace />;
};

export default BranchDashboard;
