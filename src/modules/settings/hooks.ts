"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  getUserSettingsMutationOptions,
  getUserSettingsQueryOptions,
  updateUserLocaleMutationOptions,
  updateUserThemeMutationOptions,
} from "./queries";

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  return {
    settings: useQuery(getUserSettingsQueryOptions()),
    setSettings: useMutation(getUserSettingsMutationOptions(queryClient)),
    setUserTheme: useMutation(updateUserThemeMutationOptions(queryClient)),
    setUserLocale: useMutation(updateUserLocaleMutationOptions(queryClient)),
  };
};

// Custom hook for immediate theme switching with debounced database sync
export const useThemeManager = () => {
  const { setTheme, theme } = useTheme();
  const { setUserTheme } = useUserSettings();

  const switchTheme = (newTheme: string) => {
    // Immediately apply theme change
    setTheme(newTheme);

    // Debounced database sync
    const timeoutId = setTimeout(async () => {
      try {
        await setUserTheme.mutateAsync(newTheme);
      } catch (error) {
        console.error("Failed to sync theme to database:", error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return {
    currentTheme: theme,
    switchTheme,
    isUpdating: setUserTheme.isPending,
  };
};
