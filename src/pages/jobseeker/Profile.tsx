
import React, { useState } from 'react';
import JobSeekerLayout from '@/components/layout/JobSeekerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Save,
  Lock,
  GraduationCap,
  Briefcase,
  FileText,
  Plus,
  Trash,
} from 'lucide-react';

const JobSeekerProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock user data
  const [formData, setFormData] = useState({
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-123-4567',
    address: '789 Pine St, Anytown, USA',
    summary: 'Experienced retail professional with over 5 years in customer service and sales. Strong track record of exceeding sales targets and providing exceptional customer experiences.',
    education: [
      {
        id: '1',
        school: 'State University',
        degree: 'Bachelor of Business Administration',
        fieldOfStudy: 'Marketing',
        from: '2018',
        to: '2022'
      }
    ],
    experience: [
      {
        id: '1',
        company: 'Retail Co.',
        position: 'Sales Associate',
        location: 'Anytown, USA',
        from: '2022-06',
        to: '2025-01',
        current: false,
        description: 'Managed customer relationships and consistently exceeded monthly sales targets by 15%.'
      },
      {
        id: '2',
        company: 'Service Industries',
        position: 'Customer Service Rep',
        location: 'Anytown, USA',
        from: '2020-05',
        to: '',
        current: true,
        description: 'Handle customer inquiries and resolve issues for a major retail brand.'
      }
    ],
    skills: ['Customer Service', 'Sales', 'Inventory Management', 'Team Leadership', 'POS Systems']
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };
  
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };
  
  const removeSkill = (index: number) => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  return (
    <JobSeekerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic information for employers to contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                    <div className="h-32 w-32 bg-primary/20 rounded-full flex items-center justify-center">
                      <UserIcon className="h-12 w-12 text-primary" />
                    </div>
                    {isEditing && (
                      <Button variant="secondary" size="sm" className="absolute bottom-0 right-0">
                        Change
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-10"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          readOnly
                          className="pl-10 bg-muted"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="pl-10"
                          readOnly={!isEditing}
                          placeholder="City, State"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Professional Summary
              </CardTitle>
              <CardDescription>
                A brief overview of your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  readOnly={!isEditing}
                  placeholder="Describe your professional background and career goals"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </CardTitle>
              <CardDescription>
                Your educational background
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`school-${index}`}>School/University</Label>
                      <Input
                        id={`school-${index}`}
                        value={edu.school}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`field-${index}`}>Field of Study</Label>
                      <Input
                        id={`field-${index}`}
                        value={edu.fieldOfStudy}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`from-${index}`}>From</Label>
                        <Input
                          id={`from-${index}`}
                          value={edu.from}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`to-${index}`}>To</Label>
                        <Input
                          id={`to-${index}`}
                          value={edu.to}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4 flex justify-end">
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Experience
              </CardTitle>
              <CardDescription>
                Your employment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        value={exp.position}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`location-${index}`}>Location</Label>
                      <Input
                        id={`location-${index}`}
                        value={exp.location}
                        readOnly={!isEditing}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`from-exp-${index}`}>From</Label>
                        <Input
                          id={`from-exp-${index}`}
                          type="month"
                          value={exp.from}
                          readOnly={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`to-exp-${index}`}>To</Label>
                        <Input
                          id={`to-exp-${index}`}
                          type="month"
                          value={exp.to}
                          disabled={exp.current || !isEditing}
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={exp.description}
                      rows={3}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="mt-4 flex justify-end">
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                Key skills that make you stand out to employers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      readOnly={!isEditing}
                      placeholder="Enter a skill"
                    />
                    {isEditing && (
                      <Button variant="ghost" size="icon" onClick={() => removeSkill(index)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
                
                {isEditing && (
                  <Button variant="outline" className="w-full mt-2" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Skill
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {isEditing && (
            <div className="mt-2 flex justify-end">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save All Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </JobSeekerLayout>
  );
};

export default JobSeekerProfile;
