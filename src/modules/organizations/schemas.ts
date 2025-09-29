import { z } from "zod";
import type { TranslationFunction } from "@/lib/i18n";

// --- SLUG ---
export const createOrgSlugSchema = (t: TranslationFunction) =>
  z.object({
    slug: z
      .string()
      .min(2, t("org.settings.general.orgSlug.errors.minLength"))
      .max(50, t("org.settings.general.orgSlug.errors.maxLength"))
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        t("org.settings.general.orgSlug.errors.invalidFormat")
      )
      .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
        message: t("org.settings.general.orgSlug.errors.noHyphensAtEnds"),
      }),
  });


export const createOrgDetailsSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(2, t("org.settings.general.org.errors.minLength"))
      .max(100, t("org.settings.general.org.errors.maxLength"))
      .trim(),

    description: z
      .string()
      .max(500, t("org.settings.general.orgDescription.errors.maxLength"))
      .optional()
      .or(z.literal("")), 
  });


// --- DELETE ---
export const createDeleteOrgConfirmationSchema = () =>
  z.object({
    confirmName: z.string(),
  });

// --- TYPES ---
export type OrgSlugFormData = z.infer<ReturnType<typeof createOrgSlugSchema>>;
export type OrgDetailsFormData = z.infer<
  ReturnType<typeof createOrgDetailsSchema>
>;
export type DeleteOrgConfirmationFormData = z.infer<
  ReturnType<typeof createDeleteOrgConfirmationSchema>
>;
