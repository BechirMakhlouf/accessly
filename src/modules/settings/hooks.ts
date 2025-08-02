"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserAvatarMutationOptions, getUserSettingsMutationOptions, getUserSettingsQueryOptions, updateUserLocaleMutationOptions, updateUserThemeMutationOptions } from "./queries";
import { SupabaseCSRClient } from "@/lib/supabase/client";
import { getQueryClient } from "@/lib/query-client";


export const useUserSettings = () => {
  const queryClient = getQueryClient();

  return {
    settings: useQuery(getUserSettingsQueryOptions(SupabaseCSRClient)),
    setSettings: useMutation(getUserSettingsMutationOptions(SupabaseCSRClient, queryClient)),
    setUserAvatar: useMutation(getUserAvatarMutationOptions(SupabaseCSRClient, queryClient)),
    setUserTheme: useMutation(updateUserThemeMutationOptions(SupabaseCSRClient, queryClient)),
    setUserLocale: useMutation(updateUserLocaleMutationOptions(SupabaseCSRClient, queryClient)),
  }
}


