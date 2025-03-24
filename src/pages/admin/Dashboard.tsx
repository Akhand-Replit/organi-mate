
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Briefcase, CheckSquare } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, Admin</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of the platform</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Companies" 
            value="12" 
            description="Total registered companies" 
            icon={<Building2 className="h-6 w-6 text-blue-500" />} 
          />
          <StatsCard 
            title="Branches" 
            value="54" 
            description="Across all companies" 
            icon={<Building2 className="h-6 w-6 text-green-500" />} 
          />
          <StatsCard 
            title="Employees" 
            value="246" 
            description="Total registered employees" 
            icon={<Users className="h-6 w-6 text-purple-500" />} 
          />
          <StatsCard 
            title="Job Listings" 
            value="28" 
            description="Active job postings" 
            icon={<Briefcase className="h-6 w-6 text-orange-500" />} 
          />
        </div>
        
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Companies</CardTitle>
              <CardDescription>Newly registered companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Acme Corp</p>
                    <p className="text-sm text-muted-foreground">Registered 2 days ago</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">TechStart Inc</p>
                    <p className="text-sm text-muted-foreground">Registered 4 days ago</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Global Services Ltd</p>
                    <p className="text-sm text-muted-foreground">Registered 1 week ago</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Company Registration</p>
                    <p className="text-sm text-muted-foreground">2 pending registrations</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Subscription Upgrades</p>
                    <p className="text-sm text-muted-foreground">4 pending requests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-amber-500 mr-3" />
                  <div>
                    <p className="font-medium">Support Messages</p>
                    <p className="text-sm text-muted-foreground">7 unread messages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
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

export default AdminDashboard;
