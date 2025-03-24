
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Home,
  Building2,
  Users,
  CheckSquare,
  FileText,
  MessageSquare,
  Settings,
  Briefcase,
  UserPlus
} from 'lucide-react';

const CompanyLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/company/dashboard' },
    { icon: Building2, label: 'Branches', path: '/company/branches' },
    { icon: Users, label: 'Employees', path: '/company/employees' },
    { icon: UserPlus, label: 'Create Employee', path: '/company/create-employee' },
    { icon: CheckSquare, label: 'Tasks', path: '/company/tasks' },
    { icon: FileText, label: 'Reports', path: '/company/reports' },
    { icon: Briefcase, label: 'Job Board', path: '/company/jobs' },
    { icon: MessageSquare, label: 'Messages', path: '/company/messages' },
    { icon: Settings, label: 'Settings', path: '/company/settings' },
  ];
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold px-2 mb-3">Company Management</h2>
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

export default CompanyLayout;
