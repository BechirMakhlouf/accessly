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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveOrg } from "@/modules/organizations";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { createOrgDetailsSchema } from "../schemas";
import { isAdminRole } from "../utils";

export type OrgDetailsFormData = z.infer<ReturnType<typeof createOrgDetailsSchema>>;

export function OrgDetailsSettings() {
  const {
    activeOrganization: org,
    updateOrganization,
    isUpdating,
    currentUserRole,
  } = useActiveOrg();

  const t = useTranslations("org.settings.general");
  const tSchema = useTranslations();

  const isAdmin = currentUserRole && isAdminRole(currentUserRole);

  const form = useForm<OrgDetailsFormData>({
    resolver: zodResolver(createOrgDetailsSchema(tSchema)),
    defaultValues: {
      name: org?.name ?? "",
      description: org?.description ?? "",

    },
    mode: "onChange", 
  });

  useEffect(() => {
    if (org) {
      form.reset({
        name: org.name ?? "",
        description: org.description ?? "",
      });
    }
  }, [org, form]);

  const onSubmit = async (data: OrgDetailsFormData) => {
    if (!org || !isAdmin) return;

    if (data.name === org.name && data.description === org.description) {
      toast.info("No changes to save");
      return;
    }

    try {
      await updateOrganization(data);
      toast.success("Organization details updated successfully");
    } catch (e) {
      console.error("Failed to update organization details:", e);
      toast.error("Failed to update organization details");
    }
  };

  if (!org) return null;

  
  const hasChanges =
    form.watch("name") !== org.name ||
    form.watch("description") !== org.description;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {!isAdmin && " Only admins can update organization details."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("org.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
                      disabled={!isAdmin}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("orgDescription.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter organization description"
                      disabled={!isAdmin}
                      className="min-h-[100px]"
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

      <CardFooter>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={!isAdmin || isUpdating || !form.formState.isValid || !hasChanges}
            >
              {isUpdating ? t("org.saving") : t("org.saveChanges")}
            </Button>
          </TooltipTrigger>
          {!isAdmin && (
            <TooltipContent>
              <p>{t("orgSlug.adminTooltip")}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
