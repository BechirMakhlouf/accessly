import { SupabaseClient, PostgrestError, PostgrestResponse, } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { } from "@supabase/supabase-js";

export type TypedSupabaseClient = SupabaseClient<Database>;

export type PostgrestSuccessResponse<T> = Extract<PostgrestResponse<T>, { error: null }>;
export type PostgrestErrorResponse<T> = Extract<PostgrestResponse<T>, { error: PostgrestError }>;

export type Buckets = "avatars";
