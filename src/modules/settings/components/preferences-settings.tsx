// components/preferences-settings.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { localesInfo } from "@/lib/i18n/config"
import { useUserSettings, useThemeManager } from "../hooks"
import { Spinner } from "@/components/spinner"

export function PreferencesSettings() {
  const {
    settings: { data: settings, isLoading: isSettingsLoading },
    setUserLocale: { isPending: isLocaleUpdating, mutateAsync: setUserLocale }
  } = useUserSettings();

  const { currentTheme, switchTheme, isUpdating: isThemeUpdating } = useThemeManager();

  const [localTheme, setLocalTheme] = useState<string>("system")
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (settings) {
      setLocalTheme(settings.theme ?? "system")
      setLanguage(settings.language ?? "en")
    }
  }, [settings])

  useEffect(() => {
    if (currentTheme && currentTheme !== localTheme) {
      setLocalTheme(currentTheme);
    }
  }, [currentTheme, localTheme]);

  const updating = isThemeUpdating || isLocaleUpdating;

  if (!mounted) return null;

  const handleThemeChange = (newTheme: string) => {
    setLocalTheme(newTheme);
    switchTheme(newTheme);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);

    try {
      await setUserLocale(newLanguage);
      toast.success("Language updated successfully!");
    } catch {
      setLanguage(language);
      toast.error("Failed to update language. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={localTheme} onValueChange={handleThemeChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {localesInfo.map(loc =>
                <SelectItem key={loc.code} value={loc.code}>
                  {loc.name}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Status */}
      <div className="flex justify-end">
        <Button disabled={updating || isSettingsLoading}>
          {updating && <Spinner />}
          {updating ? "Updating..." : "All changes saved automatically"}
        </Button>
      </div>
    </div>
  )
}
