
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { Search, Briefcase, MapPin, Building2, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Job } from '@/lib/supabase-types';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
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
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);
  
  // Filter jobs based on search term
  const filteredJobs = searchTerm
    ? jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.job_type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : jobs;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Job</h1>
            <p className="text-xl text-muted-foreground">
              Discover opportunities from top companies
            </p>
          </div>
          
          <div className="relative mb-12">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search jobs, companies, or locations..."
              className="pl-12 h-14 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="absolute right-0 top-0 bottom-0 rounded-l-none">
              Search
            </Button>
          </div>
          
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Job Listings ({filteredJobs.length})</h2>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building2 className="h-4 w-4 mr-1 inline" />
              {job.company}
            </CardDescription>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full capitalize">
              {job.job_type}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.location}</span>
          {job.salary_range && (
            <>
              <span className="mx-2">•</span>
              <span className="text-sm">{job.salary_range}</span>
            </>
          )}
        </div>
        <p className="text-sm line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
        </span>
        <Link to={`/jobs/${job.id}`}>
          <Button variant="outline" className="text-sm h-8">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Jobs;
