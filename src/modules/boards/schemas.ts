import z from "zod";
import type { TranslationFunction } from "@/lib/i18n";

export const createBoardDetailsSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(2, t("boards.form.errors.nameTooShort"))
      .max(100, t("boards.form.errors.nameTooLong"))
      .trim(),

    description: z
      .string()
      .max(500, t("boards.form.errors.descriptionTooLong"))
      .optional()
      .or(z.literal("")), 
  });

export const createBoardSchema = (t: TranslationFunction) =>
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


  export type BoardDetailsFormData = z.infer<ReturnType<typeof createBoardDetailsSchema>>;