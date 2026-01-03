import { createSSRClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/adminClient";
import { OrganizationService } from "@accessly/core";
import { assertSignedInAndGetUserId } from "@/lib/auth/server";
import { createMailService, type IMailService } from "@/lib/mail";
import { db } from "@/lib/supabase/db";
import { sendInviteMemberEmail } from "./emails/emails";
import { getFullRoute, routes } from "@/lib/routes";
import type { InviteEmailParams } from "@accessly/core";

export async function createOrgService(): Promise<OrganizationService> {
  const adminSupabase = await createAdminClient();
  const supabase = await createSSRClient();
  const userId = await assertSignedInAndGetUserId();
  const emailService = createMailService();

  return new OrganizationService({
    supabase,
    adminSupabase,
    userId,
    emailService: emailService as never,
    db,
    sendInviteEmail: async (_service: unknown, params: InviteEmailParams) => {
      const result = await sendInviteMemberEmail({
        emailService: emailService as IMailService,
        inviterName: params.inviterName,
        organizationName: params.organizationName,
        inviteUrl: params.inviteUrl,
        recipientEmail: params.recipientEmail,
        role: params.role,
      });
      if (result.error) {
        return { error: result.error.message ?? "Unknown error" };
      }
      return {};
    },
    getInviteUrl: (inviteId: string) =>
      getFullRoute(routes.invite.inviteId.root(inviteId)),
  });
}
