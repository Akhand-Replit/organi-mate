
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CompanyForm from '@/components/admin/CompanyForm';

const CreateCompany: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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
        name: formData.name
      });
      
      // For static admin user, directly create the company
      if (user?.email === 'admin@system.com') {
        console.log("Static admin user detected, using direct user creation");
        
        // First, create the user account with the auth admin API
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              role: 'company'
            }
          }
        });
        
        if (authError) {
          console.error("Error creating user account:", authError);
          throw new Error(`Failed to create user account: ${authError.message}`);
        }
        
        const userId = authData?.user?.id;
        if (!userId) {
          throw new Error("Failed to create user account - no user ID returned");
        }
        
        console.log("User created successfully, now creating company record for ID:", userId);
        
        // Create the company record directly
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            name: formData.name,
            user_id: userId
          });
          
        if (companyError) {
          console.error("Error inserting company record:", companyError);
          throw new Error(`Failed to create company record: ${companyError.message}`);
        }
        
        console.log("Company record created successfully");
        
      } else {
        // For normal admin users, use the Edge Function
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: {
            email: formData.email,
            password: formData.password,
            userData: {
              name: formData.name,
              role: 'company'
            }
          }
        });
        
        if (error) {
          console.error("Edge function error:", error);
          throw new Error(`Function error: ${error.message}`);
        }
        
        console.log("Create user function result:", data);
      }
      
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
      
      // Format RLS policy errors
      if (errorMessage.includes("row-level security") || errorMessage.includes("violates row-level security policy")) {
        errorMessage = "Permission error: Your account doesn't have sufficient privileges to create companies. Please contact an administrator.";
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
