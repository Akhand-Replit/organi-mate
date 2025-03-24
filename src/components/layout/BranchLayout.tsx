
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  Settings
} from 'lucide-react';

const BranchLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/branch/dashboard' },
    { icon: Users, label: 'Employees', path: '/branch/employees' },
    { icon: CheckSquare, label: 'Tasks', path: '/branch/tasks' },
    { icon: FileText, label: 'Reports', path: '/branch/reports' },
    { icon: MessageSquare, label: 'Messages', path: '/branch/messages' },
    { icon: Settings, label: 'Settings', path: '/branch/settings' },
  ];
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold px-2 mb-3">Branch Management</h2>
        {navItems.map((item) => (
          <Link to={item.path} key={item.path}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebarContent={sidebarContent}>
      {children}
    </DashboardLayout>
  );
};

export default BranchLayout;
