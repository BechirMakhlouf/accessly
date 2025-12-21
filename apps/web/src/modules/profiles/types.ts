import type { Database } from '@/types/database.types';

export type UpsertProfile =
  | Database['public']['Tables']['user_profiles']['Insert']
  | Database['public']['Tables']['user_profiles']['Update'];
export type Profile = Database['public']['Tables']['user_profiles']['Row'];
