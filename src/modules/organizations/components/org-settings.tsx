"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useActiveOrganization } from "../hooks/use-active-organization"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function OrgSettings() {
  const { organization: org, updateOrganization, isUpdating } = useActiveOrganization();
  const t = useTranslations('organizations');
  
  const [orgName, setOrgName] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [iconBgColor] = useState("bg-blue-500")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with current organization data
  useEffect(() => {
    if (org) {
      setOrgName(org.name || "")
      setIconUrl(org.icon_url || "")
      setDescription(org.description || "")
    }
  }, [org])

  const handleSaveChanges = async () => {
    if (!org) return;
    
    setIsLoading(true);
    
    try {
      await updateOrganization({
        name: orgName,
        icon_url: iconUrl,
        description: description,
      });
      
      toast.success(t('actions.updated'));
    } catch (error) {
      console.error("Failed to save changes:", error);
      toast.error(t('actions.updateError'));
    } finally {
      setIsLoading(false);
    }
  }

  const getFallbackText = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  }

  if (!org) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">{t('settings.notFound')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.title')}</CardTitle>
        <CardDescription>{t('settings.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>{t('settings.icon.label')}</Label>
          <div className="flex items-center gap-4">
            <Avatar className={`h-16 w-16 ${iconBgColor}`}>
              <AvatarImage src={iconUrl || "/placeholder.svg"} alt="Organization Icon" />
              <AvatarFallback className="text-foreground text-lg">{getFallbackText(orgName)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2">
              <Input
                id="iconUrl"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder={t('settings.icon.placeholder')}
              />
              <Button 
                variant="outline" 
                onClick={() => toast.info(t('settings.icon.uploadComingSoon'))}
              >
                {t('settings.icon.changeButton')}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgName">{t('settings.name.label')}</Label>
          <Input
            id="orgName"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder={t('settings.name.placeholder')}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">{t('settings.description.label')}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('settings.description.placeholder')}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button 
          onClick={handleSaveChanges} 
          disabled={isLoading || isUpdating}
        >
          {isLoading || isUpdating ? t('settings.buttons.saving') : t('settings.buttons.saveChanges')}
        </Button>
      </CardFooter>
</Card>
  )
}