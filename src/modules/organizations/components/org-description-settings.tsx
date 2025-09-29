"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useActiveOrg } from "@/modules/organizations";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { isAdminRole } from "../utils";
import { createOrgDescriptionSchema } from "../schemas";




export type OrgDescriptionFormData = {
  description: string;
};

export function OrgDescriptionSettings() {
  const {
    activeOrganization: org,
    updateOrganization,
    isUpdating,
    currentUserRole,
  } = useActiveOrg();
  const t = useTranslations();

  const canEditDescription = currentUserRole && isAdminRole(currentUserRole);

  const orgDescriptionSchema = createOrgDescriptionSchema(t);

  const form = useForm<OrgDescriptionFormData>({
    resolver: zodResolver(orgDescriptionSchema),
   defaultValues: {
  description: org?.description ?? "",
}
,
  });

  
  useEffect(() => {
    if (org?.description !== undefined) {
      form.setValue("description", org?.description ?? "");

    }
  }, [org?.description, form]);

  const onSubmit = async (data: OrgDescriptionFormData) => {
    if (!org || !canEditDescription) return;

    if (data.description === org.description) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateOrganization({
        description: data.description,
      });

      toast.success("Organization description updated successfully");
    } catch (error) {
      console.error("Failed to update organization description:", error);
      toast.error("Failed to update organization description");
    }
  };

  if (!org) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("org.settings.general.orgDescription.title")}
        </CardTitle>
        <CardDescription>
          {t("org.settings.general.orgDescription.description")}
          {!canEditDescription &&
            " Only organization admins can change the description."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("org.settings.general.orgDescription.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization description"
                      disabled={!canEditDescription}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.description &&
                      form.formState.errors.description.message}
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
          disabled={
            !canEditDescription ||
            isUpdating ||
            !form.formState.isValid ||
            form.watch("description") === org.description
          }
        >
          {isUpdating ? "Saving..." : t("org.settings.general.orgDescription.saveChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}
