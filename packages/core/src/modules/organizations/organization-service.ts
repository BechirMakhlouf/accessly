import type { SupabaseClient } from "@supabase/supabase-js";
import type { Kysely } from "kysely";
import type { Database as SupabaseDatabase } from "@accessly/types";
import type { KyselifyDatabase } from "kysely-supabase";
import { jsonArrayFrom } from "kysely/helpers/postgres";

type KyselyDatabase = KyselifyDatabase<SupabaseDatabase>;
import type { ServiceResult } from "@/types/service-result";
import type { EmailService } from "@/types/email";
import { tryCatch } from "@/utils";
import { eventBus } from "@/event-bus";
import {
  isDuplicateKeyError,
  isNullOrUndefined,
  isRlsError,
} from "@/utils/supabase";
import {
  OrgErrors,
  OrgMemberErrors,
  OrgLeaveErrors,
  OrgInviteErrors,
} from "./errors";
import type {
  Organization,
  OrgInput,
  OrgUpdate,
  OrgRole,
  OrgMember,
  OrgWithMembers,
  OrgMemberWithProfile,
  Invite,
  InviteStatus,
  InviteWithInviter,
  InviteWithOrgAndInviter,
} from "./types";

export interface InviteEmailParams {
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
  recipientEmail: string;
  role: OrgRole;
}

export interface OrganizationServiceDeps {
  supabase: SupabaseClient<SupabaseDatabase>;
  adminSupabase: SupabaseClient<SupabaseDatabase>;
  db: Kysely<KyselyDatabase>;
  emailService: EmailService;
  userId: string;
  sendInviteEmail: (
    emailService: EmailService,
    params: InviteEmailParams,
  ) => Promise<{ error?: string }>;
  getInviteUrl: (inviteId: string) => string;
}

export class OrganizationService {
  private supabase: SupabaseClient<SupabaseDatabase>;
  private supabaseAdmin: SupabaseClient<SupabaseDatabase>;
  private emailService: EmailService;
  private userId: string;
  private db: Kysely<KyselyDatabase>;
  private sendInviteEmail: OrganizationServiceDeps["sendInviteEmail"];
  private getInviteUrl: OrganizationServiceDeps["getInviteUrl"];

  constructor(deps: OrganizationServiceDeps) {
    this.supabase = deps.supabase;
    this.supabaseAdmin = deps.adminSupabase;
    this.emailService = deps.emailService;
    this.userId = deps.userId;
    this.db = deps.db;
    this.sendInviteEmail = deps.sendInviteEmail;
    this.getInviteUrl = deps.getInviteUrl;
  }

  async getBySlug(slug: string): Promise<ServiceResult<Organization>> {
    if (!slug) {
      return { error: OrgErrors.notFound };
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to get organization by slug:", error);
      return { error: OrgErrors.failedToLoad };
    }

    if (!data) {
      return { error: OrgErrors.notFound };
    }

    return { data };
  }

  async getById(orgId: string): Promise<ServiceResult<Organization>> {
    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("id", orgId)
      .single();

    if (error) {
      console.error("Failed to get organization by ID:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgErrors.unauthorized };
      }
      return { error: OrgErrors.failedToLoad };
    }

    return { data };
  }

  async create(newOrg: OrgInput): Promise<ServiceResult<Organization>> {
    let slug = newOrg.slug ?? (await this.generateUniqueSlug(newOrg.name));

    if (newOrg.slug && (await this.isSlugUnique(newOrg.slug))) {
      slug = newOrg.slug;
    }

    if (isNullOrUndefined(slug)) {
      console.error("Error while generating slug");
      return { error: OrgErrors.failedToCreate };
    }

    const { error } = await this.supabase
      .from("organizations")
      .insert({ ...newOrg, slug });

    if (error) {
      console.error("Error while creating organization:", error);
      return { error: OrgErrors.failedToCreate };
    }

    const message = newOrg.name + " organization created successfully.";
    eventBus.emit("organization_created_backend", {
      message: message,
      type: "info",
      userId: this.userId,
    });

    return this.getBySlug(slug);
  }

  async update(
    orgId: string,
    updates: OrgUpdate,
  ): Promise<ServiceResult<Organization>> {
    if (!this.userId) {
      return { error: OrgErrors.unauthorized };
    }

    if (updates.slug) {
      const isUnique = await this.isSlugUnique(updates.slug);
      if (!isUnique) {
        return { error: OrgErrors.slugAlreadyExists };
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
        return { error: OrgErrors.unauthorized };
      }
      return { error: OrgErrors.failedToUpdate };
    }

    return { data };
  }

