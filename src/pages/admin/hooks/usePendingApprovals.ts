
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Get Pending Company Applications Count
export function usePendingCompanyApplicationsCount() {
  return useQuery({
    queryKey: ['pending-company-applications-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('company_applications')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (error) throw error;
      return count || 0;
    }
  });
}
