
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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

type Company = {
  id: string;
  name: string;
  is_active: boolean;
  subscription_plan: string;
  subscription_end_date: string | null;
  max_branches: number;
  max_employees: number;
  created_at: string;
};

const Companies: React.FC = () => {
  const { toast } = useToast();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const { data: companies, isLoading, isError, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Company[];
    }
  });

  const handleStatusChange = async (companyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ is_active: !isActive })
        .eq('id', companyId);
        
      if (error) throw error;
      
      toast({
        title: "Company status updated",
        description: `Company has been ${!isActive ? 'activated' : 'deactivated'}.`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error updating company",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (companyId: string) => {
    if (confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      try {
        const { error } = await supabase
          .from('companies')
          .delete()
          .eq('id', companyId);
          
        if (error) throw error;
        
        toast({
          title: "Company deleted",
          description: "Company has been permanently deleted.",
        });
        
        refetch();
      } catch (error: any) {
        toast({
          title: "Error deleting company",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <Link to="/admin/create-company">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Company
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
            <CardDescription>
              Manage company accounts and their subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading companies...</div>
            ) : isError ? (
              <div className="text-center py-4 text-red-500">
                Error loading companies. Please try again.
              </div>
            ) : (
              <Table>
                <TableCaption>List of all registered companies.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-center">Branches</TableHead>
                    <TableHead className="text-center">Employees</TableHead>
                    <TableHead className="text-center">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies && companies.length > 0 ? (
                    companies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {company.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{company.subscription_plan}</TableCell>
                        <TableCell>{formatDate(company.subscription_end_date)}</TableCell>
                        <TableCell className="text-center">{company.max_branches}</TableCell>
                        <TableCell className="text-center">{company.max_employees}</TableCell>
                        <TableCell className="text-center">{formatDate(company.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStatusChange(company.id, company.is_active)}
                              title={company.is_active ? "Deactivate" : "Activate"}
                            >
                              {company.is_active ? 
                                <XCircle className="h-4 w-4 text-red-500" /> : 
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                            <Link to={`/admin/edit-company/${company.id}`}>
                              <Button variant="outline" size="icon" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(company.id)}
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
                      <TableCell colSpan={8} className="text-center py-6">
                        No companies found. Create your first company to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Companies;
