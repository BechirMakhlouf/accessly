"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createOrgWithoutSlug } from "../actions";
import { toast } from "sonner";
import { routes } from "@/lib/routes";

export function NewOrgForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Organization name is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createOrgWithoutSlug({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon_url: formData.icon_url.trim() || null,
      });

      if (result?.data) {
        toast.success("Organization created successfully!");
        router.push(routes.protected.dashboard.org.slug.root(result.data.slug || ""));
      } else {
        toast.error("Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("An error occurred while creating the organization");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Organization</CardTitle>
          <CardDescription>
            Set up a new organization to collaborate with your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter organization name"
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed to your team members and used to generate a unique URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this organization is for"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Optional: Help your team understand the purpose of this organization.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_url">Icon URL</Label>
              <Input
                id="icon_url"
                type="url"
                value={formData.icon_url}
                onChange={(e) => handleInputChange("icon_url", e.target.value)}
                placeholder="https://example.com/icon.png"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Add a custom icon for your organization.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
