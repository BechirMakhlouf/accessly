import { createSSRClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';
import { BoardsService } from './boards-service';
import { assertSignedInAndGetUserId } from '@/lib/auth/server';

/**
 * Factory function to create a BoardsService instance with user + admin clients.
 */
export async function createBoardService(): Promise<BoardsService> {
  const adminSupabase = await createAdminClient();
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  return new BoardsService(supabase , adminSupabase , userId);
}
