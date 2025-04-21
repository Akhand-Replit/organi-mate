
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/auth';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login
        navigate('/login');
        return;
      }

      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin/settings');
          break;
        case 'company':
          navigate('/company/dashboard');
          break;
        case 'branch_manager':
          navigate('/branch/settings');
          break;
        case 'assistant_manager':
          navigate('/assistant/profile');
          break;
        case 'employee':
          navigate('/employee/profile');
          break;
        case 'job_seeker':
          navigate('/jobseeker/profile');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, loading, navigate]);

  // Show loading while redirection happens
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Profile;
