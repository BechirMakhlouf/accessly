import { Database } from "@/types/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrgInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrgUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type OrgMember = Database["public"]["Tables"]["organization_members"]["Row"];
export type OrgInput = Omit<OrgInsert, "slug"> & {
  slug?: string;
};
export type Invite = Database["public"]["Tables"]["invites"]["Row"];

// Role type derived from Supabase database
export type OrgRole = Database["public"]["Enums"]["organization_role"];

// Helper type for admin permissions
export type AdminRole = Extract<OrgRole, "admin">;

export interface OrgWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: OrgRole
    joined_at: string
    last_active_at: string | null
  }[]
}