"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUpdateOrganization } from "../hooks"
import { useActiveOrganization } from "../hooks"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export function OrgSettings() {
  const { activeOrganization: org } = useActiveOrganization();
  const updateOrg = useUpdateOrganization();
  const t = useTranslations('organizations');
  
  const [teamName, setTeamName] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [iconBgColor] = useState("bg-blue-500")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with current organization data
  useEffect(() => {
    if (org) {
      setTeamName(org.name || "")
      setIconUrl(org.icon_url || "")
      setDescription(org.description || "")
    }
  }, [org])

  const handleSaveChanges = async () => {
    if (!org) return;
    
    setIsLoading(true);
    
    try {
      const result = await updateOrg.mutateAsync({
        orgId: org.id,
        updates: {
          name: teamName,
          icon_url: iconUrl,
          description: description,
        }
      });
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('actions.updated'));
      }
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
              <AvatarFallback className="text-foreground text-lg">{getFallbackText(teamName)}</AvatarFallback>
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
          <Label htmlFor="teamName">{t('settings.name.label')}</Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
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
          disabled={isLoading || updateOrg.isPending}
        >
          {isLoading || updateOrg.isPending ? t('settings.buttons.saving') : t('settings.buttons.saveChanges')}
        </Button>
      </CardFooter>
    </Card>
  )
}