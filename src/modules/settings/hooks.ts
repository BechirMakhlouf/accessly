"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import {
  getUserSettingsMutationOptions,
  getUserSettingsQueryOptions,
  updateUserLocaleMutationOptions,
  updateUserThemeMutationOptions,
  USER_SETTINGS_KEY,
} from "./queries";

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  const settings = useQuery(getUserSettingsQueryOptions());

  const setSettings = useMutation(getUserSettingsMutationOptions(queryClient));

  const setUserTheme = useMutation(updateUserThemeMutationOptions(queryClient));

  const setUserLocale = useMutation({
    mutationFn: async (newLocale: string) => {
      // Appel à ta fonction existante
      await updateUserLocaleMutationOptions(queryClient).mutationFn(newLocale);
    },
    onSuccess: (_data, newLocale) => {
      // Mettre à jour le cache pour que SettingsProvider détecte la langue
      queryClient.setQueryData(USER_SETTINGS_KEY, (oldData: unknown) => ({
        ...(oldData as Record<string, unknown>),
        language: newLocale,
      }));
    },
  });

  return {
    settings,
    setSettings,
    setUserTheme,
    setUserLocale,
  };
};

// Hook pour gérer le thème
export const useThemeManager = () => {
  const { setTheme, theme } = useTheme();
  const { setUserTheme } = useUserSettings();

  const switchTheme = (newTheme: string) => {
    setTheme(newTheme);

    const timeoutId = setTimeout(async () => {
      try {
        await setUserTheme.mutateAsync(newTheme);
      } catch (_error) {
        console.error("Failed to sync theme to database:", _error);
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
