"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useActiveOrg, useUserOrgs } from "@/modules/organizations"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"
import type { OrgSlugFormData } from "../schemas";
import { createOrgSlugSchema } from "../schemas";
import { isAdminRole } from "../utils"

export function OrgSlugSettings() {
  const { activeOrganization: org, updateOrganization, isUpdating, currentUserRole } = useActiveOrg();
  const { checkSlugUniqueness, isCheckingSlug } = useUserOrgs();
  const t = useTranslations("org.settings.general");
  const tSchema = useTranslations();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = currentUserRole && isAdminRole(currentUserRole);
  const isEditable = isAdmin && isEditing;

  const orgSlugSchema = createOrgSlugSchema(tSchema);
  
  const form = useForm<OrgSlugFormData>({
    resolver: zodResolver(orgSlugSchema),
    defaultValues: { slug: org?.slug || "" },
  });

  const onSubmit = async (data: OrgSlugFormData) => {
    if (!org || data.slug === org.slug) {
      setIsEditing(false);
      return;
    }

    try {
      // Check slug uniqueness before updating
      const isUnique = await checkSlugUniqueness(data.slug);
      if (!isUnique) {
        form.setError("slug", {
          type: "manual",
          message: t("orgSlug.errors.alreadyTaken")
        });
        return;
      }

      await updateOrganization({ slug: data.slug });
      toast.success(t("orgSlug.success"));
      setIsEditing(false);
      router.push(routes.protected.dashboard.org.slug.settings.general(data.slug));
    } catch (error) {
      console.error("Failed to update organization slug:", error);
      form.setError("slug", {
        type: "manual",
        message: t("orgSlug.updateError")
      });
    }
  };

  const handleCancel = () => {
    form.reset({ slug: org?.slug || "" });
    form.clearErrors();
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  if (!org) return null;

  const isSubmitting = isUpdating || isCheckingSlug;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("orgSlug.title")}</CardTitle>
        <CardDescription>
          {t("orgSlug.description")}
          {!isAdmin && ` ${t("orgSlug.adminOnly")}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("orgSlug.label")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("orgSlug.placeholder")}
                      disabled={!isEditable}
                      {...field}
                      onChange={(e) => {
                        if (!isEditable) return;
                        field.onChange(e.target.value);
                        // Clear any existing errors when user types
                        if (form.formState.errors.slug) {
                          form.clearErrors("slug");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.slug && form.formState.errors.slug.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={isEditable ? form.handleSubmit(onSubmit) : handleStartEdit}
                disabled={isEditable ? (isSubmitting || !form.formState.isValid) : !isAdmin}
              >
                {isEditable 
                  ? (isSubmitting ? t("orgSlug.saving") : t("orgSlug.saveChanges"))
                  : t("orgSlug.changeSlug")
                }
              </Button>
            </TooltipTrigger>
            {!isAdmin && !isEditable && (
              <TooltipContent>
                <p>{t("orgSlug.adminTooltip")}</p>
              </TooltipContent>
            )}
          </Tooltip>
          {isEditable && (
            <Button variant="outline" onClick={handleCancel}>
              {t("orgSlug.cancel")}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
