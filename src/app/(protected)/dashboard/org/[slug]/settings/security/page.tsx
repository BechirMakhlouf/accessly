import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription>Enhance your organization&apos;s security by enforcing 2FA for all members.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enforce-2fa" className="text-base font-semibold">
                Enforce 2FA for all users
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, all members will be required to set up 2FA to access the organization.
              </p>
            </div>
            <Switch id="enforce-2fa" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
