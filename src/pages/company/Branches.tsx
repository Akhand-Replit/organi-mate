
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CompanyLayout from '@/components/layout/CompanyLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
  CardFooter,
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Branch = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
});

const Branches: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when editing branch changes
  useEffect(() => {
    if (editingBranch) {
      form.reset({
        name: editingBranch.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [editingBranch, form]);

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches', user?.company_id],
    queryFn: async () => {
      if (!user?.company_id) return [];
      
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Branch[];
    },
    enabled: !!user?.company_id,
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user?.company_id) throw new Error("No company ID found");
      
      const { data, error } = await supabase
        .from('branches')
        .insert({
          company_id: user.company_id,
          name: values.name,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Branch created",
        description: "The branch has been successfully created.",
      });
      setOpenDialog(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating branch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema> & { id: string }) => {
      const { data, error } = await supabase
        .from('branches')
        .update({
          name: values.name,
        })
        .eq('id', values.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Branch updated",
        description: "The branch has been successfully updated.",
      });
      setOpenDialog(false);
      setEditingBranch(null);
    },
    onError: (error) => {
      toast({
        title: "Error updating branch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('branches')
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
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: variables.is_active ? "Branch deactivated" : "Branch activated",
        description: `The branch has been ${variables.is_active ? "deactivated" : "activated"}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating branch status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        title: "Branch deleted",
        description: "The branch has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting branch",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingBranch) {
      updateMutation.mutate({ ...values, id: editingBranch.id });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateDialog = () => {
    setEditingBranch(null);
    setOpenDialog(true);
  };

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch);
    setOpenDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <CompanyLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <Button 
            className="flex items-center gap-2"
            onClick={openCreateDialog}
          >
            <PlusCircle className="h-4 w-4" />
            Create Branch
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Branches</CardTitle>
            <CardDescription>
              Manage your company branches across different locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading branches...</div>
            ) : (
              <Table>
                <TableCaption>List of all your company branches.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches && branches.length > 0 ? (
                    branches.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            branch.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {branch.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(branch.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleActiveMutation.mutate({ id: branch.id, is_active: branch.is_active })}
                              title={branch.is_active ? "Deactivate" : "Activate"}
                            >
                              {branch.is_active ? 
                                <XCircle className="h-4 w-4 text-red-500" /> : 
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              }
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => openEditDialog(branch)} 
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(branch.id)}
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
                      <TableCell colSpan={4} className="text-center py-6">
                        No branches found. Create your first branch to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
              <DialogDescription>
                {editingBranch 
                  ? "Update branch details below." 
                  : "Add a new branch to your company structure."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter branch name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name of your branch location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      "Saving..."
                    ) : editingBranch ? (
                      "Save Changes"
                    ) : (
                      "Create Branch"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </CompanyLayout>
  );
};

export default Branches;
