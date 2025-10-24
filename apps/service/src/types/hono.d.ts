import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

declare module "hono" {
  export interface ContextVariableMap {
    supabase: SupabaseClient<Database, "public", Database["public"]>;
  }
}
