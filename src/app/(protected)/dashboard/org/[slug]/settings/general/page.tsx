"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useActiveOrganization } from "@/modules/organizations"
import { useTranslations } from "next-intl"

export default function GeneralSettingsPage() {
  const { activeOrganization: org } = useActiveOrganization();
  const t = useTranslations("org.settings.general");
  const [orgName, setOrgName] = useState(org?.name || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!org) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Organization not found</h1>
        </div>
      </div>
    );
  }

  const handleSaveChanges = () => {
    // Here you would typically send an API request to update the organization
    console.log("Saving organization changes:", { name: orgName });
    // You could add a toast notification here
  };

  const handleDeleteOrganization = () => {
    // Here you would typically send an API request to delete the organization
    console.log("Deleting organization:", org.id);
    setIsDeleteDialogOpen(false);
    // You could add a toast notification here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("orgName.title")}</CardTitle>
          <CardDescription>{t("orgName.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="org-name">{t("orgName.label")}</Label>
            <Input 
              id="org-name" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSaveChanges}>{t("orgName.saveChanges")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("orgSlug.title")}</CardTitle>
          <CardDescription>
            {t("orgSlug.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="org-slug">{t("orgSlug.label")}</Label>
            <Input id="org-slug" value={org.slug} disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled>{t("orgSlug.saveChanges")}</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("dangerZone.title")}</CardTitle>
          <CardDescription>{t("dangerZone.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{t("dangerZone.deleteOrg.title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("dangerZone.deleteOrg.description")}
                </p>
              </div>
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">{t("dangerZone.deleteOrg.button")}</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t("dangerZone.deleteOrg.confirmTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("dangerZone.deleteOrg.confirmDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      {t("dangerZone.deleteOrg.cancel")}
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteOrganization}>
                      {t("dangerZone.deleteOrg.confirm")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
