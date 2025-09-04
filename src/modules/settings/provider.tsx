"use client";

import { useTheme } from "next-themes";
import { useUserSettings } from "./hooks";
import { useEffect, useRef } from "react";
import { setAppLocale, Locale } from "@/lib/i18n";
import { USER_SETTINGS_KEY } from "./queries";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

export function SettingsProvider() {
  const { settings } = useUserSettings()
  const { setTheme } = useTheme()
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasInitialized = useRef(false);
  const lastUserId = useRef<string | null>(null);

  // Only invalidate queries when user changes
  useEffect(() => {
    if (user?.id !== lastUserId.current) {
      lastUserId.current = user?.id || null;
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: USER_SETTINGS_KEY });
      }
    }
  }, [user?.id, queryClient]);

  // Only sync theme on initial load to avoid conflicts with user changes
  useEffect(() => {
    if (settings.data?.theme && !hasInitialized.current) {
      setTheme(settings.data.theme);
      hasInitialized.current = true;
    }
  }, [settings.data?.theme, setTheme]);

  // Sync language changes
  useEffect(() => {
    if (settings.data?.language) {
      setAppLocale(settings.data?.language as Locale);
    }
  }, [settings.data?.language]);
  
  return null;
}
