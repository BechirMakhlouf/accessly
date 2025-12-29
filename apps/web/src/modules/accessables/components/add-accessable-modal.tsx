"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus, Loader2 } from "lucide-react";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  createAccessableSchema,
  type CreateAccessableFormData,
} from "../schemas";
import { useAddAccessable } from "../hooks/use-add-accessable";
import { ACCESSABLE_TYPES, type AccessableType } from "../types";
import { MetadataFields } from "./metadata-fields";

const TYPE_LABELS: Record<AccessableType, string> = {
  shared_account: "Shared Account",
  database: "Database",
  api_key: "API Key",
  document: "Document",
  service: "Service",
};

interface AddAccessableModalProps {
  organizationId: string;
  boardId?: string | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddAccessableModal({
  organizationId,
  boardId,
  trigger,
  onSuccess,
}: AddAccessableModalProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const { handleSubmit, isSubmitting } = useAddAccessable({
    organizationId,
    boardId: boardId ?? undefined,
    onSuccess: () => {
      form.reset();
      setOpen(false);
      onSuccess?.();
    },
  });

  const form = useForm<CreateAccessableFormData>({
    resolver: zodResolver(createAccessableSchema(t)),
    defaultValues: {
      name: "",
      type: "shared_account",
      description: "",
      url: "",
    },
  });

  const defaultTrigger = (
    <Button variant="default" size="default" className="gap-2">
      <Plus className="h-4 w-4" />
      {t("accessables.actions.create")}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("accessables.form.createTitle")}</DialogTitle>
          <DialogDescription>
            {t("accessables.form.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("accessables.form.name.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("accessables.form.name.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("accessables.form.type.label")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("accessables.form.type.placeholder")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ACCESSABLE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("accessables.form.description.label")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "accessables.form.description.placeholder",
                      )}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("accessables.form.url.label")}</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder={t("accessables.form.url.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MetadataFields type={form.watch("type")} />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                {t("accessables.form.buttons.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t("accessables.form.buttons.creating")}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("accessables.form.buttons.create")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
