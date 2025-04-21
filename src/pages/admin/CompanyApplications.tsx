import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<CompanyApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const { data: applications, isLoading, isError, error } = useQuery({
    queryKey: ['company-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error("Supabase SELECT error:", error);
        throw new Error(error.message);
      }
      console.log("Fetched applications:", data);
      return data as CompanyApplication[];
    }
  });

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

  const handleApprove = async (applicationId: string) => {
    await approveApplicationMutation.mutate(applicationId);
  };

  const handleReject = async (applicationId: string) => {
    await rejectApplicationMutation.mutate(applicationId);
  };

  const handleDelete = async (applicationId: string) => {
    if (confirm("Are you sure you want to delete this application? This cannot be undone.")) {
      await deleteApplicationMutation.mutate(applicationId);
    }
  };

  const viewApplicationDetails = (application: CompanyApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
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
              <Table>
                <TableCaption>List of all company applications.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications && applications.length > 0 ? (
                    applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium cursor-pointer hover:underline" 
                          onClick={() => viewApplicationDetails(application)}>
                          {application.company_name}
                        </TableCell>
                        <TableCell>{application.email}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>{formatDate(application.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleApprove(application.id)}
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleReject(application.id)}
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4 text-red-500" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(application.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <div>
                          No company applications found.<br />
                          <span className="text-xs text-muted-foreground">
                            If you recently submitted an application and it is not visible, ensure that you are logged in as an admin and that new applications are being submitted to Supabase.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedApplication && (
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedApplication.company_name}</DialogTitle>
                <DialogDescription>
                  Application Details
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="text-sm font-medium">Status</h4>
                  <p>{getStatusBadge(selectedApplication.status)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Email</h4>
                  <p>{selectedApplication.email}</p>
                </div>
                {selectedApplication.phone && (
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p>{selectedApplication.phone}</p>
                  </div>
                )}
                {selectedApplication.address && (
                  <div>
                    <h4 className="text-sm font-medium">Address</h4>
                    <p>{selectedApplication.address}</p>
                  </div>
                )}
                {selectedApplication.description && (
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="whitespace-pre-wrap">{selectedApplication.description}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium">Submitted</h4>
                  <p>{formatDate(selectedApplication.created_at)}</p>
                </div>
              </div>
              <DialogFooter>
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button
                      variant="outline" 
                      className="border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => {
                        handleReject(selectedApplication.id);
                        setShowDetailsDialog(false);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => {
                        handleApprove(selectedApplication.id);
                        setShowDetailsDialog(false);
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default CompanyApplications;
