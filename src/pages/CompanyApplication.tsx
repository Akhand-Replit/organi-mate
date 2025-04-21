
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { Mail, Building2, Phone, MapPin, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const CompanyApplication: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    businessEmail: '',
    phoneNumber: '',
    address: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Submitting company application:", formData);
      
      // Submit the company application request
      const { data, error } = await supabase
        .from('company_applications')
        .insert({
          company_name: formData.companyName,
          email: formData.businessEmail,
          phone: formData.phoneNumber,
          address: formData.address,
          description: formData.description,
          status: 'pending'
        })
        .select();
      
      if (error) {
        console.error("Error submitting application:", error);
        throw error;
      }
      
      console.log("Application submitted successfully:", data);
      
      toast({
        title: "Application Submitted",
        description: "Your company application has been submitted. We'll contact you once it's reviewed.",
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast({
        title: "Application Failed",
        description: error.message || "There was a problem with your application.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-screen flex items-center justify-center p-4 py-32">
        <div className="w-full max-w-xl animate-fade-in">
          <Card className="glass-card border border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Register Your Company</CardTitle>
              <CardDescription>Submit your application to register as a company on our platform</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="Enter your company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="Enter your business email"
                      value={formData.businessEmail}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                    <Textarea
                      id="address"
                      name="address"
                      placeholder="Enter your business address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10 min-h-[80px]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your company and its services"
                      value={formData.description}
                      onChange={handleChange}
                      className="pl-10 min-h-[120px]"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Submitting Application...' : 'Submit Application'}
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Already have a company account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyApplication;
