
import React from 'react';
import JobSeekerLayout from '@/components/layout/JobSeekerLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/ui/tabs';
import { Building, MapPin, Calendar, ExternalLink, FileText, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobSeekerApplications: React.FC = () => {
  // Mock application data
  const applications = [
    {
      id: '1',
      position: 'Sales Associate',
      company: 'ABC Corporation',
      location: 'San Francisco, CA',
      appliedDate: '2025-05-05',
      status: 'Under Review',
      notes: 'Waiting for feedback on initial application'
    },
    {
      id: '2',
      position: 'Customer Service Representative',
      company: 'XYZ Company',
      location: 'Denver, CO',
      appliedDate: '2025-05-03',
      status: 'Interview Scheduled',
      interviewDate: '2025-05-15',
      notes: 'Video interview scheduled for May 15, 2025 at 10:00 AM'
    },
    {
      id: '3',
      position: 'Store Manager',
      company: 'Retail Giants Inc.',
      location: 'Boston, MA',
      appliedDate: '2025-04-28',
      status: 'Rejected',
      notes: 'Position filled with internal candidate'
    },
    {
      id: '4',
      position: 'Inventory Specialist',
      company: 'Supply Chain Co.',
      location: 'Chicago, IL',
      appliedDate: '2025-04-25',
      status: 'Assessment',
      notes: 'Need to complete skills assessment by May 12'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Assessment':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <JobSeekerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
          <Button asChild>
            <Link to="/jobseeker/jobs">Browse Jobs</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>
                  All your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map(application => (
                      <Card key={application.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{application.position}</CardTitle>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Building className="h-3 w-3" />
                                <span>{application.company}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{application.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                            </div>
                            {application.interviewDate && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          
                          {application.notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <p>{application.notes}</p>
                            </div>
                          )}
                        </CardContent>
                        <div className="px-6 py-2 border-t flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <FileText className="h-4 w-4" />
                            View Application
                          </Button>
                          {application.status !== 'Rejected' && (
                            <Button variant="outline" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Contact Recruiter
                            </Button>
                          )}
                          <Button size="sm" variant="default" className="gap-1">
                            <ExternalLink className="h-4 w-4" />
                            View Job
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't applied to any jobs yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Applications</CardTitle>
                <CardDescription>
                  Applications that are currently being processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.filter(app => app.status !== 'Rejected').length > 0 ? (
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status !== 'Rejected')
                      .map(application => (
                        // Same card structure as above
                        <Card key={application.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{application.position}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Building className="h-3 w-3" />
                                  <span>{application.company}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            {/* Same content as above */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{application.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                              </div>
                              {application.interviewDate && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {application.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <p>{application.notes}</p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 py-2 border-t flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              View Application
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Contact Recruiter
                            </Button>
                            <Button size="sm" variant="default" className="gap-1">
                              <ExternalLink className="h-4 w-4" />
                              View Job
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any active applications.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interviews" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Stage</CardTitle>
                <CardDescription>
                  Applications where you've been invited for an interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.filter(app => app.status === 'Interview Scheduled').length > 0 ? (
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === 'Interview Scheduled')
                      .map(application => (
                        // Same card structure
                        <Card key={application.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{application.position}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Building className="h-3 w-3" />
                                  <span>{application.company}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{application.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                              </div>
                              {application.interviewDate && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                            
                            {application.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <p>{application.notes}</p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 py-2 border-t flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              View Application
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Contact Recruiter
                            </Button>
                            <Button size="sm" variant="default" className="gap-1">
                              <ExternalLink className="h-4 w-4" />
                              View Job
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any interviews scheduled yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>
                  Applications that weren't successful
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.filter(app => app.status === 'Rejected').length > 0 ? (
                  <div className="space-y-4">
                    {applications
                      .filter(app => app.status === 'Rejected')
                      .map(application => (
                        // Same card structure
                        <Card key={application.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{application.position}</CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Building className="h-3 w-3" />
                                  <span>{application.company}</span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{application.location}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            {application.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <p>{application.notes}</p>
                              </div>
                            )}
                          </CardContent>
                          <div className="px-6 py-2 border-t flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <FileText className="h-4 w-4" />
                              View Application
                            </Button>
                            <Button size="sm" variant="default" className="gap-1">
                              <ExternalLink className="h-4 w-4" />
                              View Job
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any rejected applications.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerApplications;
