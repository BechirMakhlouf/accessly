"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserAvatarMutationOptions, getUserSettingsMutationOptions, getUserSettingsQueryOptions, updateUserLocaleMutationOptions, updateUserThemeMutationOptions, USER_SETTINGS_KEY } from "./queries";
import { SupabaseCSRClient } from "@/lib/supabase/client";
import { getQueryClient } from "@/lib/query-client";
import { useAuth } from "@/lib/auth/hooks";


export const useUserSettings = () => {
  const queryClient = getQueryClient();
  const { user } = useAuth();

  return {
    settings: useQuery(getUserSettingsQueryOptions(SupabaseCSRClient, user?.id)),
    setSettings: useMutation(getUserSettingsMutationOptions(SupabaseCSRClient, queryClient)),
    setUserAvatar: useMutation(getUserAvatarMutationOptions(SupabaseCSRClient, queryClient)),
    setUserTheme: useMutation(updateUserThemeMutationOptions(SupabaseCSRClient, queryClient, user?.id)),
    setUserLocale: useMutation(updateUserLocaleMutationOptions(SupabaseCSRClient, queryClient, user?.id)),
  }
}


