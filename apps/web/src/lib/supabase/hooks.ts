import { SupabaseCSRClient } from './client';

/**
 * Hook to access the Supabase client in client components
 * @returns The Supabase client instance
 */
export function useSupabase() {
  return { supabase: SupabaseCSRClient };
}
