import type { SupabaseClient } from "@supabase/supabase-js";
import type { Kysely } from "kysely";
import type { Database as SupabaseDatabase } from "@accessly/types";
import type { KyselifyDatabase } from "kysely-supabase";
import { jsonArrayFrom } from "kysely/helpers/postgres";

type KyselyDatabase = KyselifyDatabase<SupabaseDatabase>;
import type { EmailService } from "../../types/email";
import { ok, err } from "../../types/result";
import { tryCatch } from "../../utils";
import { eventBus } from "../../lib/event-bus";
import {
  isDuplicateKeyError,
  isNullOrUndefined,
  isRlsError,
} from "../../utils/supabase";
import { OrgErrorCode } from "./errors";
import type {
  OrgInput,
  OrgUpdate,
  OrgRole,
  OrgWithMembers,
  OrgMemberWithProfile,
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

  async getBySlug(slug: string) {
    if (!slug) {
      return err(OrgErrorCode.NOT_FOUND);
    }

    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Failed to get organization by slug:", error);
      return err(OrgErrorCode.FAILED_TO_LOAD);
    }

    if (!data) {
      return err(OrgErrorCode.NOT_FOUND);
    }

    return ok(data);
  }

  async getById(orgId: string) {
    const { data, error } = await this.supabase
      .from("organizations")
      .select(`*`)
      .eq("id", orgId)
      .single();

    if (error) {
      console.error("Failed to get organization by ID:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(OrgErrorCode.UNAUTHORIZED);
      }
      return err(OrgErrorCode.FAILED_TO_LOAD);
    }

    return ok(data);
  }

  async create(newOrg: OrgInput) {
    let slug = newOrg.slug ?? (await this.generateUniqueSlug(newOrg.name));

    if (newOrg.slug && (await this.isSlugUnique(newOrg.slug))) {
      slug = newOrg.slug;
    }

    if (isNullOrUndefined(slug)) {
      console.error("Error while generating slug");
      return err(OrgErrorCode.FAILED_TO_CREATE);
    }

    const { error } = await this.supabase
      .from("organizations")
      .insert({ ...newOrg, slug });

    if (error) {
      console.error("Error while creating organization:", error);
      return err(OrgErrorCode.FAILED_TO_CREATE);
    }

    const message = newOrg.name + " organization created successfully.";
    eventBus.emit("organization_created_backend", {
      message: message,
      type: "info",
      userId: this.userId,
    });

    return this.getBySlug(slug);
  }

  async update(orgId: string, updates: OrgUpdate) {
    if (!this.userId) {
      return err(OrgErrorCode.UNAUTHORIZED);
    }

    if (updates.slug) {
      const isUnique = await this.isSlugUnique(updates.slug);
      if (!isUnique) {
        return err(OrgErrorCode.SLUG_ALREADY_EXISTS);
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
        return err(OrgErrorCode.UNAUTHORIZED);
      }
      return err(OrgErrorCode.FAILED_TO_UPDATE);
    }

    return ok(data);
  }

  async delete(orgId: string) {
    if (!this.supabaseAdmin) {
      return err(OrgErrorCode.UNAUTHORIZED);
    }

    const { error } = await this.supabaseAdmin
      .from("organizations")
      .delete()
      .eq("id", orgId);

    if (error) {
      console.error("Failed to delete organization:", error);
      const rlsInfo = isRlsError(error);

      if (rlsInfo.isRls) {
        return err(OrgErrorCode.UNAUTHORIZED);
      }

      return err(OrgErrorCode.FAILED_TO_DELETE);
    }

    return ok({ success: true as const });
  }

  async getUserOrgs() {
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
      return err(OrgErrorCode.FAILED_TO_LOAD);
    }

    return ok(result.data as OrgWithMembers[]);
  }

  async isSlugUnique(slug: string) {
    const { data, error } = await this.supabase.rpc(
      "is_organization_slugunique",
      { p_slug: slug },
    );

    if (error) {
      console.error("Error while checking slug uniqueness:", error);
      return err(OrgErrorCode.FAILED_TO_LOAD);
    }

    return ok(!!data);
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

  async getMembers(orgId: string) {
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
        return err(OrgErrorCode.MEMBER_UNAUTHORIZED);
      }
      return err(OrgErrorCode.MEMBER_FAILED_TO_LOAD);
    }

    return ok(data as OrgMemberWithProfile[]);
  }

  async updateMemberRole(orgId: string, memberId: string, newRole: OrgRole) {
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
      return err(OrgErrorCode.MEMBER_LOAD_ERROR);
    }

    if (currentUserMembership?.role !== "admin") {
      return err(OrgErrorCode.MEMBER_INSUFFICIENT_PERMISSIONS);
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
        return err(OrgErrorCode.MEMBER_UNAUTHORIZED);
      }
      return err(OrgErrorCode.MEMBER_FAILED_TO_UPDATE);
    }

    return ok(updatedMember);
  }

  async removeMember(orgId: string, memberId: string) {
    const { error } = await this.supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", orgId)
      .eq("user_id", memberId);

    if (error) {
      console.error("Failed to remove member:", error);
      const rlsInfo = isRlsError(error);
      if (rlsInfo.isRls) {
        return err(OrgErrorCode.MEMBER_UNAUTHORIZED);
      }
      return err(OrgErrorCode.MEMBER_FAILED_TO_REMOVE);
    }

    return ok({ success: true as const });
  }

  async leaveOrganization(orgId: string) {
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
        return err(OrgErrorCode.LEAVE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.LEAVE_FAILED_TO_CHECK_MEMBERSHIP);
    }

    if (!membership) {
      return err(OrgErrorCode.LEAVE_NOT_MEMBER);
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
        return err(OrgErrorCode.LEAVE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.LEAVE_FAILED);
    }

    return ok({ success: true as const });
  }

  async inviteMember(orgId: string, role: OrgRole, email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return err(OrgErrorCode.INVITE_INVALID_EMAIL);
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
      return err(OrgErrorCode.INVITE_ALREADY_MEMBER);
    }

    if (userError) {
      console.error("Failed to check user:", userError);
      return err(OrgErrorCode.INVITE_FAILED_TO_CHECK_USER);
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
      return err(OrgErrorCode.INVITE_FAILED_TO_INSERT);
    }

    try {
      const { data: organization, error: orgError } = await this.supabaseAdmin
        .from("organizations")
        .select("name, slug")
        .eq("id", orgId)
        .single();

      if (orgError || !organization) {
        console.error("Failed to get organization:", orgError);
        return err(OrgErrorCode.INVITE_FAILED_TO_CREATE);
      }

      const { data: inviterProfile, error: inviterError } =
        await this.supabaseAdmin
          .from("user_profiles")
          .select("full_name")
          .eq("user_id", this.userId)
          .single();

      if (inviterError || !inviterProfile) {
        console.error("Failed to get inviter profile:", inviterError);
        return err(OrgErrorCode.INVITE_FAILED_TO_CREATE);
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

    return ok({ success: true as const, invite: inviteData });
  }

  async addMemberToOrg(orgId: string, role: OrgRole) {
    const isAdmin = await this.supabaseAdmin
      .from("organization_members")
      .select("role")
      .eq("user_id", this.userId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (isAdmin.data?.role !== "admin") {
      return err(OrgErrorCode.MEMBER_INSUFFICIENT_PERMISSIONS);
    }

    const { data: existingMember } = await this.supabaseAdmin
      .from("organization_members")
      .select("user_id")
      .eq("user_id", this.userId)
      .eq("organization_id", orgId)
      .maybeSingle();

    if (existingMember) {
      return err(OrgErrorCode.MEMBER_ALREADY_MEMBER);
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
        return err(OrgErrorCode.MEMBER_INSUFFICIENT_PERMISSIONS);
      }
      if (isDuplicateKeyError(error)) {
        return err(OrgErrorCode.MEMBER_ALREADY_MEMBER);
      }
      return err(OrgErrorCode.MEMBER_FAILED_TO_ADD);
    }

    return ok({ success: true as const });
  }

  async removeInvitation(orgId: string, invitationId: string) {
    if (!this.userId) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
    }

    console.log(
      "Remove invitation for org:",
      orgId,
      "invitation:",
      invitationId,
    );
    return ok({ success: true as const });
  }

  async getOrgInvites(orgId: string) {
    if (!this.userId) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
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
        return err(OrgErrorCode.INVITE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_LOAD);
    }

    return ok((data || []) as InviteWithInviter[]);
  }

  async updateInviteStatus(inviteId: string, status: InviteStatus) {
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
        return err(OrgErrorCode.INVITE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_UPDATE);
    }

    return ok(data);
  }

  async getUserInvites() {
    if (!this.userId) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user?.email) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
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
        return err(OrgErrorCode.INVITE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_LOAD_USER_INVITES);
    }

    return ok((data || []) as InviteWithOrgAndInviter[]);
  }

  async updateUserOwnInvite(inviteId: string, status: "accepted" | "rejected") {
    const { data: invite, error: fetchInviteError } = await this.supabaseAdmin
      .from("invites")
      .select("*")
      .eq("id", inviteId)
      .single();

    if (fetchInviteError || !invite) {
      console.error("Failed to fetch invite:", fetchInviteError);
      return err(OrgErrorCode.INVITE_NOT_FOUND);
    }

    const now = new Date();
    const expiresAt = new Date(invite.expires_at);

    if (now > expiresAt) {
      return err(OrgErrorCode.INVITE_EXPIRED);
    }
    if (invite.status === "revoked") {
      return err(OrgErrorCode.INVITE_REVOKED);
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (!user?.email || user.email !== invite.email) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
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
        return err(OrgErrorCode.INVITE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_UPDATE_USER_INVITE);
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

        return err(OrgErrorCode.MEMBER_FAILED_TO_ADD);
      }
    }

    return ok(updateInviteData);
  }

  async getInviteById(inviteId: string) {
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
        return err(OrgErrorCode.INVITE_NOT_FOUND);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_LOAD);
    }

    return ok(data as InviteWithOrgAndInviter);
  }

  async getUserInvitesWithOrganizations() {
    if (!this.userId) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user?.email) {
      return err(OrgErrorCode.INVITE_UNAUTHORIZED);
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
        return err(OrgErrorCode.INVITE_UNAUTHORIZED);
      }
      return err(OrgErrorCode.INVITE_FAILED_TO_LOAD_USER_INVITES);
    }

    return ok(data as InviteWithOrgAndInviter[]);
  }
}
