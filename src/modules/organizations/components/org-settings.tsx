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

export function OrgSettings() {
  const { activeOrganization: org } = useActiveOrganization();
  const updateOrg = useUpdateOrganization();
  
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
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
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
          <p className="text-center text-muted-foreground">Organization not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your organization&apos;s basic information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Organization Icon</Label>
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
                placeholder="Enter icon URL"
              />
              <Button 
                variant="outline" 
                onClick={() => toast.info("Icon upload functionality coming soon")}
              >
                Change Icon
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamName">Organization Name</Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter organization name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your organization"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button 
          onClick={handleSaveChanges} 
          disabled={isLoading || updateOrg.isPending}
        >
          {isLoading || updateOrg.isPending ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}