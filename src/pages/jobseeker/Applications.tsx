
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobSeekerLayout from '@/components/layout/JobSeekerLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Clock, Building2, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  resume_url: string | null;
  cover_letter: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
  }
}

const Applications: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:job_id (
              id,
              title,
              company,
              location
            )
          `)
          .eq('applicant_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setApplications(data || []);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error loading applications',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [user, toast]);

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
    <JobSeekerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Applications</h1>
          <Link to="/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : applications.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{application.job?.title || 'Unknown Position'}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Building2 className="h-4 w-4 mr-1 inline" />
                        {application.job?.company || 'Unknown Company'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
                    </div>
                    {application.cover_letter && (
                      <div>
                        <h3 className="text-sm font-medium mb-1">Your Cover Letter</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{application.cover_letter}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm">
                    {application.status === 'interview' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">Interview Scheduled</Badge>
                    )}
                  </div>
                  <Link to={`/jobs/${application.job_id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      View Job
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">You haven't applied to any jobs yet.</p>
            <Link to="/jobs">
              <Button>Browse Available Jobs</Button>
            </Link>
          </div>
        )}
      </div>
    </JobSeekerLayout>
  );
};

export default Applications;
