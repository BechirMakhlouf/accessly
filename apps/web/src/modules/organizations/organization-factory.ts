import { createSSRClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/adminClient';
import { OrganizationService } from './organization-service';
import { assertSignedInAndGetUserId } from '@/lib/auth/server';
import { createMailService } from '@/lib/mail';

/**
 * Factory function to create organization service with only admin client
 */
export async function createOrgService(): Promise<OrganizationService> {
  const adminSupabase = await createAdminClient();
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  const emailService = createMailService();

  return new OrganizationService({
    supabase,
    adminSupabase,
    userId,
    emailService,
  });
}
