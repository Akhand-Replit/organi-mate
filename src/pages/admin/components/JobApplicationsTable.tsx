
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { JobApplication } from '@/lib/supabase-types';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { MoreHorizontal, User, Calendar } from 'lucide-react';

// Extend the JobApplication type to include job and applicant info
interface ExtendedJobApplication extends JobApplication {
  job_title?: string;
  applicant_name?: string;
  // These are loaded from joins but not in the base type
}

interface JobApplicationsTableProps {
  applications: ExtendedJobApplication[];
  onStatusChange: () => void;
}

export function JobApplicationsTable({ applications, onStatusChange }: JobApplicationsTableProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      
      const { error } = await supabase
        .from('job_applications')
        .update({
          status,
          status_updated_at: new Date().toISOString(),
          status_updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Status updated',
        description: `Application status updated to ${status}`
      });
      
      onStatusChange();
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">Pending</Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500">Reviewed</Badge>;
      case 'interview':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500">Interview</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.job_title || 'Unknown Job'}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {application.applicant_name || application.applicant_id}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-2" />
                    {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={loading[application.id]}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                        disabled={application.status === 'reviewed'}
                      >
                        Mark as Reviewed
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateApplicationStatus(application.id, 'interview')}
                        disabled={application.status === 'interview'}
                      >
                        Schedule Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateApplicationStatus(application.id, 'approved')}
                        disabled={application.status === 'approved'}
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        disabled={application.status === 'rejected'}
                      >
                        Reject
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
  );
}
