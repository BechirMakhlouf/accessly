import { env } from "@/lib/env";
import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

export async function createAdminClient() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
  );
}
