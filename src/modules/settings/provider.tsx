"use client";

import { useTheme } from "next-themes";
import { useUserSettings } from "./hooks";
import { useEffect } from "react";
import { setAppLocale } from "@/lib/i18n/actions";
import { Locale } from "@/lib/i18n/config";
import { useAuth } from "@/lib/auth/hooks";
import { getQueryClient } from "@/lib/query-client";
import { USER_SETTINGS_KEY } from "./queries";

export function SettingsProvider() {
  const { settings } = useUserSettings()
  const { setTheme } = useTheme()
  const { user } = useAuth();
  const queryClient = getQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY })
  }, [user])

  useEffect(() => {
    if (settings.data?.theme) {
      setTheme(settings.data.theme);
    }
  }, [settings]);
  //
  useEffect(() => {
    if (settings.data?.language)
      setAppLocale(settings.data?.language as Locale)
  }, [])
  return null;
}
