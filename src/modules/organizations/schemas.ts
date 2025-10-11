import { z } from "zod";
import type { TranslationFunction } from "@/lib/i18n";

// Function to create localized organization name schema
export const createOrgNameSchema = (t: TranslationFunction) => {
  return z.object({
    name: z
      .string()
      .min(2, t("org.settings.general.orgName.errors.minLength"))
      .max(100, t("org.settings.general.orgName.errors.maxLength"))
      .trim()
      .refine((val) => val.length > 0, t("org.settings.general.orgName.errors.required")),
  });
};

// Function to create localized organization slug schema
export const createOrgSlugSchema = (t: TranslationFunction) => {
  return z.object({
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
};

export const createOrgDetailsSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(2, t("org.settings.general.org.errors.minLength"))
      .max(100, t("org.settings.general.org.errors.maxLength"))
      .trim(),

    description: z
      .string()
  });
};

// Type exports
export type OrgNameFormData = {
  name: string;
};

export type OrgSlugFormData = {
  slug: string;
};

export type DeleteOrgConfirmationFormData = {
  confirmName: string;
};
