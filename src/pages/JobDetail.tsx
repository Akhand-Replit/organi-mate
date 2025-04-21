
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, MapPin, Calendar, Building2, Clock, ChevronLeft, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const applicationSchema = z.object({
  coverLetter: z.string().min(50, { message: 'Cover letter must be at least 50 characters' }),
});

type ApplicationValues = z.infer<typeof applicationSchema>;

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
    },
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      
      setIsAuthenticated(!!session);
      if (session) {
        setUserId(session.user.id);
      }
    };
    
    const fetchJob = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    const checkApplication = async () => {
      if (!id || !userId) return;
      
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select('id')
          .eq('job_id', id)
          .eq('applicant_id', userId)
          .limit(1);
          
        if (error) throw error;
        setHasApplied(data.length > 0);
      } catch (error) {
        console.error('Error checking application:', error);
      }
    };
    
    checkAuth();
    fetchJob();
    
    if (isAuthenticated && userId && id) {
      checkApplication();
    }
  }, [id, isAuthenticated, userId, toast]);
  
  useEffect(() => {
    if (isAuthenticated && userId && id) {
      const checkApplication = async () => {
        try {
          const { data, error } = await supabase
            .from('job_applications')
            .select('id')
            .eq('job_id', id)
            .eq('applicant_id', userId)
            .limit(1);
            
          if (error) throw error;
          setHasApplied(data.length > 0);
        } catch (error) {
          console.error('Error checking application:', error);
        }
      };
      
      checkApplication();
    }
  }, [isAuthenticated, userId, id]);
  
  const onSubmit = async (values: ApplicationValues) => {
    if (!isAuthenticated || !userId || !job) {
      toast({
        title: 'Error',
        description: 'You must be logged in to apply for jobs',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase.from('job_applications').insert({
        job_id: job.id,
        applicant_id: userId,
        cover_letter: values.coverLetter,
        status: 'pending',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your application has been submitted successfully',
      });
      
      setApplying(false);
      setHasApplied(true);
      form.reset();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-40 w-full mb-6" />
          <Skeleton className="h-60 w-full" />
        </div>
      </Layout>
    );
  }
  
  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/jobs" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to All Jobs
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{job.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1 capitalize">
                    {job.job_type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  
                  {job.salary_range && (
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>Category: {job.category}</span>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Posted: {format(new Date(job.created_at), 'PPP')}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <div className="whitespace-pre-line">
                    {job.description}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                  <div className="whitespace-pre-line">
                    {job.requirements}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Apply for this job</CardTitle>
                <CardDescription>
                  Submit your application for {job.title} at {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="text-center py-4">
                    <p className="mb-4">You need to sign in to apply for this job</p>
                    <Link to="/login">
                      <Button className="mb-2 w-full">Sign In</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="w-full">Create Account</Button>
                    </Link>
                  </div>
                ) : hasApplied ? (
                  <div className="text-center py-4">
                    <Badge className="mb-2 mx-auto bg-green-100 text-green-800 hover:bg-green-100">
                      Applied
                    </Badge>
                    <p>You have already applied for this position.</p>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => setApplying(true)}
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
                <p>
                  {job.is_active 
                    ? "This job is currently accepting applications" 
                    : "This job is no longer accepting applications"}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <Dialog open={applying} onOpenChange={setApplying}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
              <DialogDescription>
                Tell us why you're a great fit for this position at {job.company}.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your experience and why you're a good fit for this role..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setApplying(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default JobDetail;
