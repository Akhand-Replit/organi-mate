
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, CheckSquare, MessageSquare, Clock } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { messagesTable } from '@/integrations/supabase/custom-client';
import { tasksTable } from '@/integrations/supabase/tables';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  // Remove default mock tasks/messages/hours
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0); // Set to zero
  
  useEffect(() => {
    const getEmployeeProfile = async () => {
      if (!user) return;
      try {
        // Use the security definer function to avoid infinite recursion
        const { data, error } = await supabase.rpc('get_employee_by_user_id', {
          user_id_param: user.id
        });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const employeeData = data[0];
          
          // Get company data using security definer function
          const { data: companyData, error: companyError } = await supabase.rpc(
            'get_company_by_id',
            { company_id_param: employeeData.company_id }
          );
          
          if (companyError) throw companyError;
          
          // Get branch data if branch_id exists
          let branchData = null;
          if (employeeData.branch_id) {
            const { data: branchResult, error: branchError } = await supabase.rpc(
              'get_branch_by_id',
              { branch_id_param: employeeData.branch_id }
            );
            
            if (branchError) throw branchError;
            branchData = branchResult && branchResult.length > 0 ? branchResult[0] : null;
          }
          
          // Combine all data
          setProfile({
            ...employeeData,
            companies: companyData && companyData.length > 0 ? companyData[0] : null,
            branches: branchData
          });
          
          // Load employee tasks
          loadTasks(employeeData.id);
          // Load employee messages
          loadMessages(user.id);
        }
      } catch (error: any) {
        console.error('Error fetching employee profile:', error);
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    getEmployeeProfile();
  }, [user, toast]);

  const loadTasks = async (employeeId: string) => {
    try {
      const { data, error } = await tasksTable.getByAssignee(employeeId);
      
      if (error) throw error;
      
      setTasks(data || []);
    } catch (error: any) {
      console.error('Error loading tasks:', error);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      // Get unread count
      const { data: unreadData, error: unreadError } = await messagesTable.getUnreadCount(userId);
      
      if (unreadError) throw unreadError;
      
      setUnreadCount(unreadData?.length || 0);
      
      // Get recent messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })
        .limit(2);
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error loading messages:', error);
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading dashboard...</span>
        </div>
      </EmployeeLayout>
    );
  }

  const pendingTasksCount = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
  const reportsCount = 0; // No mock reports

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
            </p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingTasksCount}</div>
              <p className="text-xs text-muted-foreground">
                Tasks awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Due</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsCount}</div>
              <p className="text-xs text-muted-foreground">
                Reports pending submission
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">
                Unread messages
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hoursWorked}h</div>
              <p className="text-xs text-muted-foreground">
                Hours worked this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.length > 0 ? (
                  tasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : task.status === 'in-progress' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {task.status === 'in-progress' ? 'In Progress' : 
                           task.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No tasks assigned yet
                  </div>
                )}
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
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium">{message.sender_name || 'User'}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No messages yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
