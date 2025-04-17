
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type Employee = {
  id: string;
  name: string;
  user_id: string;
  role: string;
  branch_id: string | null;
  branch_name?: string;
  is_active: boolean;
  created_at: string;
};

type Branch = {
  id: string;
  name: string;
  is_active: boolean;
};

const Employees: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openReassignDialog, setOpenReassignDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) return [];
      
      const { data, error } = await supabase
        .from('employees')
        .select('*, branches(name)')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Format the data to include branch_name
      return data.map(employee => ({
        ...employee,
        branch_name: employee.branches ? employee.branches.name : null
      })) as Employee[];
    },
    enabled: !!user?.company_id,
  });

  const { data: branches } = useQuery({
    queryKey: ['branches', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) return [];
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', user.company_id)
        .eq('is_active', true)
        .order('name');
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Branch[];
    },
    enabled: !!user?.company_id,
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          is_active: !is_active,
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: variables.is_active ? "Employee deactivated" : "Employee activated",
        description: `The employee has been ${variables.is_active ? "deactivated" : "activated"}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating employee status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const reassignBranchMutation = useMutation({
    mutationFn: async ({ employeeId, branchId }: { employeeId: string; branchId: string }) => {
      const { data, error } = await supabase
        .from('employees')
        .update({
          branch_id: branchId,
        })
        .eq('id', employeeId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Employee reassigned",
        description: "The employee has been reassigned to a different branch.",
      });
      setOpenReassignDialog(false);
    },
    onError: (error) => {
      toast({
        title: "Error reassigning employee",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Employee deleted",
        description: "The employee has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting employee",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const openReassignDialogForEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedBranchId(employee.branch_id || '');
    setOpenReassignDialog(true);
  };

  const handleReassign = () => {
    if (selectedEmployee && selectedBranchId) {
      reassignBranchMutation.mutate({
        employeeId: selectedEmployee.id,
        branchId: selectedBranchId,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'branch_manager':
        return 'Branch Manager';
      case 'assistant_manager':
        return 'Assistant Manager';
      case 'employee':
        return 'Employee';
      default:
        return role;
    }
  };

  return (
    <CompanyLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <Link to="/company/create-employee">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
            <CardDescription>
              Manage your company's employees and their branch assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {employeesLoading ? (
              <div className="text-center py-4">Loading employees...</div>
            ) : (
              <Table>
                <TableCaption>List of all employees in your company.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees && employees.length > 0 ? (
                    employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{formatRole(employee.role)}</TableCell>
                        <TableCell>{employee.branch_name || 'Unassigned'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(employee.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleActiveMutation.mutate({ id: employee.id, is_active: employee.is_active })}
                              title={employee.is_active ? "Deactivate" : "Activate"}
                            >
                              {employee.is_active ? 
                                <XCircle className="h-4 w-4 text-red-500" /> : 
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openReassignDialogForEmployee(employee)}
                              title="Reassign Branch"
                            >
                              <ArrowRightLeft className="h-4 w-4" />
                            </Button>
                            <Link to={`/company/edit-employee/${employee.id}`}>
                              <Button variant="outline" size="icon" title="Edit">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(employee.id)}
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
                      <TableCell colSpan={6} className="text-center py-6">
                        No employees found. Add your first employee to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={openReassignDialog} onOpenChange={setOpenReassignDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reassign Employee to Branch</DialogTitle>
              <DialogDescription>
                Select a branch to reassign {selectedEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="branch-select">Branch</label>
                <Select
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleReassign}
                disabled={reassignBranchMutation.isPending || !selectedBranchId}
              >
                {reassignBranchMutation.isPending ? "Reassigning..." : "Reassign Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyLayout>
  );
};

export default Employees;
