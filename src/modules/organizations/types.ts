import { Database } from "@/types/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type OrganizationRole = Database["public"]["Enums"]["organization_role"];
export type OrganizationMembership = Database["public"]["Tables"]["organization_members"]["Row"];
export type OrganizationInsertWithOptionalSlug = Omit<OrganizationInsert, "slug"> & {
  slug?: string;
};
export type Invite = Database["public"]["Tables"]["invites"]["Row"];

// Role type derived from Supabase database
export type OrgRole = Database["public"]["Enums"]["organization_role"];

// Helper type for admin permissions
export type AdminRole = Extract<OrgRole, "admin">;

export interface OrganizationWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: OrgRole
    joined_at: string
    last_active_at: string | null
  }[]
}

export interface OrgMember {
  user_id: string
  role: OrgRole
  joined_at: string
  last_active_at: string | null
  profiles?: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  email?: string
}

// Utility functions for role checking
export const isAdminRole = (role: OrgRole): role is AdminRole => {
  return role === "admin"
};

export const canManageMembers = (role: OrgRole): boolean => {
  return isAdminRole(role);
}

