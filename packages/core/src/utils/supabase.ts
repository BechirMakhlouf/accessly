import type { PostgrestError } from "@supabase/supabase-js";

export type RlsErrorInfo = {
  isRls: boolean;
  policyName: string | null;
  table: string | null;
  operation: "select" | "insert" | "update" | "delete" | null;
  code: string | null;
  message: string | null;
};

export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value == null;
}

export function isRlsError(
  error: PostgrestError | null | undefined,
): RlsErrorInfo {
  if (isNullOrUndefined(error)) {
    return {
      isRls: false,
      policyName: null,
      table: null,
      operation: null,
      code: null,
      message: null,
    };
  }

  const message = [error.message, error.details, error.hint]
    .filter((v): v is string => Boolean(v))
    .join(" | ");

  const lower = message.toLowerCase();
  const code = error.code ?? null;
  const possibleRls =
    code === "42501" ||
    lower.includes("row-level security") ||
    lower.includes("rls") ||
    lower.includes("violates row-level security policy") ||
    lower.includes("permission denied for table") ||
    (lower.includes("policy") && lower.includes("denied"));

  if (!possibleRls) {
    return {
      isRls: false,
      policyName: null,
      table: null,
      operation: null,
      code,
      message: error.message ?? null,
    };
  }

  const policyMatch = message.match(/policy\s+"([^"]+)"/i);
  const policyName = policyMatch?.[1] ?? null;

  const tableMatch = message.match(/for\s+table\s+"?([a-zA-Z0-9_.]+)"?/i);
  const table = tableMatch?.[1] ?? null;

  let operation: RlsErrorInfo["operation"] = null;
  if (/(^|\s)select(\s|$)|query violates/i.test(message)) operation = "select";
  else if (/new row violates/i.test(message)) operation = "insert";
  else if (/update/i.test(message)) operation = "update";
  else if (/delete/i.test(message)) operation = "delete";

  return {
    isRls: true,
    policyName,
    table,
    operation,
    code,
    message: error.message ?? null,
  };
}

export function isDuplicateKeyError(
  error: PostgrestError | null | undefined,
): boolean {
  if (isNullOrUndefined(error)) {
    return false;
  }

  const code = error.code;
  const message = error.message?.toLowerCase() ?? "";

  return (
    code === "23505" ||
    message.includes("duplicate key") ||
    message.includes("unique constraint") ||
    message.includes("already exists")
  );
}
