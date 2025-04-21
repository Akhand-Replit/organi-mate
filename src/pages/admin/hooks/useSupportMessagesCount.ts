
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch number of unread messages for admin (with role='admin')
export function useSupportMessagesCount() {
  return useQuery({
    queryKey: ['admin-unread-messages-count'],
    queryFn: async () => {
      // Adjust logic as needed for your admin id
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .maybeSingle();

      const adminId = adminProfile?.id;
      if (!adminId) return 0;

      const { count, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', adminId)
        .eq('read', false);
      if (error) throw error;
      return count || 0;
    }
  });
}
