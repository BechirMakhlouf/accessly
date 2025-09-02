"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useActiveOrganization } from "../hooks/use-active-organization"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { createOrgNameSchema, type OrgNameFormData } from "../schemas"
import { isAdminRole } from "../utils"

export function OrgNameSettings() {
  const { activeOrganization: org, updateOrganization, isUpdating, currentUserRole } = useActiveOrganization();
  const t = useTranslations();
  
  const canEditName = currentUserRole && isAdminRole(currentUserRole);
  
  const orgNameSchema = createOrgNameSchema(t);
  
  const form = useForm<OrgNameFormData>({
    resolver: zodResolver(orgNameSchema),
    defaultValues: {
      name: org?.name || "",
    },
  });

  // Update form when org changes
  useEffect(() => {
    if (org?.name) {
      form.setValue("name", org.name);
    }
  }, [org?.name, form]);

  const onSubmit = async (data: OrgNameFormData) => {
    if (!org || !canEditName) return;

    if (data.name === org.name) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateOrganization({
        name: data.name,
      });
      
      toast.success("Organization name updated successfully");
    } catch (error) {
      console.error("Failed to update organization name:", error);
      toast.error("Failed to update organization name");
    }
  };

  if (!org) {
    return null;
  }

  return (
    <Card>
              <CardHeader>
        <CardTitle>{t("org.settings.general.orgName.title")}</CardTitle>
        <CardDescription>
          {t("org.settings.general.orgName.description")}
          {!canEditName && " Only organization admins can change the name."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("org.settings.general.orgName.label")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter organization name"
                      disabled={!canEditName}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.name && form.formState.errors.name.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={!canEditName || isUpdating || !form.formState.isValid || form.watch("name") === org.name}
        >
          {isUpdating ? "Saving..." : t("org.settings.general.orgName.saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}
