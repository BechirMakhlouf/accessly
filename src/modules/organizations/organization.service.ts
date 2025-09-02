import { TypedSupabaseClient } from '@/lib/supabase/type';
import { OrgInsertWithOptionalSlug, OrgUpdate, OrgRole, Organization, OrgWithMembers, OrgMember, Invite } from './types';
import { isNullOrUndefined } from '@/lib/utils';
import { isRlsError } from '@/lib/supabase/utils';

export interface OrganizationServiceOptions {
  supabase: TypedSupabaseClient;
  adminSupabase?: TypedSupabaseClient;
  userId?: string;
}

export interface ServiceResult<T> {
  data?: T;
  error?: string
}

/**
 * Organization Service - Contains business logic and CRUD operations
 * All functions take a Supabase client and other parameters to execute logic
 * Supports both normal and admin Supabase clients for different operations
 */
export class OrganizationService {
  private supabase: TypedSupabaseClient;
  private adminSupabase?: TypedSupabaseClient;
  private userId?: string;

  constructor(options: OrganizationServiceOptions) {
    this.supabase = options.supabase;
    this.adminSupabase = options.adminSupabase;
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
      .from('organizations')
      .select(`*`)
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to get organization by slug:', error);
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
      .from('organizations')
      .select(`*`)
      .eq('id', orgId)
      .single();

    if (error) {
      console.error('Failed to get organization by ID:', error);
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
  async create(newOrg: OrgInsertWithOptionalSlug): Promise<ServiceResult<Organization>> {

    let slug = newOrg.slug ?? await this.generateUniqueSlug(newOrg.name);

    if (newOrg.slug && await this.isSlugUnique(newOrg.slug))
      slug = newOrg.slug;

    if (isNullOrUndefined(slug)) {
      console.error("Error while generating slug");
      return { error: "org.failedToCreate" };
    }

    const { error } = await this.supabase
      .from("organizations")
      .insert({ ...newOrg, slug })

    if (error) {
      console.error("Error while creating organization:", error);
      return { error: "org.failedToCreate" };
    }


    return this.getBySlug(slug);
  }

  /**
   * Update organization
   */
  async update(orgId: string, updates: OrgUpdate): Promise<ServiceResult<Organization>> {
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
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orgId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update organization:', error);
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
    if (!this.adminSupabase) {
      return { error: "org.unauthorized" };
    }

    const { error } = await this.adminSupabase
      .from('organizations')
      .delete()
      .eq('id', orgId);

    if (error) {
      console.error('Failed to delete organization:', error);
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
    const { data, error } = await this.supabase.rpc("is_organization_slugunique", { p_slug: slug });

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
    const { data, error } = await this.supabase.rpc("generate_unique_organization_slug", { p_name: name });

    if (error) {
      console.error("Error while generating unique slug:", error);
      return null;
    }

    return data;
  }

  /**
   * Get organization members
   */
  async getMembers(orgId: string): Promise<ServiceResult<OrgMember[]>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { data, error } = await this.supabase
      .from('organization_members')
      .select('*')
      .eq('organization_id', orgId);

    if (error) {
      console.error('Failed to load organization members:', error);
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
  async updateMemberRole(orgId: string, memberId: string, newRole: OrgRole): Promise<ServiceResult<OrgMember>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }



    const { data, error } = await this.supabase
      .from('organization_members')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('organization_id', orgId)
      .eq('user_id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update member role:', error);
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
  async removeMember(orgId: string, memberId: string): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { error } = await this.supabase
      .from('organization_members')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', memberId);

    if (error) {
      console.error('Failed to remove member:', error);
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
  async leaveOrganization(orgId: string): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: "org.leave.unauthorized" };
    }


    const { data: membership, error: membershipError } = await this.supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', this.userId)
      .single();

    if (membershipError) {
      console.error('Failed to check membership:', membershipError);
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
      .from('organization_members')
      .delete()
      .eq('organization_id', orgId)
      .eq('user_id', this.userId);

    if (error) {
      console.error('Failed to leave organization:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.leave.unauthorized" };
      }
      return { error: "org.leave.failedToLeave" };
    }

    return { data: { success: true } };
  }

  /**
   * Invite member to organization
   */
  async inviteMember(orgId: string, email: string, role: OrgRole): Promise<ServiceResult<Invite>> {
    if (!this.userId) {
      return { error: "org.invite.unauthorized" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: "org.invite.invalidEmail" };
    }

    // Check if user is already a member
    const { data: existingMember } = await this.supabase
      .from('organization_members')
      .select('user_id')
      .eq('organization_id', orgId)
      .eq('user_id', email)
      .single();

    if (existingMember) {
      return { error: "org.invite.alreadyMember" };
    }

    // Generate invite token
    const inviteToken = crypto.randomUUID();

    const { data, error } = await this.supabase
      .from('invites')
      .insert({
        organization_id: orgId,
        invite_token: inviteToken,
        email,
        role,
        invited_by: this.userId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create invite:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.invite.unauthorized" };
      }
      return { error: "org.invite.failedToCreate" };
    }

    // TODO: Implement email invitation service
    console.log('Invite created:', data);

    return { data };
  }

  /**
   * Invite or add member (admin operation)
   */
  async inviteOrAddMember(
    organizationId: string,
    email: string,
    invitedBy: string,
    role: "admin" | "member" = "member"
  ): Promise<ServiceResult<{ success: true; message: string }>> {
    if (!this.adminSupabase) {
      return { error: "org.invite.unauthorized" };
    }

    // 1. Look for a user with that email in auth.users
    const { data: existingUser, error: userErr } = await this.adminSupabase
      .schema("auth")
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userErr) {
      console.error("Error checking existing user:", userErr);
      return { error: "org.failedToLoad" };
    }

    // 2. If the user already exists, add them to organization_members
    if (existingUser) {
      const { error: insertErr } = await this.adminSupabase
        .from("organization_members")
        .upsert({
          user_id: existingUser.id,
          organization_id: organizationId,
          role,
          invited_by: invitedBy,
          joined_at: new Date().toISOString(),
        })
        .eq("user_id", existingUser.id)
        .eq("organization_id", organizationId);

      if (insertErr) {
        console.error("Add member error:", insertErr);
        return { error: "org.members.failedToAdd" };
      }

      // TODO: Hook your email provider here to notify the existing user.
      // Example: await sendEmail(email, `You've been added to organization ${organizationId}`);

      return { data: { success: true, message: "User added to organization" } };
    }

    // 3. No user found → create an invitation row
    const inviteToken = crypto.randomUUID();

    const { error: inviteErr } = await this.adminSupabase.from("invites").insert({
      organization_id: organizationId,
      invited_by: invitedBy,
      invite_token: inviteToken,
      email,
      role,
      status: "pending",
    });

    if (inviteErr) {
      console.error("Invite insert error:", inviteErr);
      return { error: "org.invite.failedToCreate" };
    }

    //TODO: add invite email functionnality

    return { data: { success: true, message: "Invitation sent" } };
  }

  /**
   * Get current user's role in organization
   */
  async getCurrentUserRole(orgId: string): Promise<ServiceResult<{ role: OrgRole }>> {
    if (!this.userId) {
      return { error: "org.members.unauthorized" };
    }

    const { data, error } = await this.supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', this.userId)
      .single();

    if (error) {
      console.error('Failed to get current user role:', error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: "org.members.unauthorized" };
      }
      return { error: "org.members.failedToLoad" };
    }

    return { data };
  }
}
