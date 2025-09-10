import { TypedSupabaseClient } from "@/lib/supabase/type";
import { getFullRoute, routes } from "@/lib/routes";
import {
  Organization,
  OrgInput,
  OrgMember,
  OrgMemberWithProfile,
  OrgRole,
  OrgUpdate,
  OrgWithMembers,
} from "./types";
import { isNullOrUndefined, validateEmail } from "@/lib/utils";
import { isDuplicateKeyError, isRlsError } from "@/lib/supabase/utils";

import { I18nMessageKey } from "@/lib/i18n";

export interface OrganizationServiceOptions {
  supabase: TypedSupabaseClient;
  adminSupabase: TypedSupabaseClient;
  userId: string;
}

export interface ServiceResult<T> {
  data?: T;
  error?: I18nMessageKey;
}

/**
 * Organization Service - Contains business logic and CRUD operations
 * All functions take a Supabase client and other parameters to execute logic
 * Supports both normal and admin Supabase clients for different operations
 */
export class OrganizationService {
  private supabase: TypedSupabaseClient;
  private supabaseAdmin: TypedSupabaseClient;
  private userId?: string;

  constructor(options: OrganizationServiceOptions) {
    this.supabase = options.supabase;
    this.supabaseAdmin = options.adminSupabase;
    this.userId = options.userId;
  }

  /**
   * Get organization by slug
   */
  async getBySlug(slug: string): Promise<ServiceResult<Organization>> {
    if (!slug) {
      return { error: "org.notFound" };
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to get organization by slug:", error);
      return { error: "org.failedToLoad" };
    }

    if (!data) {
      return { error: "org.notFound" };
    }

    return { data };
  }

  /**
   * Get organization by ID
   */
  async getById(orgId: string): Promise<ServiceResult<Organization>> {
    if (!orgId) {
      return { error: "org.notFound" };
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("id", orgId)
      .single();

    if (error) {
      console.error("Failed to get organization by ID:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.unauthorized" };
      }
      return { error: "org.failedToLoad" };
    }

    return { data };
  }

  /**
   * Create organization with auto-generated slug
   */
  async create(
    newOrg: OrgInput,
  ): Promise<ServiceResult<Organization>> {
    let slug = newOrg.slug ?? await this.generateUniqueSlug(newOrg.name);

    if (newOrg.slug && await this.isSlugUnique(newOrg.slug)) {
      slug = newOrg.slug;
    }

    if (isNullOrUndefined(slug)) {
      console.error("Error while generating slug");
      return { error: "org.failedToCreate" };
    }

    const { error } = await this.supabase
      .from("organizations")
      .insert({ ...newOrg, slug });

    if (error) {
      console.error("Error while creating organization:", error);
      return { error: "org.failedToCreate" };
    }

    return this.getBySlug(slug);
  }

