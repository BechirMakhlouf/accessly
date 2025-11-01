import type { TypedSupabaseClient } from "@/lib/supabase/type";
import type { Notification, NotificationInsert } from "./types";
import type { ServiceResult } from "@/lib/types";
import { eventBus } from "@/lib/event-bus";

export class NotificationService {
  private supabase: TypedSupabaseClient;
  private listenersRegistered = false;

  constructor(supabase: TypedSupabaseClient) {
    this.supabase = supabase;
    this.registerListeners();
  }

  /**
   * Register all event listeners for notifications
   */
  private registerListeners() {
    if (this.listenersRegistered) return;
    this.listenersRegistered = true;

    eventBus.on(
      "organization_created_backend",
      this.handleOrganizationCreated.bind(this)
    );
  }

  /**
   * Handles the organization_created_backend event
   */
  private async handleOrganizationCreated(data: { message: string; type?: string; userId: string }) {
    console.log(" Handling organization_created_backend event for user:", data.userId);
    const notification: NotificationInsert = {
      user_id: data.userId || "",
      message: data.message,
      type: (data.type as Notification["type"]) || "info",
      status: "sent",
    };

    await this.create(notification);
  }

  /**
   * Inserts a new notification into the database
   */
  private async create(
    notification: NotificationInsert,
  ): Promise<ServiceResult<Notification>> {
    const { data, error } = await this.supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.error(" Failed to send notification:", error);
      return {
        success: false,
        error: error.message || "Failed to insert notification",
      } as ServiceResult<Notification>;
    }

    console.log(" Notification inserted successfully");
    return { success: true, data } as ServiceResult<Notification>;
  }
}