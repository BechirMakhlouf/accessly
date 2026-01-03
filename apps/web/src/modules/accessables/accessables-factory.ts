import { assertSignedInAndGetUserId } from '@/lib/auth/server';
import { AccessablesService } from '@accessly/core';
import { createAdminClient } from '@/lib/supabase/adminClient';

export async function createAccessablesService(): Promise<AccessablesService> {
  const userId = await assertSignedInAndGetUserId();
  const adminSupabase = await createAdminClient();
  return new AccessablesService({ supabase: adminSupabase, userId });
}
