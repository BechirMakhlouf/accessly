import type { Database as SupabaseDatabase } from '@/types/database.types';
import type { KyselifyDatabase } from "kysely-supabase";
import { Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { env } from '../env';

type Database = KyselifyDatabase<SupabaseDatabase>;

export type DatabaseClient = Kysely<Database>;

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(env.DATABASE_URL),
  }),
});