  async delete(orgId: string): Promise<ServiceResult<{ success: true }>> {
    if (!this.supabaseAdmin) {
      return { error: OrgErrors.unauthorized };
    }

    const { error } = await this.supabaseAdmin
      .from("organizations")
      .delete()
      .eq("id", orgId);

    if (error) {
      console.error("Failed to delete organization:", error);
      const rlsInfo = isRlsError(error);

      if (rlsInfo.isRls) {
        return { error: OrgErrors.unauthorized };
      }

      return { error: OrgErrors.failedToDelete };
    }

    return { data: { success: true } };
  }

  async getUserOrgs(): Promise<ServiceResult<OrgWithMembers[]>> {
    const result = await tryCatch(
      this.db
        .selectFrom("organizations as o")
        .selectAll("o")
        .select((eb) =>
          jsonArrayFrom(
            eb
              .selectFrom("organization_members as om")
              .innerJoin("user_profiles as up", "up.user_id", "om.user_id")
              .selectAll()
              .whereRef("om.organization_id", "=", "o.id")
              .orderBy("om.joined_at"),
          ).as("organization_members"),
        )
        .where("o.id", "in", (eb) =>
          eb
            .selectFrom("organization_members")
            .select("organization_id")
            .where("user_id", "=", this.userId),
        )
        .execute(),
    );

    if (result.error) {
      console.error("Failed to load organizations:", result.error);
      return { error: OrgErrors.failedToLoad };
    }

    return { data: result.data };
  }

  async isSlugUnique(slug: string): Promise<ServiceResult<boolean>> {
    const { data, error } = await this.supabase.rpc(
      "is_organization_slugunique",
      { p_slug: slug },
    );

    if (error) {
      console.error("Error while checking slug uniqueness:", error);
      return { error: OrgErrors.failedToLoad };
    }

    return { data: !!data };
  }

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

  async getMembers(
    orgId: string,
  ): Promise<ServiceResult<OrgMemberWithProfile[]>> {
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

    if (error) {
      console.error("Failed to load organization members:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgMemberErrors.unauthorized };
      }
      return { error: OrgMemberErrors.failedToLoad };
    }

    return { data };
  }

  async updateMemberRole(
    orgId: string,
    memberId: string,
    newRole: OrgRole,
  ): Promise<ServiceResult<OrgMember>> {
    const { data: currentUserMembership, error: currentUserMembershipError } =
      await this.supabaseAdmin
        .from("organization_members")
        .select("*")
        .eq("organization_id", orgId)
        .eq("user_id", this.userId)
        .maybeSingle();

    if (currentUserMembershipError) {
      console.error(
        "Failed to check current user membership:",
        currentUserMembershipError,
      );
      return { error: OrgMemberErrors.loadError };
    }

    if (currentUserMembership?.role !== "admin") {
      return { error: OrgMemberErrors.insufficientPermissions };
    }

    const { data: updatedMember, error: updatedMemberError } =
      await this.supabaseAdmin
        .from("organization_members")
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("organization_id", orgId)
        .eq("user_id", memberId)
        .select()
        .single();

    if (updatedMemberError) {
      console.error("Failed to update member role:", updatedMemberError);
      const rlsInfo = isRlsError(updatedMemberError);
      if (rlsInfo.isRls) {
        return { error: OrgMemberErrors.unauthorized };
      }
      return { error: OrgMemberErrors.failedToUpdate };
    }

    return { data: updatedMember };
  }

  async removeMember(
    orgId: string,
    memberId: string,
  ): Promise<ServiceResult<{ success: true }>> {
    const { error } = await this.supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", orgId)
      .eq("user_id", memberId);

    if (error) {
      console.error("Failed to remove member:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgMemberErrors.unauthorized };
      }
      return { error: OrgMemberErrors.failedToRemove };
    }

    return { data: { success: true } };
  }

