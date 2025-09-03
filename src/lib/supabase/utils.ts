import type { PostgrestError } from "@supabase/supabase-js";
import { isNullOrUndefined } from "../utils";

export type RlsErrorInfo = {
	isRls: boolean;
	policyName: string | null;
	table: string | null;
	operation: "select" | "insert" | "update" | "delete" | null;
	code: string | null;
	message: string | null;
};

/**
 * Detect whether a Supabase/PostgREST error was caused by PostgreSQL Row-Level Security (RLS).
 * Attempts to extract the blocking policy name (if it appears in the error text),
 * as well as inferred table and operation.
 */
export function isRlsError(error: PostgrestError | null | undefined): RlsErrorInfo {
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

	// Common indicators for RLS-related failures
	const lower = message.toLowerCase();
	const code = error.code ?? null;
	const possibleRls =
		// Postgres insufficient_privilege (often used for RLS denials)
		code === "42501" ||
		// Message patterns frequently seen from Postgres/RLS
		lower.includes("row-level security") ||
		lower.includes("rls") ||
		lower.includes("violates row-level security policy") ||
		lower.includes("permission denied for table") ||
		lower.includes("policy") && lower.includes("denied");

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

	// Try to extract policy name if it appears quoted in the error text
	// e.g., policy "Members view organization"
	const policyMatch = message.match(/policy\s+"([^"]+)"/i);
	const policyName = policyMatch?.[1] ?? null;

	// Extract table name if present: e.g., ... for table "organization_members"
	const tableMatch = message.match(/for\s+table\s+"?([a-zA-Z0-9_.]+)"?/i);
	const table = tableMatch?.[1] ?? null;

	// Infer the operation from wording
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

/**
 * Detect whether a Supabase/PostgREST error was caused by a duplicate key constraint violation.
 * This is useful for handling unique constraint violations without pre-checking.
 */
export function isDuplicateKeyError(error: PostgrestError | null | undefined): boolean {
	if (isNullOrUndefined(error)) {
		return false;
	}

	const code = error.code;
	const message = error.message?.toLowerCase() ?? "";

	// PostgreSQL unique violation error code
	return code === "23505" || 
		message.includes("duplicate key") ||
		message.includes("unique constraint") ||
		message.includes("already exists");

}