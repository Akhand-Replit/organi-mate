
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CompanyApplicationDialog } from './components/CompanyApplicationDialog';
import CompanyApplicationTable from './components/CompanyApplicationTable';
import { useCompanyApplicationsActions } from './components/CompanyApplicationsActions';
import { useToast } from '@/hooks/use-toast';

type CompanyApplication = {
  id: string;
  company_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const CompanyApplications: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<CompanyApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const { toast } = useToast();

  const { onApprove, onReject, onDelete } = useCompanyApplicationsActions();

  const { data: applications, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['company-applications'],
    queryFn: async () => {
      console.log("Fetching company applications");
      const { data, error } = await supabase
        .from('company_applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase SELECT error:", error);
        throw new Error(error.message);
      }
      
      console.log("Received applications:", data);
      return data as CompanyApplication[];
    }
  });

  // Get authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current auth session:", data.session);
    };
    
    checkAuth();
  }, []);

  const viewApplicationDetails = (application: CompanyApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Company Applications</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              Review and manage company registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading applications...</div>
            ) : isError ? (
              <div className="text-center py-4 text-red-500">
                Error loading applications. Please try again.<br />
                <span className="text-xs">{error?.message}</span>
              </div>
            ) : (
              <CompanyApplicationTable
                applications={applications}
                onApprove={onApprove}
                onReject={onReject}
                onDelete={onDelete}
                onShowDetails={viewApplicationDetails}
              />
            )}
          </CardContent>
        </Card>

        {selectedApplication && (
          <CompanyApplicationDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            application={selectedApplication}
            onApprove={onApprove}
            onReject={onReject}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default CompanyApplications;
