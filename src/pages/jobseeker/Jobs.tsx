
import React, { useState } from 'react';
import JobSeekerLayout from '@/components/layout/JobSeekerLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Building, MapPin, Briefcase, Search, DollarSign, Calendar, ArrowUpRight, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobSeekerJobs: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  
  // Mock jobs data
  const jobs = [
    {
      id: '1',
      title: 'Retail Manager',
      company: 'Global Retail Inc.',
      location: 'Chicago, IL',
      salary: '$50,000 - $65,000',
      jobType: 'Full-time',
      description: 'We are seeking an experienced Retail Manager to oversee daily operations of our Chicago location. The ideal candidate will have at least 3 years of retail management experience and excellent customer service skills.',
      requirements: [
        'Bachelor\'s degree in Business or related field',
        '3+ years of retail management experience',
        'Strong leadership and communication skills',
        'Experience with inventory management systems'
      ],
      postedDate: '2025-05-03'
    },
    {
      id: '2',
      title: 'Sales Associate',
      company: 'Premier Stores',
      location: 'New York, NY',
      salary: '$35,000 - $45,000',
      jobType: 'Full-time',
      description: 'Premier Stores is looking for an energetic Sales Associate to join our team. You\'ll be responsible for helping customers find products, processing transactions, and maintaining store appearance.',
      requirements: [
        'High school diploma or equivalent',
        'Previous retail experience preferred',
        'Excellent customer service skills',
        'Ability to work flexible hours including weekends'
      ],
      postedDate: '2025-05-05'
    },
    {
      id: '3',
      title: 'Store Supervisor',
      company: 'QuickMart',
      location: 'Los Angeles, CA',
      salary: '$40,000 - $55,000',
      jobType: 'Full-time',
      description: 'QuickMart is seeking a Store Supervisor to assist with daily operations. The successful candidate will help with scheduling, inventory management, and ensuring excellent customer service.',
      requirements: [
        'Associate\'s degree or 2+ years of retail experience',
        'Supervisory experience preferred',
        'Strong problem-solving abilities',
        'Proficient with POS systems'
      ],
      postedDate: '2025-05-04'
    },
    {
      id: '4',
      title: 'Cashier',
      company: 'ValueShop',
      location: 'Dallas, TX',
      salary: '$28,000 - $32,000',
      jobType: 'Part-time',
      description: 'ValueShop is hiring Part-time Cashiers for our Dallas location. Responsibilities include processing customer transactions, providing excellent customer service, and maintaining a clean checkout area.',
      requirements: [
        'High school diploma or equivalent',
        'Cash handling experience preferred',
        'Strong attention to detail',
        'Ability to stand for extended periods'
      ],
      postedDate: '2025-05-06'
    },
    {
      id: '5',
      title: 'Assistant Store Manager',
      company: 'FashionHub',
      location: 'Miami, FL',
      salary: '$45,000 - $55,000',
      jobType: 'Full-time',
      description: 'FashionHub is looking for an Assistant Store Manager to help lead our team. You\'ll work closely with the Store Manager to oversee operations, train staff, and ensure sales targets are met.',
      requirements: [
        'Bachelor\'s degree preferred',
        '2+ years in retail management',
        'Fashion retail experience a plus',
        'Strong leadership and organizational skills'
      ],
      postedDate: '2025-05-02'
    }
  ];

  return (
    <JobSeekerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>Refine your job search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search">Keyword Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="search" placeholder="Job title, skills, company..." className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="location" placeholder="City, state, or zip code" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="fulltime" />
                      <label htmlFor="fulltime" className="text-sm">Full-time</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="parttime" />
                      <label htmlFor="parttime" className="text-sm">Part-time</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="contract" />
                      <label htmlFor="contract" className="text-sm">Contract</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="temporary" />
                      <label htmlFor="temporary" className="text-sm">Temporary</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Salary Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="30k">$30,000+</SelectItem>
                      <SelectItem value="50k">$50,000+</SelectItem>
                      <SelectItem value="75k">$75,000+</SelectItem>
                      <SelectItem value="100k">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">Apply Filters</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Found {jobs.length} jobs matching your criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div 
                      key={job.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedJob?.id === job.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                          <h3 className="font-medium text-lg">{job.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mt-1">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building className="h-3 w-3" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {job.jobType}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedJob?.id === job.id && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Job Description</h4>
                          <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                          
                          <h4 className="font-medium mb-2">Requirements</h4>
                          <ul className="text-sm text-muted-foreground list-disc pl-5 mb-4">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                          
                          <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <BookmarkPlus className="h-4 w-4" />
                              Save
                            </Button>
                            <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" className="gap-2">
                                  <Briefcase className="h-4 w-4" />
                                  Apply
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Apply for {job.title}</DialogTitle>
                                  <DialogDescription>
                                    Submit your application for this position at {job.company}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="resume">Resume</Label>
                                    <Input id="resume" type="file" accept=".pdf,.doc,.docx" />
                                    <p className="text-xs text-muted-foreground">
                                      PDF, DOC, or DOCX files only (Max 5MB)
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="coverLetter">Cover Letter</Label>
                                    <Input id="coverLetter" type="file" accept=".pdf,.doc,.docx" />
                                    <p className="text-xs text-muted-foreground">
                                      Optional. PDF, DOC, or DOCX files only (Max 5MB)
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Input id="additionalInfo" placeholder="Anything else you'd like to add?" />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
                                  <Button onClick={() => setApplyDialogOpen(false)}>Submit Application</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerJobs;