  async leaveOrganization(
    orgId: string,
  ): Promise<ServiceResult<{ success: true }>> {
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
        return { error: OrgLeaveErrors.unauthorized };
      }
      return { error: OrgLeaveErrors.failedToCheckMembership };
    }

    if (!membership) {
      return { error: OrgLeaveErrors.notMember };
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
        return { error: OrgLeaveErrors.unauthorized };
      }
      return { error: OrgLeaveErrors.failedToLeave };
    }

    return { data: { success: true } };
  }

  async inviteMember(
    orgId: string,
    role: OrgRole,
    email: string,
  ): Promise<ServiceResult<{ success: true; invite: Invite }>> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: OrgInviteErrors.invalidEmail };
    }

    const { data: invitee, error: userError } = await this.supabaseAdmin.rpc(
      "get_user_by_email",
      { p_email: email },
    );

    const isInviteeAlreadyMember =
      invitee?.id &&
      (
        await this.supabaseAdmin
          .from("organization_members")
          .select("user_id")
          .eq("user_id", invitee?.id)
          .eq("organization_id", orgId)
          .maybeSingle()
      )?.data;

    if (isInviteeAlreadyMember) {
      return { error: OrgInviteErrors.alreadyMember };
    }

    if (userError) {
      console.error("Failed to check user:", userError);
      return { error: OrgInviteErrors.failedToCheckUser };
    }

    const { data: inviteData, error: inviteInsertError } =
      await this.supabaseAdmin
        .from("invites")
        .insert({
          email: email,
          organization_id: orgId,
          role: role,
          invited_by: this.userId,
        })
        .select()
        .single();

    if (inviteInsertError || isNullOrUndefined(inviteData)) {
      console.error("Failed to insert invite:", inviteInsertError);
      return { error: OrgInviteErrors.failedToInsert };
    }

    try {
      const { data: organization, error: orgError } = await this.supabaseAdmin
        .from("organizations")
        .select("name, slug")
        .eq("id", orgId)
        .single();

      if (orgError || !organization) {
        console.error("Failed to get organization:", orgError);
        return { error: OrgInviteErrors.failedToCreate };
      }

      const { data: inviterProfile, error: inviterError } =
        await this.supabaseAdmin
          .from("user_profiles")
          .select("full_name")
          .eq("user_id", this.userId)
          .single();

      if (inviterError || !inviterProfile) {
        console.error("Failed to get inviter profile:", inviterError);
        return { error: OrgInviteErrors.failedToCreate };
      }

      const inviteUrl = this.getInviteUrl(inviteData.id);
      const inviterName = inviterProfile.full_name || "Someone";

      const emailResult = await this.sendInviteEmail(this.emailService, {
        inviterName,
        organizationName: organization.name,
        inviteUrl,
        recipientEmail: email,
        role,
      });

      if (emailResult.error) {
        console.error("Failed to send invite email:", emailResult.error);
        console.warn("Invite created but email failed to send");
      }
    } catch (error) {
      console.error("Error sending invite email:", error);
      console.warn("Invite created but email failed to send");
    }

    return { data: { success: true, invite: inviteData } };
  }

  async addMemberToOrg(
    orgId: string,
    role: OrgRole,
  ): Promise<ServiceResult<{ success: true }>> {
    const isAdmin = await this.supabaseAdmin
      .from("organization_members")
      .select("role")
      .eq("user_id", this.userId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (isAdmin.data?.role !== "admin") {
      return { error: OrgMemberErrors.insufficientPermissions };
    }

    const { data: existingMember } = await this.supabaseAdmin
      .from("organization_members")
      .select("user_id")
      .eq("user_id", this.userId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (existingMember) {
      return { error: OrgMemberErrors.alreadyMember };
    }

    const { error } = await this.supabaseAdmin
      .from("organization_members")
      .insert({
        user_id: this.userId,
        organization_id: orgId,
        role: role,
      });

    if (error) {
      if (isRlsError(error)) {
        return { error: OrgMemberErrors.insufficientPermissions };
      }
      if (isDuplicateKeyError(error)) {
        return { error: OrgMemberErrors.alreadyMember };
      }
      return { error: OrgMemberErrors.failedToAdd };
    }

    return { data: { success: true } };
  }

  async removeInvitation(
    orgId: string,
    invitationId: string,
  ): Promise<ServiceResult<{ success: true }>> {
    if (!this.userId) {
      return { error: OrgInviteErrors.unauthorized };
    }

    console.log(
      "Remove invitation for org:",
      orgId,
      "invitation:",
      invitationId,
    );
    return { data: { success: true } };
  }

  async getOrgInvites(
    orgId: string,
  ): Promise<ServiceResult<InviteWithInviter[]>> {
    if (!this.userId) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const { data, error } = await this.supabase
      .from("invites")
      .select(
        `
        *,
        inviterProfile:user_profiles!invited_by(
          *
        )`,
      )
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load organization invites:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgInviteErrors.unauthorized };
      }
      return { error: OrgInviteErrors.failedToLoad };
    }

    return { data: data || [] };
  }

  async updateInviteStatus(
    inviteId: string,
    status: InviteStatus,
  ): Promise<ServiceResult<Invite>> {
    const { data, error } = await this.supabaseAdmin
      .from("invites")
      .update({
        status,
      })
      .eq("id", inviteId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update invite status:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgInviteErrors.unauthorized };
      }
      return { error: OrgInviteErrors.failedToUpdate };
    }

    return { data };
  }

  async getUserInvites(): Promise<ServiceResult<InviteWithOrgAndInviter[]>> {
    if (!this.userId) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user?.email) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const { data, error } = await this.supabase
      .from("invites")
      .select(
        `
        *,
        organization:organizations!inner(
          *
        ),
        inviterProfile:user_profiles!invited_by(
          *
        )
      `,
      )
      .eq("email", user.email)
      .in("status", ["pending"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load user invites:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgInviteErrors.unauthorized };
      }
      return { error: OrgInviteErrors.failedToLoadUserInvites };
    }

    return { data: data || [] };
  }

  async updateUserOwnInvite(
    inviteId: string,
    status: "accepted" | "rejected",
  ): Promise<ServiceResult<Invite>> {
    const { data: invite, error: fetchInviteError } = await this.supabaseAdmin
      .from("invites")
      .select("*")
      .eq("id", inviteId)
      .single();

    if (fetchInviteError || !invite) {
      console.error("Failed to fetch invite:", fetchInviteError);
      return { error: OrgInviteErrors.notFound };
    }

    const now = new Date();
    const expiresAt = new Date(invite.expires_at);

    if (now > expiresAt) {
      return { error: OrgInviteErrors.expired };
    }
    if (invite.status === "revoked") {
      return { error: OrgInviteErrors.revoked };
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user?.email || user.email !== invite.email) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const { data: updateInviteData, error: updateInviteError } =
      await this.supabaseAdmin
        .from("invites")
        .update({
          status,
        })
        .eq("id", inviteId)
        .select()
        .single();

    if (updateInviteError) {
      console.error("Failed to update user invite:", updateInviteError);
      const rlsInfo = isRlsError(updateInviteError);
      if (rlsInfo.isRls) {
        return { error: OrgInviteErrors.unauthorized };
      }
      return { error: OrgInviteErrors.failedToUpdateUserInvite };
    }

    if (status === "accepted") {
      const addMemberResult = await this.supabaseAdmin
        .from("organization_members")
        .insert({
          user_id: this.userId,
          organization_id: invite.organization_id,
          role: invite.role,
        });

      if (addMemberResult.error) {
        await this.supabaseAdmin
          .from("invites")
          .update({
            id: inviteId,
            status: invite.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", inviteId);

        return { error: OrgMemberErrors.failedToAdd };
      }
    }

    return { data: updateInviteData };
  }

  async getInviteById(
    inviteId: string,
  ): Promise<ServiceResult<InviteWithOrgAndInviter>> {
    const { data, error } = await this.supabaseAdmin
      .from("invites")
      .select(
        `
        *,
        organization:organizations!inner(
          *
        ),
        inviterProfile:user_profiles!invited_by(
          *
        )
      `,
      )
      .eq("id", inviteId)
      .single();

    if (error) {
      console.error("Failed to load invite:", error);
      if (error.code === "PGRST116") {
        return { error: OrgInviteErrors.notFound };
      }
      return { error: OrgInviteErrors.failedToLoad };
    }

    return { data };
  }

  async getUserInvitesWithOrganizations(): Promise<
    ServiceResult<InviteWithOrgAndInviter[]>
  > {
    if (!this.userId) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user?.email) {
      return { error: OrgInviteErrors.unauthorized };
    }

    const { data, error } = await this.supabaseAdmin
      .from("invites")
      .select(
        `
        *,
        organization:organizations!inner(
          *
        ),
        inviterProfile:user_profiles!invited_by(
          *
        )
      `,
      )
      .eq("email", user.email)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load user invites with organizations:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return { error: OrgInviteErrors.unauthorized };
      }
      return { error: OrgInviteErrors.failedToLoadUserInvites };
    }

    return { data: data };
  }
}
