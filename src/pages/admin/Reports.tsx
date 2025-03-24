
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Data for charts - will be replaced with actual data from Supabase
  const [userData, setUserData] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [jobData, setJobData] = useState<any[]>([]);
  
  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data for the active tab
        if (activeTab === 'users') {
          await fetchUserData();
        } else if (activeTab === 'companies') {
          await fetchCompanyData();
        } else if (activeTab === 'jobs') {
          await fetchJobData();
        }
      } catch (error: any) {
        console.error(`Error fetching ${activeTab} data:`, error);
        toast({
          title: `Error loading ${activeTab} data`,
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, toast]);
  
  const fetchUserData = async () => {
    // Fetch user role distribution
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('role');
      
    if (profilesError) throw profilesError;
    
    const roleCount = profiles.reduce((acc: any, profile) => {
      acc[profile.role] = (acc[profile.role] || 0) + 1;
      return acc;
    }, {});
    
    const roleData = Object.keys(roleCount).map(role => ({
      name: role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: roleCount[role]
    }));
    
    setUserData(roleData);
  };
  
  const fetchCompanyData = async () => {
    // Fetch companies by subscription plan
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('subscription_plan');
      
    if (companiesError) throw companiesError;
    
    const planCount = companies.reduce((acc: any, company) => {
      acc[company.subscription_plan] = (acc[company.subscription_plan] || 0) + 1;
      return acc;
    }, {});
    
    const planData = Object.keys(planCount).map(plan => ({
      name: plan.charAt(0).toUpperCase() + plan.slice(1),
      value: planCount[plan]
    }));
    
    setCompanyData(planData);
  };
  
  const fetchJobData = async () => {
    // Fetch jobs by category
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('category, is_active');
      
    if (jobsError) throw jobsErrors;
    
    const categoryCount = jobs.reduce((acc: any, job) => {
      const category = job.category;
      if (!acc[category]) {
        acc[category] = { total: 0, active: 0 };
      }
      acc[category].total += 1;
      if (job.is_active) {
        acc[category].active += 1;
      }
      return acc;
    }, {});
    
    const categoryData = Object.keys(categoryCount).map(category => ({
      name: category,
      active: categoryCount[category].active,
      inactive: categoryCount[category].total - categoryCount[category].active
    }));
    
    setJobData(categoryData);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Analytics and statistics for the platform</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
        
        <Tabs 
          defaultValue="users" 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution by Role</CardTitle>
                <CardDescription>
                  Breakdown of users across different roles in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : userData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    No user data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Companies by Subscription Plan</CardTitle>
                <CardDescription>
                  Distribution of companies across different subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : companyData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    No company data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={companyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Companies" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings by Category</CardTitle>
                <CardDescription>
                  Comparison of active and inactive job listings by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : jobData.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    No job data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" name="Active" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="inactive" name="Inactive" stackId="a" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
