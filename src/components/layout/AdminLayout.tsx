
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Home,
  Building2,
  Users,
  FileText,
  MessageSquare,
  Settings,
  CreditCard,
  Briefcase
} from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Building2, label: 'Companies', path: '/admin/companies' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Briefcase, label: 'Job Board', path: '/admin/jobs' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold px-2 mb-3">Admin Panel</h2>
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

export default AdminLayout;
