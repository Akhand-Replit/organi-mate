
import React from 'react';
import { Navigate } from 'react-router-dom';

const BranchDashboard: React.FC = () => {
  // Redirect to company dashboard
  return <Navigate to="/company/dashboard" replace />;
};

export default BranchDashboard;
