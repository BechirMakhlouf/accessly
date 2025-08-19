"use client";

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useUserSettings } from "../hooks";
import { Spinner } from "@/components/spinner";

export function GeneralSettings() {
  const [displayName, setDisplayName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    settings: { data: settings, isLoading: isSettingsLoading },
    setUserAvatar: { mutate: setUserAvatar, isPending: isAvatarUploading },
    setSettings: { /* mutate: setSettings, */ isPending: isUpdatingSettings }
  } = useUserSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDisplayName((displayName) => settings?.id ?? displayName)
  }, [settings])
  useEffect(() => setMounted(true), [])

  const handleAvatarUpload = async () => {
    fileInputRef.current?.click();
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    setUserAvatar({ file });
    // Reset input value to allow selecting the same file again
    event.target.value = ""
  }
  const handleAvatarDelete = () => {
    setUserAvatar({ file: undefined })
    toast("Avatar deleted successfully!")
  }

  const handleSaveDisplayName = () => {
    // setSettings({ display_name: displayName })
    toast("Display name updated successfully!")
  }


  if (!mounted)
    return <></>
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or delete your profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border border-border">
              <AvatarImage src={settings?.avatar_url || undefined} />
              <AvatarFallback>
                {isAvatarUploading || isSettingsLoading ? <Skeleton className="w-full h-full" /> : <h1 className="text-2xl">{displayName.slice(0, 2)}</h1>}
              </AvatarFallback>
            </Avatar>
            <div className="space-x-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <Button onClick={handleAvatarUpload} disabled={isAvatarUploading || isSettingsLoading}>
                {isAvatarUploading ? <Spinner /> : <Upload className="mr-2 h-4 w-4" />}
                Upload
              </Button>
              <Button variant="outline" onClick={handleAvatarDelete} disabled={isSettingsLoading}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>This is the name that will be displayed on your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <Button onClick={handleSaveDisplayName} disabled={isUpdatingSettings}>
            {isUpdatingSettings ?? <Spinner />}
            Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
