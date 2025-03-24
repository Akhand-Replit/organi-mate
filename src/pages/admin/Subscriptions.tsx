
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, ArrowUpDown } from 'lucide-react';
import { formatDistanceToNow, parseISO, isBefore } from 'date-fns';

const AdminSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        
        // Fetch companies with their subscription data
        const { data, error } = await supabase
          .from('companies')
          .select(`
            id, 
            name,
            subscription_plan,
            subscription_end_date,
            max_branches,
            max_employees,
            updated_at
          `)
          .order('name');
          
        if (error) throw error;
        
        setSubscriptions(data || []);
      } catch (error: any) {
        console.error('Error fetching subscriptions:', error);
        toast({
          title: 'Error loading subscriptions',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [toast]);
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortSubscriptions = (a: any, b: any) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'plan':
        comparison = a.subscription_plan.localeCompare(b.subscription_plan);
        break;
      case 'date':
        // Handle null dates by putting them at the end
        if (!a.subscription_end_date) return 1;
        if (!b.subscription_end_date) return -1;
        comparison = new Date(a.subscription_end_date).getTime() - new Date(b.subscription_end_date).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  };
  
  const isSubscriptionExpired = (endDate: string | null) => {
    if (!endDate) return false;
    return isBefore(parseISO(endDate), new Date());
  };
  
  const getSubscriptionStatus = (subscription: any) => {
    if (!subscription.subscription_end_date) {
      return { label: 'Perpetual', color: 'bg-blue-100 text-blue-800' };
    }
    
    if (isSubscriptionExpired(subscription.subscription_end_date)) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    
    const daysLeft = Math.ceil(
      (parseISO(subscription.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysLeft <= 7) {
      return { label: 'Expiring Soon', color: 'bg-amber-100 text-amber-800' };
    }
    
    return { label: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const filteredSubscriptions = searchQuery
    ? subscriptions.filter(sub => 
        (sub.name.toLowerCase()).includes(searchQuery.toLowerCase()) ||
        (sub.subscription_plan.toLowerCase()).includes(searchQuery.toLowerCase())
      )
    : subscriptions;
    
  const sortedSubscriptions = [...filteredSubscriptions].sort(sortSubscriptions);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="text-muted-foreground">Manage company subscriptions and plans</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
            <CardDescription>
              View and manage company subscription plans and statuses
            </CardDescription>
            <div className="mt-2 relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or plan..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                        <div className="flex items-center">
                          Company
                          {sortField === 'name' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead onClick={() => handleSort('plan')} className="cursor-pointer">
                        <div className="flex items-center">
                          Plan
                          {sortField === 'plan' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Limits</TableHead>
                      <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                        <div className="flex items-center">
                          Expiration
                          {sortField === 'date' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 ${sortDirection === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedSubscriptions.map((subscription) => {
                        const status = getSubscriptionStatus(subscription);
                        return (
                          <TableRow key={subscription.id}>
                            <TableCell className="font-medium">
                              {subscription.name}
                            </TableCell>
                            <TableCell className="capitalize">
                              {subscription.subscription_plan}
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <div>Branches: {subscription.max_branches}</div>
                                <div>Employees: {subscription.max_employees}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {subscription.subscription_end_date ? (
                                <>
                                  <div className="text-sm">
                                    {new Date(subscription.subscription_end_date).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {isSubscriptionExpired(subscription.subscription_end_date)
                                      ? `Expired ${formatDistanceToNow(parseISO(subscription.subscription_end_date))} ago`
                                      : `Expires in ${formatDistanceToNow(parseISO(subscription.subscription_end_date))}`
                                    }
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm">No expiration</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.label}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Manage</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
