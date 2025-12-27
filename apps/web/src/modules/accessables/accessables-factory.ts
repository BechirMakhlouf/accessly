import { createSSRClient } from '@/lib/supabase/server';
import { assertSignedInAndGetUserId } from '@/lib/auth/server';
import { AccessablesService } from './accessables-service';

export async function createAccessablesService(): Promise<AccessablesService> {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  return new AccessablesService(supabase, userId);
}
