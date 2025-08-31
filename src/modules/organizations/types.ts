import { Database } from "@/types/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type OrganizationRole = Database["public"]["Enums"]["organization_role"];
export type OrganizationMembership = Database["public"]["Tables"]["organization_members"]["Row"];
export type OrganizationInsertWithOptionalSlug = Omit<OrganizationInsert, "slug"> & {
  slug?: string;
};

export interface OrganizationWithMembers extends Organization {
  organization_members: {
    user_id: string
    role: "admin" | "member" | "owner"
    joined_at: string
    last_active_at: string | null
  }[]
}

export interface Member {
  user_id: string
  role: "admin" | "member" | "owner"
  joined_at: string
  last_active_at: string | null
}
