"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useActiveOrg } from "@/modules/organizations/provider"
import { useTranslations } from "next-intl"

export default function SecuritySettingsPage() {
  const { org } = useActiveOrg();
  const t = useTranslations("org.settings.security");
  const [enforce2FA, setEnforce2FA] = useState(false);

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  const handle2FAToggle = (enabled: boolean) => {
    setEnforce2FA(enabled);
    // Here you would typically send an API request to update the organization's 2FA policy
    console.log("Updating 2FA policy:", { orgId: org.id, enforce2FA: enabled });
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("twoFactorAuth.title")}</CardTitle>
          <CardDescription>{t("twoFactorAuth.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enforce-2fa" className="text-base font-semibold">
                {t("twoFactorAuth.enforceLabel")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("twoFactorAuth.enforceDescription")}
              </p>
            </div>
            <Switch 
              id="enforce-2fa" 
              checked={enforce2FA}
              onCheckedChange={handle2FAToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
