
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, ClipboardList, MessageSquare } from 'lucide-react';
import BranchLayout from '@/components/layout/BranchLayout';

const BranchDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <BranchLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, Branch Manager</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your branch</p>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Employees" 
            value="8" 
            description="In your branch" 
            icon={<Users className="h-6 w-6 text-blue-500" />} 
          />
          <StatsCard 
            title="Tasks" 
            value="12" 
            description="Active tasks" 
            icon={<CheckSquare className="h-6 w-6 text-green-500" />} 
          />
          <StatsCard 
            title="Reports" 
            value="45" 
            description="Submitted this month" 
            icon={<ClipboardList className="h-6 w-6 text-purple-500" />} 
          />
          <StatsCard 
            title="Messages" 
            value="7" 
            description="Unread messages" 
            icon={<MessageSquare className="h-6 w-6 text-orange-500" />} 
          />
        </div>
        
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>Task completion rates this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">General Employee</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">Assistant Manager</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mike Johnson</p>
                    <p className="text-sm text-muted-foreground">General Employee</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Monthly Report</p>
                    <p className="text-sm text-muted-foreground">Due in 3 days</p>
                    <p className="text-xs text-muted-foreground">Assigned to you</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Employee Evaluations</p>
                    <p className="text-sm text-muted-foreground">Due in 1 week</p>
                    <p className="text-xs text-muted-foreground">Assigned to you</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CheckSquare className="h-5 w-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Inventory Check</p>
                    <p className="text-sm text-muted-foreground">Due tomorrow</p>
                    <p className="text-xs text-muted-foreground">Assigned to Jane Smith</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BranchLayout>
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

export default BranchDashboard;
