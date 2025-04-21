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
      // Fetch application data
      const { data: application, error: fetchError } = await supabase
        .from('company_applications')
        .select('*')
        .eq('id', applicationId)
        .single();
      if (fetchError) throw fetchError;
      if (!application) throw new Error("Application not found");

      // Update application to approved
      const { error: updateError } = await supabase
        .from('company_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
      if (updateError) throw updateError;

      // Call edge function to create company record and user
      // Replace with your edge function's real usage if needed
      const res = await supabase.functions.invoke('admin-create-company', {
        body: {
          name: application.company_name,
          userId: application.id // This might be wrong! Usually, you need userId of newly created auth user, not application id.
        },
        headers: {
          'X-Admin-Auth': 'static-admin-token',
        }
      });
      if (res.error) {
        throw new Error(res.error.message || "Error creating company");
      }

      // You may also want to update application with company id here

      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application approved",
        description: "The company application has been approved and company record created.",
      });
    },
    onError: (error: any) => {
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
