
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, Building2, MapPin, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { jobsTable } from '@/integrations/supabase/tables';
import { Job, JobApplication } from '@/lib/supabase-types';

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await jobsTable.getById(id);
        
        if (error) throw error;
        if (data) setJob(data);
        
        // Check if user has already applied
        if (user) {
          const { data: applications, error: applicationError } = await supabase
            .from('job_applications')
            .select('*')
            .eq('job_id', id)
            .eq('applicant_id', user.id);
            
          if (!applicationError && applications && applications.length > 0) {
            setHasApplied(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error loading job',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id, toast, user]);

  const handleApply = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to apply for this job',
        variant: 'destructive'
      });
      return;
    }
    
    if (!job) return;
    
    try {
      setIsSubmitting(true);
      
      // Create a properly typed job application object with all required fields
      const newApplication = {
        job_id: job.id,
        applicant_id: user.id,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: 'pending'
      };
      
      const { error } = await supabase
        .from('job_applications')
        .insert(newApplication);
        
      if (error) throw error;
      
      toast({
        title: 'Application submitted',
        description: 'Your application has been successfully submitted',
      });
      
      setHasApplied(true);
      setApplying(false);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error submitting application',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
            <p className="mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link to="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <div className="flex items-center mt-2 text-muted-foreground">
                <Building2 className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{job.location}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 capitalize">
                {job.job_type}
              </Badge>
              <span className="text-sm text-muted-foreground mt-2">
                <Clock className="h-3 w-3 inline mr-1" />
                Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          {!applying && !hasApplied ? (
            <div className="bg-muted rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="font-medium">Interested in this position?</h2>
                <p className="text-muted-foreground text-sm">Submit your application now</p>
              </div>
              <Button onClick={() => setApplying(true)} className="mt-4 sm:mt-0">
                Apply Now
              </Button>
            </div>
          ) : hasApplied ? (
            <div className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg p-6 mb-8">
              <h2 className="font-medium">Application Submitted</h2>
              <p className="text-sm">You have already applied for this position.</p>
            </div>
          ) : null}
          
          {applying && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Apply for {job.title}</CardTitle>
                <CardDescription>Fill out the form below to submit your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="resumeUrl">
                    Resume URL
                  </label>
                  <Input
                    id="resumeUrl"
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="coverLetter">
                    Cover Letter
                  </label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Why are you interested in this position?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setApplying(false)}>Cancel</Button>
                <Button onClick={handleApply} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <div className="whitespace-pre-line">{job.description}</div>
            </section>
            
            <Separator />
            
            <section>
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <div className="whitespace-pre-line">{job.requirements}</div>
            </section>
            
            {job.salary_range && (
              <>
                <Separator />
                <section>
                  <h2 className="text-xl font-bold mb-4">Salary Range</h2>
                  <p>{job.salary_range}</p>
                </section>
              </>
            )}
            
            <Separator />
            
            <section className="pb-8">
              <h2 className="text-xl font-bold mb-4">How to Apply</h2>
              {!user ? (
                <div>
                  <p className="mb-4">Please log in to apply for this position.</p>
                  <Link to="/login">
                    <Button>Log in</Button>
                  </Link>
                </div>
              ) : hasApplied ? (
                <p>You have already applied for this position. We'll contact you if you're selected for the next stage.</p>
              ) : (
                <Button onClick={() => setApplying(true)}>Apply Now</Button>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
