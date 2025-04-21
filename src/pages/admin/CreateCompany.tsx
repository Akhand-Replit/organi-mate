
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { createUser } from '@/lib/auth';
import { UserRole } from '@/lib/auth';
import CompanyForm from '@/components/admin/CompanyForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const CreateCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Creating company with data:", {
        email: formData.email,
        name: formData.name,
        role: 'company'
      });
      
      const result = await createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'company' as UserRole,
      });
      
      console.log("Create user result:", result);
      
      toast({
        title: "Company created",
        description: `${formData.name} has been successfully created.`,
      });
      
      // Redirect to companies list after successful creation
      setTimeout(() => {
        navigate('/admin/companies');
      }, 1500);
      
    } catch (error: any) {
      console.error("Error creating company:", error);
      let errorMessage = error.message || "There was a problem creating the company.";
      
      // Format Edge Function errors
      if (errorMessage.includes("Edge Function") || errorMessage.includes("Failed to fetch")) {
        errorMessage = "Network error: Unable to reach the server. The company might have been created - please check the companies list.";
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error creating company",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Company</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create New Company Account
            </CardTitle>
            <CardDescription>
              Create a company account with administrator privileges. The company can then create and manage its own branches and employees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
            
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error creating company</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateCompany;
