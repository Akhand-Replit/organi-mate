
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
      // 1. Fetch application data
      const { data: application, error: fetchError } = await supabase
        .from('company_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      if (fetchError) throw fetchError;
      if (!application) throw new Error("Application not found");

      // 2. Update application to approved
      const { error: updateError } = await supabase
        .from('company_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
      if (updateError) throw updateError;

      // 3. Try to create a company *and* a new user for company owner (using edge function)
      // We'll use the application's email as the company owner email.
      // Use a random temporary password for the new user
      const tempPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 12) + "!A1";
      const companyOwnerEmail = application.email;
      const companyName = application.company_name;
      const companyOwnerName = companyName + " Admin";

      // Call create-user edge function as admin to create both the user and company
      const res = await supabase.functions.invoke('create-user', {
        body: {
          email: companyOwnerEmail,
          password: tempPassword,
          userData: {
            name: companyOwnerName,
            role: 'company',
            company_id: null,
            branch_id: null
          }
        },
        headers: {
          'X-Admin-Auth': 'static-admin-token',
        }
      });

      // If the edge function returns error, revert the application back to pending
      if (res.error || (res.data && res.data.error)) {
        // Revert status to 'pending'
        await supabase
          .from('company_applications')
          .update({ status: 'pending' })
          .eq('id', applicationId);

        let message = res.error?.message || (res.data && res.data.error) || "Unknown error";
        throw new Error("Failed to create user and company: " + message);
      }

      // Optionally: You could update application with company record ID, but not exposed yet
      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application approved",
        description: "The company has been created and the owner set up. The company owner should receive an invite.",
      });
    },
    onError: (error: any) => {
      console.error("Error approving company application:", error);
      toast({
        title: "Error approving application",
        description: error.message || "An unknown error occurred while creating the company/user.",
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

  // Handlers
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

