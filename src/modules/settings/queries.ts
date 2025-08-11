import { TypedSupabaseClient } from "@/lib/supabase/type";
import { getUserId } from "@/lib/supabase/utils";
import { UserSettings, UpsertUserSettings } from "./types";
import { QueryClient, UndefinedInitialDataOptions } from "@tanstack/react-query";
import { createAvatarPath } from "./utils";

export const USER_SETTINGS_KEY = ["userSettings"] as const;

export async function getUserSettings(supabase: TypedSupabaseClient) {
  const user_id = await getUserId(supabase);
  const result = (await supabase.from("user_settings").select("*").eq("user_id", user_id!).limit(1).maybeSingle().throwOnError()).data;
  return result;
}

export async function upsertUserSettings(supabase: TypedSupabaseClient, settings: Partial<UpsertUserSettings>) {
  const user_id = await getUserId(supabase);

  if (!user_id)
    return;

  return await supabase
    .from("user_settings")
    .upsert({ ...settings, id: user_id })
    .throwOnError();
}

export const deleteUserAvatar = async (supabase: TypedSupabaseClient) => {
  const user_id = await getUserId(supabase);
  if (!user_id) return null;

  const { data: list, error: listError } = await supabase
    .storage
    .from("avatars")
    .list(`${user_id}/`, { limit: 10000, offset: 0 })

  if (listError) throw listError;
  else if (list.length === 0) throw new Error("already empty",);

  const paths = list.map(f => `${user_id}/${f.name}`)

  const { error: deleteError } = await supabase
    .storage
    .from("avatars")
    .remove(paths)

  if (deleteError) throw deleteError

  await upsertUserSettings(supabase, { id: user_id, avatar_url: null })
}

export const uploadUserAvatar = async (supabase: TypedSupabaseClient, file: File) => {
  try {
    await deleteUserAvatar(supabase);
  } catch {
  }

  const user_id = await getUserId(supabase);
  if (!user_id) return null;

  const uploadResult = await supabase.storage.from("avatars").upload(createAvatarPath(user_id, file), file, {
    upsert: true,
  });

  if (uploadResult.error) throw uploadResult.error;

  const avatarPublicUrl = supabase.storage.from("avatars").getPublicUrl(uploadResult.data.path).data.publicUrl;

  await upsertUserSettings(supabase, { id: user_id, avatar_url: avatarPublicUrl })
  return uploadResult;
}

export const getUserSettingsQueryOptions: (supabase: TypedSupabaseClient) =>
  UndefinedInitialDataOptions<UserSettings | null> =
  (supabase: TypedSupabaseClient) => ({
    queryKey: USER_SETTINGS_KEY,
    queryFn: () => getUserSettings(supabase),
  })

export const getUserSettingsMutationOptions = (supabase: TypedSupabaseClient, queryClient: QueryClient) => ({
  mutationFn: (settings: Partial<UpsertUserSettings>) => upsertUserSettings(supabase, settings),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
})


export const getUserAvatarMutationOptions = (supabase: TypedSupabaseClient, queryClient: QueryClient) => ({
  mutationFn: ({ file }: { file?: File }) => file ? uploadUserAvatar(supabase, file) : deleteUserAvatar(supabase),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
})

// Update user theme mutation
export const updateUserThemeMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient
) => ({
  mutationFn: async (theme: UserSettings["theme"]) =>
    upsertUserSettings(supabase, { theme }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
});

// Update user locale mutation
export const updateUserLocaleMutationOptions = (
  supabase: TypedSupabaseClient,
  queryClient: QueryClient
) => ({
  mutationFn: async (language: UserSettings["language"]) =>
    upsertUserSettings(supabase, { language }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY }),
});


export const upsertUserPhone = async (supabase: TypedSupabaseClient, phone: string) => {
  return await supabase.auth.updateUser({
    phone
  })
}

export const updatePassword = async (supabase: TypedSupabaseClient, password: string) => {
  return await supabase.auth.updateUser({ password });
}

export const resetEmail = async (supabase: TypedSupabaseClient, email: string) => {
  return await supabase.auth.updateUser({ email })
}

//TODO: bayi: check how to return a builder when returning getting the userId manually and using async
// export const getUserSettings = (supabase: TypedSupabaseClient) => supabase.from("user_settings").select("*").limit(1).single();
