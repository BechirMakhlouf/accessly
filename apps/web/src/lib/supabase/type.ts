import {
  PostgrestError,
  PostgrestResponse,
  SupabaseClient,
} from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type TypedSupabaseClient = SupabaseClient<Database, 'public', 'public'>;

export type PostgrestSuccessResponse<T> = Extract<
  PostgrestResponse<T>,
  { error: null }
>;
export type PostgrestErrorResponse<T> = Extract<
  PostgrestResponse<T>,
  { error: PostgrestError }
>;

export type Buckets = 'avatars';
