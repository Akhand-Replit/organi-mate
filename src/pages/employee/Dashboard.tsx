
import React, { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar,
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  BarChart3,
  Loader2
} from 'lucide-react';

interface TaskSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

interface ReportSummary {
  total: number;
  submitted: number;
  pending: number;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [taskSummary, setTaskSummary] = useState<TaskSummary>({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });
  const [reportSummary, setReportSummary] = useState<ReportSummary>({
    total: 0,
    submitted: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (user) {
          // Will be implemented when tasks table is created
          // For now, using placeholder data
          setTaskSummary({
            total: 12,
            completed: 5,
            pending: 6,
            overdue: 1
          });
          
          setReportSummary({
            total: 8,
            submitted: 6,
            pending: 2
          });
          
          setUpcomingTasks([
            { id: 1, title: 'Complete inventory check', due_date: '2025-04-10', priority: 'high' },
            { id: 2, title: 'Train new hire', due_date: '2025-04-12', priority: 'medium' },
            { id: 3, title: 'Submit weekly report', due_date: '2025-04-08', priority: 'high' }
          ]);
          
          setRecentReports([
            { id: 1, title: 'March Sales Report', submitted_date: '2025-03-31', status: 'approved' },
            { id: 2, title: 'Q1 Performance Review', submitted_date: '2025-04-02', status: 'pending' }
          ]);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error loading dashboard',
          description: error.message || 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  // Employee profile data
  const [profile, setProfile] = useState<any>(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  useEffect(() => {
    const getEmployeeProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            companies:company_id(*),
            branches:branch_id(*)
          `)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        console.error('Error fetching employee profile:', error);
      } finally {
        setFetchingProfile(false);
      }
    };

    getEmployeeProfile();
  }, [user]);

  if (loading || fetchingProfile) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome{profile ? `, ${profile.name}` : ''}
          </h1>
          {profile && (
            <p className="text-muted-foreground">
              {profile.companies?.name} 
              {profile.branches ? ` - ${profile.branches.name} Branch` : ''}
              {' | '}
              {profile.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </p>
          )}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskSummary.total}</div>
                  <p className="text-xs text-muted-foreground">
                    Assigned tasks for the current month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskSummary.completed}</div>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed on time
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskSummary.pending}</div>
                  <p className="text-xs text-muted-foreground">
                    Tasks awaiting completion
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskSummary.overdue}</div>
                  <p className="text-xs text-muted-foreground">
                    Tasks past their due date
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingTasks.map(task => (
                        <div key={task.id} className="flex items-start space-x-4">
                          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                            task.priority === 'high' ? 'bg-red-100' : 
                            task.priority === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                          }`}>
                            <Calendar className={`h-4 w-4 ${
                              task.priority === 'high' ? 'text-red-600' : 
                              task.priority === 'medium' ? 'text-amber-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium leading-none">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground">No upcoming tasks</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReports.length > 0 ? (
                    <div className="space-y-4">
                      {recentReports.map(report => (
                        <div key={report.id} className="flex items-start space-x-4">
                          <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                            report.status === 'approved' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <FileText className={`h-4 w-4 ${
                              report.status === 'approved' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium leading-none">{report.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(report.submitted_date).toLocaleDateString()}
                            </p>
                            <p className={`text-xs ${
                              report.status === 'approved' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-muted-foreground">No recent reports</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Task management functionality will be implemented in Phase 3
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Reporting functionality will be implemented in Phase 3
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
