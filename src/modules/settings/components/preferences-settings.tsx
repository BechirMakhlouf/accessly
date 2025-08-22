"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { localesInfo } from "@/lib/i18n/config"
import { useUserSettings } from "../hooks"

import { Spinner } from "@/components/spinner"


export function PreferencesSettings() {
  // Get the settings
  const {
    settings: { data: settings, isLoading: isSettingsLoading },
    setSettings: { isPending, mutateAsync: setSettings }
  } = useUserSettings();

  // Hydrate local state on settings fetch
  const [theme, setTheme] = useState<string>("system")
  const [language, setLanguage] = useState("en")
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (settings) {
      setTheme(settings.theme ?? "system")
      setLanguage(settings.language ?? "en")
    }
  }, [settings])

  const updating = isPending;

  if (!mounted)
    return <></>

  const handleSavePreferences = async () => {
    if (!settings) return;

    await setSettings({ theme, language, id: settings.id }, {
      onSuccess: () => toast.success("Preferences updated successfully!"),
      onError: () => toast.error("Failed to update preferences. Please try again.")
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme for the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="" value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language for the interface.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage} >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {localesInfo.map(loc =>
                  <SelectItem key={loc.code} value={loc.code}>{loc.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSavePreferences} disabled={updating || isSettingsLoading}>
          {updating ?? <Spinner />}
          Save Changes</Button>
      </div>
    </div>
  )
}
