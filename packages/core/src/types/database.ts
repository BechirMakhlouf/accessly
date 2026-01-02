import type { SupabaseClient } from "@supabase/supabase-js";
import type { Kysely } from "kysely";
import type { Database } from "@accessly/types";

export interface DatabaseDeps {
  supabase: SupabaseClient<Database>;
  db: Kysely<Database>;
}
