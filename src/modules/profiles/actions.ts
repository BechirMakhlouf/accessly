"use server";

import { createSSRClient } from "@/lib/supabase/server";
import { assertSignedInAndGetUserId } from "@/lib/auth/server-utils";
import { UpsertProfile } from "./types";
import { createAvatarPath } from "./utils";

export async function getProfile() {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  const result = (
    await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .limit(1)
      .maybeSingle()
      .throwOnError()
  ).data;

  return result;
}

export async function upsertProfile(profile: UpsertProfile) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  return await supabase.from("user_profiles").upsert({ ...profile, id: userId }).throwOnError();
}

export async function deleteUserAvatar() {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  const { data: list, error: listError } = await supabase.storage
    .from("avatars")
    .list(`${userId}/`, { limit: 10000, offset: 0 });

  if (listError) throw listError;
  else if (list.length === 0) return console.warn("attempting to delete an empty avatar");

  const paths = list.map((f) => `${userId}/${f.name}`);

  const { error: deleteError } = await supabase.storage.from("avatars").remove(paths);

  if (deleteError) console.error("error while deleting the avatar: ", deleteError);
  await upsertProfile({ id: userId, avatar_url: null });
}

export async function uploadUserAvatar(file?: File) {
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();

  try {
    await deleteUserAvatar();
  } catch {
  }

  if (!file) return;

  const uploadResult = await supabase.storage
    .from("avatars")
    .upload(createAvatarPath(userId, file), file, {
      upsert: true
    });

  if (uploadResult.error) {
    console.error("error uploading user avatar.", uploadResult.error);
    return uploadResult
  }

  const avatarPublicUrl = supabase.storage
    .from("avatars")
    .getPublicUrl(uploadResult.data.path).data.publicUrl;

  await upsertProfile({ id: userId, avatar_url: avatarPublicUrl });
  return uploadResult;
}
