import { Database } from "@/types/database.types"

export type UpsertUserSettings = Database["public"]["Tables"]["user_settings"]["Insert"];
export type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"];
