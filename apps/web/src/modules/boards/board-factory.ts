import { createSSRClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';
import { BoardService } from '@accessly/core';
import { assertSignedInAndGetUserId } from '@/lib/auth/server';

export async function createBoardService(): Promise<BoardService> {
  const adminSupabase = await createAdminClient();
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  return new BoardService({
    supabase,
    adminSupabase,
    userId,
  });
}
