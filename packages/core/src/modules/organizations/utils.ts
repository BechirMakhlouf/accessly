import type { AdminRole, Invite, InviteStatus, OrgRole } from "./types";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");
}

export const isAdminRole = (role: OrgRole): role is AdminRole => {
  return role === "admin";
};

export const canManageMembers = (role: OrgRole): boolean => {
  return isAdminRole(role);
};

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
