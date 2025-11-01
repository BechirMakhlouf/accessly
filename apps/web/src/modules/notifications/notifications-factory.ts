import { createSSRClient } from "@/lib/supabase/server";
import { NotificationService } from "./notification-service";

let service: NotificationService | null = null;

/**
 * Factory function to create (or reuse) a singleton notification service
 */
export async function createNotificationService(): Promise<NotificationService> {
  if (service) return service;
  const supabase = await createSSRClient();
  service = new NotificationService(supabase);
  return service;
}