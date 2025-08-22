"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserSettingsMutationOptions,
  getUserSettingsQueryOptions,
  updateUserLocaleMutationOptions,
  updateUserThemeMutationOptions
} from "./queries";

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  return {
    settings: useQuery(getUserSettingsQueryOptions()),
    setSettings: useMutation(getUserSettingsMutationOptions(queryClient)),
    setUserTheme: useMutation(updateUserThemeMutationOptions(queryClient)),
    setUserLocale: useMutation(updateUserLocaleMutationOptions(queryClient)),
  }
}
