
import React from 'react';
import JobSeekerLayout from '@/components/layout/JobSeekerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ClipboardList, MessageSquare, Building, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const JobSeekerDashboard: React.FC = () => {
  // Mock data for job seeker dashboard
  const recentApplications = [
    {
      id: '1',
      position: 'Sales Associate',
      company: 'ABC Corporation',
      date: '2025-05-05',
      status: 'Under Review'
    },
    {
      id: '2',
      position: 'Customer Service Representative',
      company: 'XYZ Company',
      date: '2025-05-03',
      status: 'Interview Scheduled'
    }
  ];
  
  const recommendedJobs = [
    {
      id: '1',
      position: 'Retail Manager',
      company: 'Global Retail Inc.',
      location: 'Chicago, IL',
      salary: '$50,000 - $65,000',
      posted: '3 days ago'
    },
    {
      id: '2',
      position: 'Sales Associate',
      company: 'Premier Stores',
      location: 'New York, NY',
      salary: '$35,000 - $45,000',
      posted: '1 day ago'
    },
    {
      id: '3',
      position: 'Store Supervisor',
      company: 'QuickMart',
      location: 'Los Angeles, CA',
      salary: '$40,000 - $55,000',
      posted: '2 days ago'
    }
  ];

  return (
    <JobSeekerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Job Seeker Dashboard</h1>
          <Link to="/jobseeker/jobs">
            <Button className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Total job applications</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Upcoming interviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Jobs saved for later</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your most recent job applications</CardDescription>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map(application => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{application.position}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Building className="h-3 w-3" />
                            <span>{application.company}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === 'Under Review' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Applied on {new Date(application.date).toLocaleDateString()}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/jobseeker/applications/${application.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  You haven't applied to any jobs yet.
                </div>
              )}
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/jobseeker/applications">View All Applications</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
              <CardDescription>Jobs that match your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.map(job => (
                  <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{job.position}</h3>
                      <span className="text-xs text-muted-foreground">
                        {job.posted}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <Building className="h-3 w-3" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>{job.location}</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <Link to={`/jobseeker/jobs/${job.id}`}>
                          View Job
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/jobseeker/jobs">Browse All Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerDashboard;
