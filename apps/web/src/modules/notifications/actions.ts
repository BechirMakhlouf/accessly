"use server";
import {createNotificationService} from "./notifications-factory";
export async function getNotificationsForUser() {
  const service = await createNotificationService();
  const result = await service.getNotificationsForUser();
  if (result.error) {
    console.error("Error fetching notifications:", result.error);
    return null;
  }
  return result.data;
}