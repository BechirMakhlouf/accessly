"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
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
import { Checkbox } from "@/components/ui/checkbox";
import type { AccessableType } from "../types";
import { ACCESSABLE_SERVICES } from "../types";
import { getServiceLabel } from "../service-icons";

interface MetadataFieldsProps {
  type: AccessableType;
}

function ServiceField() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <FormField
      control={form.control}
      name="metadata.service"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("service.label")}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t("service.placeholder")} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-60">
              {ACCESSABLE_SERVICES.map((service) => (
                <SelectItem key={service} value={service}>
                  {getServiceLabel(service)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function SharedAccountFields() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <>
      <ServiceField />
      <FormField
        control={form.control}
        name="metadata.username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("username.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("username.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="metadata.password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("password.label")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("password.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="metadata.twoFactorEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t("twoFactorEnabled.label")}</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}

function DatabaseFields() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <>
      <ServiceField />
      <FormField
        control={form.control}
        name="metadata.connectionString"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("connectionString.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("connectionString.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="metadata.host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("host.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("host.placeholder")}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metadata.port"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("port.label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("port.placeholder")}
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="metadata.databaseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("databaseName.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("databaseName.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ApiKeyFields() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <>
      <ServiceField />
      <FormField
        control={form.control}
        name="metadata.key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("apiKey.label")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("apiKey.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="metadata.secret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("apiSecret.label")}</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder={t("apiSecret.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="metadata.environment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("environment.label")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("environment.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="production">
                  {t("environment.production")}
                </SelectItem>
                <SelectItem value="staging">
                  {t("environment.staging")}
                </SelectItem>
                <SelectItem value="development">
                  {t("environment.development")}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function DocumentFields() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <>
      <ServiceField />
      <FormField
        control={form.control}
        name="metadata.fileUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fileUrl.label")}</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder={t("fileUrl.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function ServiceFields() {
  const form = useFormContext();
  const t = useTranslations("accessables.form.metadata");
  return (
    <>
      <ServiceField />
      <FormField
        control={form.control}
        name="metadata.endpoint"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("endpoint.label")}</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder={t("endpoint.placeholder")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="metadata.authMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("authMethod.label")}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t("authMethod.placeholder")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="api_key">
                  {t("authMethod.api_key")}
                </SelectItem>
                <SelectItem value="oauth">{t("authMethod.oauth")}</SelectItem>
                <SelectItem value="basic">{t("authMethod.basic")}</SelectItem>
                <SelectItem value="bearer">{t("authMethod.bearer")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

export function MetadataFields({ type }: MetadataFieldsProps) {
  switch (type) {
    case "shared_account":
      return <SharedAccountFields />;
    case "database":
      return <DatabaseFields />;
    case "api_key":
      return <ApiKeyFields />;
    case "document":
      return <DocumentFields />;
    case "service":
      return <ServiceFields />;
    default:
      return null;
  }
}
