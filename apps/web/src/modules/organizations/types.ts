import type { Database } from "@/types/database.types";
import type { Profile } from "../profiles/types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrgInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrgUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type OrgMember =
  Database["public"]["Tables"]["organization_members"]["Row"];
export type OrgInput = Omit<OrgInsert, "slug"> & {
  slug?: string;
};
export type Invite = Database["public"]["Tables"]["invites"]["Row"];
export type InviteInsert = Database["public"]["Tables"]["invites"]["Insert"];
export type InviteUpdate = Database["public"]["Tables"]["invites"]["Update"];

// Role type derived from Supabase database
export type OrgRole = Database["public"]["Enums"]["organization_role"];

// Invite status type
export type InviteStatus = Database["public"]["Enums"]["org_invite_status"];
export type InviteStatusOrExpired = InviteStatus | "expired";

// Helper type for admin permissions
export type AdminRole = Extract<OrgRole, "admin">;

export interface OrgWithMembers extends Organization {
  organization_members: OrgMemberWithProfile[];
}

export interface OrgMemberWithProfile extends OrgMember {
  profile?: Profile;
}

export interface InviteWithInviter extends Invite {
  inviterProfile: Profile;
}

export interface InviteWithOrgAndInviter extends InviteWithInviter {
  organization: Organization;
}
