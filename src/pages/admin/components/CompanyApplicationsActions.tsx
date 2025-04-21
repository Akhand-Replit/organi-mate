
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Props = {
  onApprove: (applicationId: string) => Promise<void>;
  onReject: (applicationId: string) => Promise<void>;
  onDelete: (applicationId: string) => Promise<void>;
};

export function useCompanyApplicationsActions(): Props {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      console.log("Approving application:", applicationId);
      
      // Get the application data first
      const { data: application, error: fetchError } = await supabase
        .from('company_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching application:", fetchError);
        throw fetchError;
      }
      
      if (!application) {
        throw new Error("Application not found");
      }
      
      console.log("Application data:", application);
      
      // Update the application status
      const { error: updateError } = await supabase
        .from('company_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (updateError) {
        console.error("Error updating application:", updateError);
        throw updateError;
      }
      
      // Create a new user for the company
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: application.email,
        password: Math.random().toString(36).slice(-10) + "A1!", // Generate a secure random password
        options: {
          data: {
            name: application.company_name,
            role: 'company'
          }
        }
      });
      
      if (userError) {
        console.error("Error creating user:", userError);
        throw userError;
      }
      
      if (!userData.user) {
        throw new Error("Failed to create user");
      }
      
      console.log("Created user:", userData.user);
      
      // Create the company record
      const { error: companyError } = await supabase
        .from('companies')
        .insert({
          name: application.company_name,
          user_id: userData.user.id
        });
        
      if (companyError) {
        console.error("Error creating company:", companyError);
        throw companyError;
      }
      
      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application approved",
        description: "The company application has been approved and account created.",
      });
    },
    onError: (error: any) => {
      console.error("Error in approve mutation:", error);
      toast({
        title: "Error approving application",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      console.log("Rejecting application:", applicationId);
      const { error } = await supabase
        .from('company_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) {
        console.error("Error rejecting application:", error);
        throw error;
      }
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application rejected",
        description: "The company application has been rejected.",
      });
    },
    onError: (error: any) => {
      console.error("Error in reject mutation:", error);
      toast({
        title: "Error rejecting application",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      console.log("Deleting application:", applicationId);
      const { error } = await supabase
        .from('company_applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        console.error("Error deleting application:", error);
        throw error;
      }
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application deleted",
        description: "The company application has been permanently deleted.",
      });
    },
    onError: (error: any) => {
      console.error("Error in delete mutation:", error);
      toast({
        title: "Error deleting application",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Return handlers for usage within components
  const onApprove = async (applicationId: string) => {
    await approveApplicationMutation.mutateAsync(applicationId);
  };

  const onReject = async (applicationId: string) => {
    await rejectApplicationMutation.mutateAsync(applicationId);
  };

  const onDelete = async (applicationId: string) => {
    if(confirm("Are you sure you want to delete this application? This cannot be undone.")) {
      await deleteApplicationMutation.mutateAsync(applicationId);
    }
  };

  return { onApprove, onReject, onDelete };
}