  /**
   * Update organization
   */
  async update(
    orgId: string,
    updates: OrgUpdate,
  ): Promise<ServiceResult<Organization>> {
    if (!this.userId) {
      return { error: "org.unauthorized" };
    }

    // If updating slug, check if it's unique
    if (updates.slug) {
      const isUnique = await this.isSlugUnique(updates.slug);
      if (!isUnique) {
        return { error: "org.slugAlreadyExists" };
      }
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", orgId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update organization:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.unauthorized" };
      }
      return { error: "org.failedToUpdate" };
    }

    return { data };
  }

  /**
   * Delete organization (requires admin client)
   */
  async delete(orgId: string): Promise<ServiceResult<{ success: true }>> {
    if (!this.supabaseAdmin) {
      return { error: "org.unauthorized" };
    }

    const { error } = await this.supabaseAdmin
      .from("organizations")
      .delete()
      .eq("id", orgId);

    if (error) {
      console.error("Failed to delete organization:", error);
      const rlsInfo = isRlsError(error);

      if (rlsInfo.isRls) {
        return { error: "org.unauthorized" };
      }

      return { error: "org.failedToDelete" };
    }

    return { data: { success: true } };
  }

  /**
   * Get user's organizations
   */
  async getUserOrganizations(): Promise<ServiceResult<OrgWithMembers[]>> {
    if (!this.userId) {
      return { error: "org.unauthorized" };
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .select(`
        *,
        organization_members!inner(
          user_id,
          role,
          joined_at,
          last_active_at
        )
      `)
      .eq("organization_members.user_id", this.userId);

    if (error) {
      console.error("Failed to load organizations:", error);
      return { error: "org.failedToLoad" };
    }

    return { data };
  }

  /**
   * Check if slug is unique
   */
  async isSlugUnique(slug: string): Promise<ServiceResult<boolean>> {
    const { data, error } = await this.supabase.rpc(
      "is_organization_slugunique",
      { p_slug: slug },
    );

    if (error) {
      console.error("Error while checking slug uniqueness:", error);
      return { error: "org.failedToLoad" };
    }

    return { data: !!data };
  }

  /**
   * Generate unique organization slug
   */
  async generateUniqueSlug(name: string): Promise<string | null> {
    const { data, error } = await this.supabase.rpc(
      "generate_unique_organization_slug",
      { p_name: name },
    );

    if (error) {
      console.error("Error while generating unique slug:", error);
      return null;
    }

    return data;
  }

  /**
   * Get organization members
   */
  async getMembers(
    orgId: string,
  ): Promise<ServiceResult<OrgMemberWithProfile[]>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { data, error } = await this.supabase
      .from("organization_members")
      .select(
        `
        *,
        profile:user_profiles (
          *
        )
      `,
      )
      .eq("organization_id", orgId);

    console.debug("MEMBERS: ", data);
    if (error) {
      console.error("Failed to load organization members:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.members.unauthorized" };
      }
      return { error: "org.members.failedToLoad" };
    }

    return { data };
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    orgId: string,
    memberId: string,
    newRole: OrgRole,
  ): Promise<ServiceResult<OrgMember>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { data, error } = await this.supabase
      .from("organization_members")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("organization_id", orgId)
      .eq("user_id", memberId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update member role:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.members.unauthorized" };
      }
      return { error: "org.members.failedToUpdate" };
    }

    return { data };
  }

  /**
   * Remove member from organization
   */
  async removeMember(
    orgId: string,
    memberId: string,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { error } = await this.supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", orgId)
      .eq("user_id", memberId);

    if (error) {
      console.error("Failed to remove member:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.members.unauthorized" };
      }
      return { error: "org.members.failedToRemove" };
    }

    return { data: { success: true } };
  }

  /**
   * Leave organization
   */
  async leaveOrganization(
    orgId: string,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.leave.unauthorized" };
    }

    const { data: membership, error: membershipError } = await this.supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", orgId)
      .eq("user_id", this.userId)
      .single();

    if (membershipError) {
      console.error("Failed to check membership:", membershipError);
      const rlsInfo = isRlsError(membershipError);
      if (rlsInfo.isRls) {
        return { error: "org.leave.unauthorized" };
      }
      return { error: "org.leave.failedToCheckMembership" };
    }

    if (!membership) {
      return { error: "org.leave.notMember" };
    }

    const { error } = await this.supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", orgId)
      .eq("user_id", this.userId);

    if (error) {
      console.error("Failed to leave organization:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.leave.unauthorized" };
      }
      return { error: "org.leave.failedToLeave" };
    }

    return { data: { success: true } };
  }

  async inviteMember(
    orgId: string,
    orgName: string,
    role: OrgRole,
    email: string,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.invite.unauthorized" };
    }

    if (!validateEmail(email)) {
      return { error: "org.invite.invalidEmail" };
    }

    // check if there is an existing user with this email
    const { error: userError } = await this.supabaseAdmin.rpc(
      "get_user_by_email",
      { p_email: email },
    );

    if (userError) {
      console.error("Failed to check user:", userError);
      return { error: "org.invite.failedToCheckUser" };
    }

    const { data: inviteData, error: inviteInsertError } = await this.supabase
      .from("invites").insert({
        email: email,
        organization_id: orgId,
        role: role,
        invited_by: this.userId,
      }).select().single();

    if (inviteInsertError || isNullOrUndefined(inviteData)) {
      console.error("Failed to insert invite:", inviteInsertError);
      return { error: "org.invite.failedToInsert" };
    }

    console.log("invite data: ", {
      invite_id: inviteData.id,
      organization_name: orgName,
      org_role: inviteData.role,
    });
    const { error: inviteError } = await this.supabaseAdmin.auth.admin
      .inviteUserByEmail(email, {
        redirectTo: getFullRoute(routes.api.auth.inviteEmail),
        data: {
          invite_id: inviteData.id,
          organization_name: orgName,
          org_role: inviteData.role,
        },
      });

    if (inviteError) {
      console.error("Failed to send invite:", inviteError);
      return { error: "org.invite.failedToSend" };
    }

    // TODO: Implement invite logic
    return { data: { success: true } };
  }

  async addMemberToOrganization(
    orgId: string,
    role: OrgRole,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.member.unauthorized" };
    }

    // Check if user is already a member
    const { data: existingMember } = await this.supabase
      .from("organization_members")
      .select("user_id")
      .eq("user_id", this.userId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (existingMember) {
      return { error: "org.member.alreadyMember" };
    }

    // Add user to organization
    const { error } = await this.supabase
      .from("organization_members")
      .insert({
        user_id: this.userId,
        organization_id: orgId,
        role: role,
      });

    if (error) {
      if (isRlsError(error)) {
        return { error: "org.member.insufficientPermissions" };
      }
      if (isDuplicateKeyError(error)) {
        return { error: "org.member.alreadyMember" };
      }
      return { error: "org.member.failedToAdd" };
    }

    return { data: { success: true } };
  }

  async removeInvitation(
    _orgId: string,
    _invitationId: string,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.invite.unauthorized" };
    }

    // TODO: Implement remove invitation logic
    // Parameters are prefixed with _ to indicate they are intentionally unused
    console.log(
      "Remove invitation for org:",
      _orgId,
      "invitation:",
      _invitationId,
    );
    return { data: { success: true } };
  }
}
