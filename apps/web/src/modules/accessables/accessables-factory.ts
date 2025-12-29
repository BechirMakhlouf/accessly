import { assertSignedInAndGetUserId } from '@/lib/auth/server';
import { AccessablesService } from './accessables-service';
import { createAdminClient } from '@/lib/supabase/adminClient';

export async function createAccessablesService(): Promise<AccessablesService> {
  const userId = await assertSignedInAndGetUserId();
  const adminSupabase = await createAdminClient();
  return new AccessablesService(adminSupabase, userId);
}
