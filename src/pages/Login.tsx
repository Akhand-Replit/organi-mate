
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [userType, setUserType] = useState<string>('job_seeker');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const redirectBasedOnRole = (role) => {
    const roleRedirects = {
      admin: '/admin/dashboard',
      company: '/company/dashboard',
      branch_manager: '/branch/dashboard',
      assistant_manager: '/branch/dashboard',
      employee: '/employee/dashboard',
      job_seeker: '/dashboard'
    };

    const redirectPath = roleRedirects[role] || '/dashboard';
    navigate(redirectPath, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Auth state change is handled by AuthProvider
      toast({
        title: "Login successful",
        description: "You have been logged in to your account.",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center p-4 py-32">
        <div className="w-full max-w-md animate-fade-in">
          <Tabs defaultValue={userType} onValueChange={setUserType}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="job_seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="job_seeker">
              <LoginCard 
                title="Job Seeker Login"
                description="Access your job applications and profile."
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                userType="job_seeker"
                showRegisterLink={true}
              />
            </TabsContent>
            
            <TabsContent value="company">
              <LoginCard 
                title="Company Login"
                description="Access your company dashboard to manage branches, employees, and more."
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                userType="company"
                showRegisterLink={false}
                applicationLink="/company-application"
              />
            </TabsContent>
            
            <TabsContent value="admin">
              <LoginCard 
                title="Admin Login"
                description="Access the system administration dashboard."
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                isLoading={isLoading}
                handleSubmit={handleSubmit}
                userType="admin"
                showRegisterLink={false}
                staticUsername="admin"
                staticPassword="ADMINPASSWORD"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface LoginCardProps {
  title: string;
  description: string;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  userType: string;
  showRegisterLink?: boolean;
  applicationLink?: string;
  staticUsername?: string;
  staticPassword?: string;
}

const LoginCard: React.FC<LoginCardProps> = ({
  title,
  description,
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  handleSubmit,
  userType,
  showRegisterLink = false,
  applicationLink,
  staticUsername,
  staticPassword
}) => {
  // Set static credentials if provided
  useEffect(() => {
    if (staticUsername) {
      setEmail(staticUsername);
    }
  }, [staticUsername, setEmail]);

  const placeholderText = staticUsername
    ? `Use "${staticUsername}" as username`
    : 'Enter your email or username';
  
  const helpText = staticUsername && staticPassword
    ? `Use "${staticUsername}" as username and "${staticPassword}" as password` 
    : '';

  return (
    <Card className="glass-card border border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${userType}-email`}>Email or Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id={`${userType}-email`}
                placeholder={placeholderText}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                readOnly={!!staticUsername}
              />
            </div>
            {helpText && (
              <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`${userType}-password`}>Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id={`${userType}-password`}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
          {showRegisterLink && (
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary/80">
                Register now
              </Link>
            </div>
          )}
          {applicationLink && (
            <div className="text-sm text-center text-muted-foreground">
              Need a company account?{' '}
              <Link to={applicationLink} className="text-primary hover:text-primary/80">
                Apply here
              </Link>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default Login;
