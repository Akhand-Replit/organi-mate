
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, CheckSquare, MessageSquare, Briefcase } from 'lucide-react';
import CompanyLayout from '@/components/layout/CompanyLayout';

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <CompanyLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, Company</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your company</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Branches" 
            value="3" 
            description="Active branches" 
            icon={<Building2 className="h-6 w-6 text-blue-500" />} 
          />
          <StatsCard 
            title="Employees" 
            value="24" 
            description="Across all branches" 
            icon={<Users className="h-6 w-6 text-green-500" />} 
          />
          <StatsCard 
            title="Tasks" 
            value="18" 
            description="Active tasks" 
            icon={<CheckSquare className="h-6 w-6 text-purple-500" />} 
          />
          <StatsCard 
            title="Job Listings" 
            value="4" 
            description="Active job postings" 
            icon={<Briefcase className="h-6 w-6 text-orange-500" />} 
          />
        </div>
        
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in your company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <div>
                    <p className="font-medium">New employee added</p>
                    <p className="text-sm text-muted-foreground">John Doe joined Main Branch</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="font-medium">Task completed</p>
                    <p className="text-sm text-muted-foreground">Monthly report submission</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                  <div>
                    <p className="font-medium">New job posted</p>
                    <p className="text-sm text-muted-foreground">Senior Developer position</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Admin</p>
                    <p className="text-sm text-muted-foreground">Subscription update notification</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">East Branch Manager</p>
                    <p className="text-sm text-muted-foreground">Weekly report submitted</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">West Branch Manager</p>
                    <p className="text-sm text-muted-foreground">New employee request</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CompanyLayout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-background border rounded-md">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyDashboard;
