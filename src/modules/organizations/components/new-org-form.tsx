"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUserOrganizations } from "../hooks/use-user-organizations";
import { toast } from "sonner";
import { routes } from "@/lib/routes";

export function NewOrgForm() {
  const router = useRouter();
  const t = useTranslations();
  const { createOrganization, isCreating } = useUserOrganizations();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_url: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(t("organizations.form.errors.nameRequired"));
      return;
    }

    try {
      const result = await createOrganization({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        icon_url: formData.icon_url.trim() || null,
      });

      if (result?.data) {
        toast.success(t("organizations.form.success"));
        router.push(routes.protected.dashboard.org.slug.root(result.data.slug || ""));
      } else {
        toast.error(t("organizations.form.errors.createFailed"));
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error(t("organizations.form.errors.genericError"));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("organizations.form.title")}</CardTitle>
          <CardDescription>
            {t("organizations.form.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("organizations.form.name.label")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("organizations.form.name.placeholder")}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {t("organizations.form.name.helpText")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("organizations.form.description.label")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={t("organizations.form.description.placeholder")}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {t("organizations.form.description.helpText")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_url">{t("organizations.form.iconUrl.label")}</Label>
              <Input
                id="icon_url"
                type="url"
                value={formData.icon_url}
                onChange={(e) => handleInputChange("icon_url", e.target.value)}
                placeholder={t("organizations.form.iconUrl.placeholder")}
              />
              <p className="text-xs text-muted-foreground">
                {t("organizations.form.iconUrl.helpText")}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isCreating}
              >
                {t("organizations.form.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !formData.name.trim()}
                className="flex-1"
              >
                {isCreating ? t("organizations.form.buttons.creating") : t("organizations.form.buttons.create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
