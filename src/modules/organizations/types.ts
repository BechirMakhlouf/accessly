import { Database } from "@/types/database.types";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"];
export type OrganizationUpdate = Database["public"]["Tables"]["organizations"]["Update"];
export type OrganizationRole = Database["public"]["Enums"]["organization_role"];
export type OrganizationMembership = Database["public"]["Tables"]["organization_members"]["Row"];
export type OrganizationInsertWithOptionalSlug = Omit<OrganizationInsert, "slug"> & {
  slug?: string;
};
