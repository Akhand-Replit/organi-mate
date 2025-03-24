
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, ClipboardList, MessageSquare, AlertCircle } from 'lucide-react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <EmployeeLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, Employee</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your tasks and reports</p>
        
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard 
            title="Tasks" 
            value="5" 
            description="Assigned to you" 
            icon={<CheckSquare className="h-6 w-6 text-blue-500" />} 
          />
          <StatsCard 
            title="Reports" 
            value="22" 
            description="Submitted this month" 
            icon={<ClipboardList className="h-6 w-6 text-green-500" />} 
          />
          <StatsCard 
            title="Messages" 
            value="3" 
            description="Unread messages" 
            icon={<MessageSquare className="h-6 w-6 text-purple-500" />} 
          />
        </div>
        
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Daily Activity Report</p>
                    <p className="text-sm text-muted-foreground">Due today at 5:00 PM</p>
                    <p className="mt-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full w-fit">High Priority</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Client Follow-up</p>
                    <p className="text-sm text-muted-foreground">Due today at 3:30 PM</p>
                    <p className="mt-1 text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full w-fit">Medium Priority</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckSquare className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Team Meeting</p>
                    <p className="text-sm text-muted-foreground">Today at 11:00 AM</p>
                    <p className="mt-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full w-fit">Low Priority</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your recent activity reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Daily Report</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Daily Report</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardList className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium">Weekly Summary</p>
                      <p className="text-xs text-muted-foreground">Last week</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
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

export default EmployeeDashboard;
