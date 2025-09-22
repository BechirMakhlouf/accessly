"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Plus } from "lucide-react";
import { TranslationFunction } from "@/lib/i18n/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useActiveOrgBoards } from "../hooks/useOrgBoards";

// Validation schema factory
const createBoardSchema = (t: TranslationFunction) =>
  z.object({
    title: z
      .string()
      .min(3, t("boards.form.errors.nameTooShort"))
      .max(100, t("boards.form.errors.nameTooLong")),
    description: z
      .string()
      .max(500, t("boards.form.errors.descriptionTooLong"))
      .optional(),
    visibility: z.enum(["public", "private"] as const, {
      error: t("boards.form.errors.visibilityRequired"),
    }),
  });

type CreateBoardFormData = z.infer<ReturnType<typeof createBoardSchema>>;

interface CreateBoardModalProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateBoardModal(
  { trigger, onSuccess }: CreateBoardModalProps,
) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { createBoard, isCreating, activeOrganization } = useActiveOrgBoards();

  const form = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema(t)),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  });

  const onSubmit = async (data: CreateBoardFormData) => {
    if (!activeOrganization?.id) {
      console.error("No active organization");
      return;
    }

    try {
      await createBoard({
        title: data.title,
        description: data.description || null,
        visibility: data.visibility,
        slug: "",
        organization_id: activeOrganization.id,
        // organization_id and created_by will be set by the hook
      });

      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create board:", error);
      // Error handling is done by the hook
    }
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Plus className="h-4 w-4" />
      {t("boards.actions.create")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("boards.form.title")}</DialogTitle>
          <DialogDescription>
            {t("boards.form.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("boards.form.name.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("boards.form.name.helpText")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.form.description.label")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("boards.form.description.placeholder")}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("boards.form.description.helpText")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("boards.form.visibility.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("boards.form.visibility.label")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">
                        {t("boards.form.visibility.private")}
                      </SelectItem>
                      <SelectItem value="public">
                        {t("boards.form.visibility.public")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("boards.form.visibility.helpText")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isCreating}
              >
                {t("boards.form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating
                  ? t("boards.form.buttons.creating")
                  : t("boards.form.buttons.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
