import { TypedSupabaseClient } from "@/lib/supabase/type";
import { AdminRole, Invite, InviteStatus, OrgRole } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

// Generate a unique slug, appending a numeric suffix if needed.
export async function generateUniqueOrganizationSlug(
  supabase: TypedSupabaseClient,
  name: string,
): Promise<string> {
  const base = slugify(name);
  let slug = base;
  let suffix = 0;

  // Loop until we find a slug that does not exist.
  while (true) {
    const { data, error } = await supabase
      .from("organizations")
      .select("slug", { count: "exact", head: true })
      .eq("slug", slug);

    if (error) {
      console.error("Error checking slug uniqueness:", error);
      // In case of DB error, break to avoid infinite loop.
      throw error;
    }

    // If no rows returned, slug is unique.
    if (data?.length === 0) {
      return slug;
    }

    // Otherwise, append/increment a numeric suffix.
    suffix++;
    slug = `${base}-${suffix}`;
  }
}

// Utility functions for role checking
export const isAdminRole = (role: OrgRole): role is AdminRole => {
  return role === "admin";
};

export const canManageMembers = (role: OrgRole): boolean => {
  return isAdminRole(role);
};

// Normalize slug input for real-time validation
export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

// Invite utility functions
export function isInviteExpired(invite: Invite): boolean {
  const now = new Date();
  const expiresAt = new Date(invite.expires_at);
  return now > expiresAt;
}

export function getInviteStatus(invite: Invite): InviteStatus | "expired" {
  if (isInviteExpired(invite)) {
    return "expired";
  }
  return invite.status;
}

export function canRevokeInvite(invite: Invite): boolean {
  const status = getInviteStatus(invite);
  return status === "pending" || status === "expired";
}

export function isInviteResolved(invite: Invite): boolean {
  return invite.status !== "pending";
}
