import { createSSRClient } from "@/lib/supabase/server";
import { NotificationService } from "./notification-service";
import { assertSignedInAndGetUserId } from "@/lib/auth/server";


/**
 * Factory function to create (or reuse) a singleton notification service
 */
export async function createNotificationService(): Promise<NotificationService> {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  return new NotificationService({
    supabase,
    userId,
  });
}