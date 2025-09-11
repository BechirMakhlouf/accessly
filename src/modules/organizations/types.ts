import { Database } from "@/types/database.types";
import { Profile } from "../profiles/types";

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
export type InviteStatus = "pending" | "accepted" | "rejected" | "expired";

// Helper type for admin permissions
export type AdminRole = Extract<OrgRole, "admin">;

export interface OrgWithMembers extends Organization {
  organization_members: {
    user_id: string;
    role: OrgRole;
    joined_at: string;
    last_active_at: string | null;
  }[];
}

export interface OrgMemberWithProfile extends OrgMember {
  profile?: Profile;
}