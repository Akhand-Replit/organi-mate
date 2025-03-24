
import React, { useState } from 'react';
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
import { Search, Briefcase, MapPin, Building2, Filter } from 'lucide-react';

const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock job listings
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      description: 'We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks.',
      postedAt: '2 days ago',
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'Global Marketing Solutions',
      location: 'Remote',
      type: 'Full-time',
      salary: '$75,000 - $95,000',
      description: 'Seeking a Marketing Manager to lead our digital marketing campaigns and strategy development.',
      postedAt: '1 week ago',
    },
    {
      id: 3,
      title: 'Project Manager',
      company: 'Construction Experts LLC',
      location: 'Chicago, IL',
      type: 'Contract',
      salary: '$85,000 - $110,000',
      description: 'Experienced Project Manager needed to oversee commercial construction projects from inception to completion.',
      postedAt: '3 days ago',
    },
    {
      id: 4,
      title: 'Customer Support Specialist',
      company: 'SupportHub',
      location: 'Remote',
      type: 'Part-time',
      salary: '$25 - $30 per hour',
      description: 'Join our customer support team to help clients with product-related inquiries and technical assistance.',
      postedAt: '5 days ago',
    },
  ];
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredJobs.length > 0 ? (
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
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    description: string;
    postedAt: string;
  };
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
            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
              {job.type}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.location}</span>
          <span className="mx-2">•</span>
          <span className="text-sm">{job.salary}</span>
        </div>
        <p className="text-sm line-clamp-2">{job.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          Posted {job.postedAt}
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
