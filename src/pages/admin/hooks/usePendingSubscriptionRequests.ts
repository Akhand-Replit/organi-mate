
import { useQuery } from '@tanstack/react-query';

// If you implement a real subscription requests table, update here
export function usePendingSubscriptionRequestsCount() {
  // Placeholder: hardcoded 4.
  // Replace with Supabase count query when real table exists.
  return {
    data: 4,
    isLoading: false,
    error: null,
  }
}
