"use server";

import { createSSRClient } from "@/lib/supabase/server";
import type { UpsertUserSettings } from "./types";
import { assertSignedInAndGetUserId } from "@/lib/auth/server-utils";

export async function getUserSettings() {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  const result = (
    await supabase
      .from("user_settings")
      .select("*")
      .eq("id", userId)
      .limit(1)
      .maybeSingle()
      .throwOnError()
  ).data;

  return result;
}

export async function upsertUserSettings(settings: Partial<UpsertUserSettings>) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  return await supabase.from("user_settings").upsert({ ...settings, id: userId }).throwOnError();
}
