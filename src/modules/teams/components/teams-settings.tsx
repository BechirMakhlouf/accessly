"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TeamSettings() {
  const [teamName, setTeamName] = useState("Acme Inc.")
  const [iconUrl, setIconUrl] = useState("/placeholder.svg?height=64&width=64")
  const [iconBgColor] = useState("bg-blue-500")
  const [iconDescription, setIconDescription] = useState("The official icon for Acme Inc. team.")

  const handleSaveChanges = () => {
    console.log("Saving changes:", { teamName, iconUrl, iconBgColor, iconDescription })
    // In a real application, you would send this data to your backend.
  }

  const getFallbackText = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Manage your team&apos;s basic information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Team Icon</Label>
          <div className="flex items-center gap-4">
            <Avatar className={`h-16 w-16 ${iconBgColor}`}>
              <AvatarImage src={iconUrl || "/placeholder.svg"} alt="Team Icon" />
              <AvatarFallback className="text-white text-lg">{getFallbackText(teamName)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2">
              <Input
                id="iconUrl"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="Enter icon URL"
              />
              <Button variant="outline" onClick={() => alert("Upload icon functionality not implemented.")}>
                Change Icon
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="Team Description">Team Description</Label>
          <Textarea
            id="iconDescription"
            value={iconDescription}
            onChange={(e) => setIconDescription(e.target.value)}
            placeholder="Describe your team icon"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={handleSaveChanges}>Save changes</Button>
      </CardFooter>
    </Card>
  )
}
