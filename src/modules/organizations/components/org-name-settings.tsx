"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useActiveOrg } from "@/modules/organizations"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { isAdminRole } from "../utils"
import { createOrgDetailsSchema, OrgDetailsFormData } from "@/lib/schemas/orgSchemas" // ajuste ton chemin

export function OrgDetailsSettings() {
  const { activeOrganization: org, updateOrganization, isUpdating, currentUserRole } = useActiveOrg();
  const t = useTranslations();

  const canEdit = currentUserRole && isAdminRole(currentUserRole);

  const form = useForm<OrgDetailsFormData>({
    resolver: zodResolver(createOrgDetailsSchema(t)),
    defaultValues: {
      name: org?.name || "",
      description: org?.description || "",
    },
  });

  // Sync values si org change
  useEffect(() => {
    if (org) {
      form.reset({
        name: org.name,
        description: org.description || "",
      });
    }
  }, [org, form]);

  const onSubmit = async (data: OrgDetailsFormData) => {
    if (!org || !canEdit) return;

    if (data.name === org.name && data.description === (org.description || "")) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateOrganization({
        name: data.name,
        description: data.description || null,
      });

      toast.success("Organization details updated successfully");
    } catch (error) {
      console.error("Failed to update organization details:", error);
      toast.error("Failed to update organization details");
    }
  };

  if (!org) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("org.settings.general.orgDetails.title")}</CardTitle>
        <CardDescription>
          {t("org.settings.general.orgDetails.description")}
          {!canEdit && " Only organization admins can change details."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* --- Name --- */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("org.settings.general.orgName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      disabled={!canEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- Description --- */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("org.settings.general.orgDescription.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description (optional)"
                      disabled={!canEdit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={
            !canEdit ||
            isUpdating ||
            !form.formState.isValid ||
            (form.watch("name") === org.name && form.watch("description") === (org.description || ""))
          }
        >
          {isUpdating ? "Saving..." : t("org.settings.general.orgDetails.saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}
