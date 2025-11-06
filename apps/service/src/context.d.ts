// context.d.ts (or types/global augment)

import { Database } from "@accessly/types";
import { SupabaseClient } from "@supabase/supabase-js";

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient<Database>
  }
}
