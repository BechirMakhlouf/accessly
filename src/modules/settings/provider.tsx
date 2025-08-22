"use client";

import { useTheme } from "next-themes";
import { useUserSettings } from "./hooks";
import { useEffect } from "react";
import { setAppLocale } from "@/lib/i18n/actions";
import { Locale } from "@/lib/i18n/config";
import { USER_SETTINGS_KEY } from "./queries";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/hooks/useAuth";

export function SettingsProvider() {
  const { settings } = useUserSettings()
  const { setTheme } = useTheme()
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY })
  }, [user, queryClient])

  useEffect(() => {
    if (settings.data?.theme) {
      setTheme(settings.data.theme);
    }
  }, [settings.data?.theme, setTheme]);
  //
  useEffect(() => {
    if (settings.data?.language)
      setAppLocale(settings.data?.language as Locale)
  }, [settings.data?.language])
  return null;
}
