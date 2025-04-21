
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
      const { error } = await supabase
        .from('company_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (error) throw error;
      return applicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-applications'] });
      toast({
        title: "Application approved",
        description: "The company application has been approved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error approving application",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const rejectApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('company_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;
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
      toast({
        title: "Error rejecting application",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const { error } = await supabase
        .from('company_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;
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
      toast({
        title: "Error deleting application",
        description: error.message,
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

