
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
  Settings,
  UserPlus,
  User
} from 'lucide-react';

const AssistantLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/assistant/dashboard' },
    { icon: Users, label: 'Employees', path: '/assistant/employees' },
    { icon: UserPlus, label: 'Create Employee', path: '/assistant/create-employee' },
    { icon: CheckSquare, label: 'Tasks', path: '/assistant/tasks' },
    { icon: FileText, label: 'Reports', path: '/assistant/reports' },
    { icon: MessageSquare, label: 'Messages', path: '/assistant/messages' },
    { icon: User, label: 'Profile', path: '/assistant/profile' },
  ];
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold px-2 mb-3">Assistant Manager</h2>
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

export default AssistantLayout;
