import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ExtendedJobApplication } from '@/lib/supabase-types';
import { Eye } from 'lucide-react';

// Make a simple wrapper component for the existing table
interface JobsTableProps {
  jobs: any[];
  onViewApplication?: (jobId: string) => void;
}

export function JobsTable({ jobs, onViewApplication }: JobsTableProps) {
  const { toast } = useToast();

  // Fixed version to avoid issues with job applications and applicants
  const handleViewApplications = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          profiles:applicant_id (name, email)
        `)
        .eq('job_id', jobId);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Safe typing for data from join query
        const applicationsWithNames = data.map(app => ({
          ...app,
          applicant_name: app.profiles?.name || 'Unknown',
          applicant_email: app.profiles?.email || 'No email'
        })) as ExtendedJobApplication[];
        
        console.log('Applications:', applicationsWithNames);
        
        if (onViewApplication) {
          onViewApplication(jobId);
        }
      } else {
        toast({
          title: "No applications",
          description: "There are no applications for this job yet."
        });
      }
    } catch (error: any) {
      console.error('Error fetching job applications:', error);
      toast({
        title: 'Error loading applications',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Posted</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              No jobs found
            </TableCell>
          </TableRow>
        ) : (
          jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">
                <Link to={`/jobs/${job.id}`} className="hover:underline">
                  {job.title}
                </Link>
              </TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</TableCell>
              <TableCell>
                {job.is_active ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleViewApplications(job.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Applications
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
