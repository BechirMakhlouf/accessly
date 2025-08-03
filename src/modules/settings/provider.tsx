"use client";

import { useTheme } from "next-themes";
import { useUserSettings } from "./hooks";
import { useEffect } from "react";
import { setAppLocale } from "@/lib/i18n/actions";
import { Locale } from "@/lib/i18n/config";

export function SettingsProvider() {
  const { settings } = useUserSettings()
  const { setTheme } = useTheme()

  useEffect(() => {
    if (settings.data?.theme) {
      setTheme(settings.data.theme);
    }
  }, [settings.data?.theme]);
  //
  useEffect(() => {

    if (settings.data?.language)
      setAppLocale(settings.data?.language as Locale)

  }, [settings.data?.language])
  return null;
}
