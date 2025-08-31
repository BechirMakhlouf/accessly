"use client";

import { useActiveOrganization } from "@/modules/organizations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Activity, Settings, UserPlus } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { useOrganizationMembers } from "@/modules/organizations";

export default function OrgPage() {
  const { activeOrganization } = useActiveOrganization();
  const t = useTranslations("org.overview");
  
  const { data: membersData } = useOrganizationMembers(activeOrganization?.id || "");
  const memberCount = membersData?.data?.length || 0;

  if (!activeOrganization) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{activeOrganization.name}</h1>
            <p className="text-muted-foreground">{activeOrganization.description || t("description")}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={routes.protected.dashboard.org.slug.members(activeOrganization.slug)}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t("membersCount", { count: memberCount.toString() })}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={routes.protected.dashboard.org.slug.settings.root(activeOrganization.slug)}>
                <Settings className="h-4 w-4 mr-2" />
                {t("settings")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.totalMembers.title")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{memberCount}</div>
              <p className="text-xs text-muted-foreground">{t("stats.totalMembers.description")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.created.title")}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(activeOrganization.created_at)}</div>
              <p className="text-xs text-muted-foreground">{t("createdAt", { date: formatDate(activeOrganization.created_at) })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("stats.lastActive.title")}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDate(activeOrganization.updated_at)}</div>
              <p className="text-xs text-muted-foreground">{t("lastActive", { date: formatDate(activeOrganization.updated_at) })}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions.title")}</CardTitle>
            <CardDescription>{t("quickActions.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Link href={routes.protected.dashboard.org.slug.members(activeOrganization.slug)}>
                  <Users className="h-6 w-6 mb-2" />
                  <span className="font-medium">{t("quickActions.manageMembers.title")}</span>
                  <span className="text-sm text-muted-foreground">{t("quickActions.manageMembers.description")}</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start">
                <Link href={routes.protected.dashboard.org.slug.settings.root(activeOrganization.slug)}>
                  <Settings className="h-6 w-6 mb-2" />
                  <span className="font-medium">{t("quickActions.orgSettings.title")}</span>
                  <span className="text-sm text-muted-foreground">{t("quickActions.orgSettings.description")}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
