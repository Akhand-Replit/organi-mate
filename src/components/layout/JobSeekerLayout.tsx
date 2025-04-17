
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Home,
  Briefcase,
  ClipboardList,
  MessageSquare,
  User
} from 'lucide-react';

const JobSeekerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/jobseeker/dashboard' },
    { icon: Briefcase, label: 'Browse Jobs', path: '/jobseeker/jobs' },
    { icon: ClipboardList, label: 'My Applications', path: '/jobseeker/applications' },
    { icon: MessageSquare, label: 'Messages', path: '/jobseeker/messages' },
    { icon: User, label: 'Profile', path: '/jobseeker/profile' },
  ];
  
  const sidebarContent = (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold px-2 mb-3">Job Seeker</h2>
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

export default JobSeekerLayout;
