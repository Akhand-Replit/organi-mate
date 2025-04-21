
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Loader2, 
  MoreHorizontal, 
  Search, 
  Plus, 
  CheckSquare,
  Eye,
  Edit,
  Trash,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { AddJobDialog } from './components/AddJobDialog';

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        if (activeTab === 'jobs') {
          // Fetch jobs
          const { data, error } = await supabase
            .from('jobs')
            .select(`
              id, 
              title,
              company,
              location,
              category,
              job_type,
              is_active,
              created_at
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setJobs(data || []);
        } else if (activeTab === 'applications') {
          // Fetch job applications
          const { data, error } = await supabase
            .from('job_applications')
            .select(`
              id, 
              job_id,
              applicant_id,
              status,
              created_at,
              jobs:job_id (
                title,
                company
              ),
              profiles:applicant_id (
                name
              )
            `)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          setApplications(data || []);
        }
      } catch (error: any) {
        console.error(`Error fetching ${activeTab}:`, error);
        toast({
          title: `Error loading ${activeTab}`,
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab, toast]);
  
  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, is_active: !currentStatus } : job
      ));
      
      toast({
        title: `Job ${currentStatus ? 'deactivated' : 'activated'}`,
        description: `The job listing has been ${currentStatus ? 'deactivated' : 'activated'} successfully.`
      });
    } catch (error: any) {
      console.error('Error toggling job status:', error);
      toast({
        title: 'Error updating job',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast({
        title: 'Application updated',
        description: `The application status has been updated to ${newStatus}.`
      });
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error updating application',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  
  const handleAddJobSuccess = () => {
    // Refetch jobs after successful creation
    if (activeTab === 'jobs') {
      fetchJobs();
    }
  };
  
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id, 
          title,
          company,
          location,
          category,
          job_type,
          is_active,
          created_at
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error loading jobs',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'interviewing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Interviewing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredJobs = searchQuery && activeTab === 'jobs'
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;
    
  const filteredApplications = searchQuery && activeTab === 'applications'
    ? applications.filter(app => 
        app.jobs?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobs?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.profiles?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : applications;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Job Board</h1>
            <p className="text-muted-foreground">Manage job listings and applications</p>
          </div>
          <Button onClick={() => setAddJobDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>All Job Listings</CardTitle>
                <CardDescription>
                  Manage all job listings across the platform
                </CardDescription>
                <div className="mt-2 relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, company, category or location..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Posted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                              No jobs found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredJobs.map((job) => (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">
                                {job.title}
                              </TableCell>
                              <TableCell>{job.company}</TableCell>
                              <TableCell>{job.category}</TableCell>
                              <TableCell className="capitalize">{job.job_type}</TableCell>
                              <TableCell>{job.location}</TableCell>
                              <TableCell>
                                {job.is_active ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <span title={format(new Date(job.created_at), 'PPP')}>
                                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Job
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toggleJobStatus(job.id, job.is_active)}>
                                      {job.is_active ? (
                                        <>
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Deactivate
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle2 className="h-4 w-4 mr-2" />
                                          Activate
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash className="h-4 w-4 mr-2" />
                                      Delete Job
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>All Job Applications</CardTitle>
                <CardDescription>
                  Review and manage job applications from job seekers
                </CardDescription>
                <div className="mt-2 relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applications by job, company, applicant or status..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                              No applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredApplications.map((application) => (
                            <TableRow key={application.id}>
                              <TableCell className="font-medium">
                                {application.jobs?.title || 'Unknown Job'}
                              </TableCell>
                              <TableCell>{application.jobs?.company || 'Unknown Company'}</TableCell>
                              <TableCell>{application.profiles?.name || 'Unknown Applicant'}</TableCell>
                              <TableCell>{getStatusBadge(application.status)}</TableCell>
                              <TableCell>
                                <span title={format(new Date(application.created_at), 'PPP')}>
                                  {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Application
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                    {application.status !== 'pending' && (
                                      <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'pending')}>
                                        <CheckSquare className="h-4 w-4 mr-2" />
                                        Mark as Pending
                                      </DropdownMenuItem>
                                    )}
                                    {application.status !== 'approved' && (
                                      <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'approved')}>
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                    )}
                                    {application.status !== 'rejected' && (
                                      <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'rejected')}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    )}
                                    {application.status !== 'interviewing' && (
                                      <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'interviewing')}>
                                        <CheckSquare className="h-4 w-4 mr-2" />
                                        Mark for Interview
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <AddJobDialog 
        open={addJobDialogOpen} 
        onOpenChange={setAddJobDialogOpen}
        onSuccess={handleAddJobSuccess}
      />
    </AdminLayout>
  );
};

export default AdminJobs;
