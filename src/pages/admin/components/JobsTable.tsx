
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { JobApplicationsTable } from './JobApplicationsTable';
import { useToast } from '@/hooks/use-toast';
import { Job, JobApplication } from '@/lib/supabase-types';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { MoreHorizontal, Eye, Users, Edit, Trash2 } from 'lucide-react';

interface JobsTableProps {
  jobs: Job[];
  onRefresh: () => void;
}

export function JobsTable({ jobs, onRefresh }: JobsTableProps) {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleJobStatus = async (id: string, isActive: boolean) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !isActive })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Job updated',
        description: `Job ${isActive ? 'deactivated' : 'activated'} successfully`
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error updating job status:', error);
      toast({
        title: 'Error updating job',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job? This cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Job deleted',
        description: 'Job has been permanently deleted'
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error deleting job',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const viewApplications = async (job: Job) => {
    try {
      setSelectedJob(job);
      
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          applicant:applicant_id (id, email, name),
          job:job_id (id, title)
        `)
        .eq('job_id', job.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Add job title to applications for easier reference
      const processedApplications = (data || []).map(app => ({
        ...app,
        job_title: app.job?.title || 'Unknown Job',
        applicant_name: app.applicant?.name || app.applicant?.email || 'Unknown User'
      }));
      
      setApplications(processedApplications);
      setShowApplications(true);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error loading applications',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.job_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={job.is_active ? "outline" : "secondary"} 
                      className={job.is_active 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={loading[job.id]}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(`/jobs/${job.id}`, '_blank')}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => viewApplications(job)}>
                          <Users className="h-4 w-4 mr-2" />
                          Applications
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleJobStatus(job.id, job.is_active)}>
                          {job.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteJob(job.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
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

      <Dialog open={showApplications} onOpenChange={setShowApplications}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Applications for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {applications.length} applications received
            </DialogDescription>
          </DialogHeader>
          <JobApplicationsTable 
            applications={applications} 
            onStatusChange={() => viewApplications(selectedJob!)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
