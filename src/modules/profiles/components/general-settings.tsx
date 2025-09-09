"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import { useUserProfile } from "../hooks/useUserProfile";

export function GeneralSettings() {
  const [fullName, setFullName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    profile: { data: profile, isLoading: isProfileLoading },
    setUserAvatar: { mutate: setUserAvatar, isPending: isAvatarUploading },
    setFullName: { mutate: setFullNameMutation, isPending: isUpdatingProfile },
  } = useUserProfile();

  const [mounted, setMounted] = useState(false);

  console.log("profile: ", profile);
  useEffect(() => {
    setFullName((fullName) => profile?.full_name ?? fullName);
  }, [profile]);
  useEffect(() => setMounted(true), []);

  const handleAvatarUpload = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUserAvatar({ file });
    event.target.value = "";
  };

  const handleAvatarDelete = () => {
    setUserAvatar({ file: undefined }, {
      onSuccess: () => toast("Avatar deleted successfully!"),
      onError: () => toast("Failed to delete Avatar!"),
    });
  };

  const handleSaveDisplayName = () => {
    setFullNameMutation(fullName, {
      onSuccess: () => toast("Name updated successfully!"),
      onError: () => toast("Failed to update name!"),
    });
  };

  if (!mounted) return <></>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Upload or delete your profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border border-border">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>
                {isAvatarUploading || isProfileLoading
                  ? <Skeleton className="w-full h-full" />
                  : <h1 className="text-2xl">{fullName.slice(0, 2)}</h1>}
              </AvatarFallback>
            </Avatar>
            <div className="space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                onClick={handleAvatarUpload}
                disabled={isAvatarUploading || isProfileLoading}
              >
                {isAvatarUploading
                  ? <Spinner />
                  : <Upload className="mr-2 h-4 w-4" />}
                Upload
              </Button>
              <Button
                variant="outline"
                onClick={handleAvatarDelete}
                disabled={isProfileLoading || !profile?.avatar_url}
              >
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
          <CardDescription>
            This is the name that will be displayed on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveDisplayName} disabled={isUpdatingProfile}>
            {isUpdatingProfile && <Spinner />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
