
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, ClipboardList, MessageSquare } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const BranchDashboard: React.FC = () => {
  // Since branch dashboard is no longer needed, redirect to company dashboard
  return <Navigate to="/company/dashboard" replace />;
};

export default BranchDashboard;
