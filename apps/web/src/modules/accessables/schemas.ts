import { z } from "zod";
import type { TranslationFunction } from "@/lib/i18n";
import { ACCESSABLE_TYPES, ACCESSABLE_SERVICES } from "./types";

const baseMetadataSchema = z.object({
  service: z.enum(ACCESSABLE_SERVICES).optional(),
  iconUrl: z.string().url().optional().or(z.literal("")),
  accessGuide: z.string().optional(),
  notes: z.string().optional(),
});

const sharedAccountMetadataSchema = baseMetadataSchema.extend({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  recoveryEmail: z.string().email().optional().or(z.literal("")),
  twoFactorEnabled: z.boolean().optional(),
  twoFactorMethod: z.string().optional(),
});

const databaseMetadataSchema = baseMetadataSchema.extend({
  host: z.string().optional(),
  port: z.coerce.number().optional(),
  databaseName: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  connectionString: z.string().optional(),
  sslRequired: z.boolean().optional(),
});

const apiKeyMetadataSchema = baseMetadataSchema.extend({
  key: z.string().optional(),
  secret: z.string().optional(),
  environment: z.enum(["production", "staging", "development"]).optional(),
  expiresAt: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

const documentMetadataSchema = baseMetadataSchema.extend({
  fileUrl: z.string().url().optional().or(z.literal("")),
  mimeType: z.string().optional(),
});

const serviceMetadataSchema = baseMetadataSchema.extend({
  endpoint: z.string().url().optional().or(z.literal("")),
  authMethod: z.enum(["api_key", "oauth", "basic", "bearer"]).optional(),
});

export const metadataSchemas = {
  shared_account: sharedAccountMetadataSchema,
  database: databaseMetadataSchema,
  api_key: apiKeyMetadataSchema,
  document: documentMetadataSchema,
  service: serviceMetadataSchema,
};

export const createAccessableSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("accessables.form.errors.nameRequired"))
      .max(100, t("accessables.form.errors.nameTooLong")),
    type: z.enum(ACCESSABLE_TYPES, {
      error: t("accessables.form.errors.typeRequired"),
    }),
    description: z
      .string()
      .max(500, t("accessables.form.errors.descriptionTooLong"))
      .optional(),
    url: z
      .string()
      .url(t("accessables.form.errors.invalidUrl"))
      .optional()
      .or(z.literal("")),
    metadata: z
      .union([
        sharedAccountMetadataSchema,
        databaseMetadataSchema,
        apiKeyMetadataSchema,
        documentMetadataSchema,
        serviceMetadataSchema,
      ])
      .optional(),
  });

export const updateAccessableSchema = (t: TranslationFunction) =>
  z.object({
    name: z
      .string()
      .min(1, t("accessables.form.errors.nameRequired"))
      .max(100, t("accessables.form.errors.nameTooLong"))
      .optional(),
    type: z
      .enum(ACCESSABLE_TYPES, {
        error: t("accessables.form.errors.typeRequired"),
      })
      .optional(),
    description: z
      .string()
      .max(500, t("accessables.form.errors.descriptionTooLong"))
      .optional()
      .nullable(),
    url: z
      .string()
      .url(t("accessables.form.errors.invalidUrl"))
      .optional()
      .nullable()
      .or(z.literal("")),
  });

export type CreateAccessableFormData = z.infer<
  ReturnType<typeof createAccessableSchema>
>;
export type UpdateAccessableFormData = z.infer<
  ReturnType<typeof updateAccessableSchema>
>;
