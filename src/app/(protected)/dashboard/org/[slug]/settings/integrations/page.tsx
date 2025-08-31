"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useActiveOrganization } from "@/modules/organizations"
import { useTranslations } from "next-intl"

export default function IntegrationsSettingsPage() {
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("org.settings.integrations");

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center rounded-md border-dashed text-muted-foreground">
            {t("comingSoon")}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
