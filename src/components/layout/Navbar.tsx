
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const getLinkClasses = (path: string) => {
    return `block py-2 px-4 rounded hover:bg-secondary transition-colors ${location.pathname === path ? 'font-semibold' : ''}`;
  };

  const renderNavItems = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className={getLinkClasses('/login')}>
            Login
          </Link>
          <Link to="/register" className={getLinkClasses('/register')}>
            Register
          </Link>
        </>
      );
    }

    // For authenticated users
    switch (user.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard" className={getLinkClasses('/admin/dashboard')}>
              Dashboard
            </Link>
            <Link to="/admin/companies" className={getLinkClasses('/admin/companies')}>
              Companies
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      case 'company':
        return (
          <>
            <Link to="/company/dashboard" className={getLinkClasses('/company/dashboard')}>
              Dashboard
            </Link>
            <Link to="/company/employees" className={getLinkClasses('/company/employees')}>
              Employees
            </Link>
            <Link to="/company/branches" className={getLinkClasses('/company/branches')}>
              Branches
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      case 'branch_manager':
        return (
          <>
            <Link to="/company/dashboard" className={getLinkClasses('/company/dashboard')}>
              Dashboard
            </Link>
            <Link to="/company/employees" className={getLinkClasses('/company/employees')}>
              Employees
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      case 'assistant_manager':
        return (
          <>
            <Link to="/company/dashboard" className={getLinkClasses('/company/dashboard')}>
              Dashboard
            </Link>
            <Link to="/company/employees" className={getLinkClasses('/company/employees')}>
              Employees
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      case 'employee':
        return (
          <>
            <Link to="/employee/dashboard" className={getLinkClasses('/employee/dashboard')}>
              Dashboard
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      case 'job_seeker':
        return (
          <>
            <Link to="/jobs" className={getLinkClasses('/jobs')}>
              Find Jobs
            </Link>
            <Link to="/messages" className={getLinkClasses('/messages')}>
              Messages
            </Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="container max-w-screen-xl mx-auto py-4 px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          JobTrack
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {renderNavItems()}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile navigation (Hamburger menu) */}
        <div className="md:hidden">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                {renderNavItems()}
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && (
            <Link to="/login" className={getLinkClasses('/login')}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
