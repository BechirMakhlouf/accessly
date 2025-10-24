"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrganizationInvitesQueryOptions,
  inviteMemberMutationOptions,
  revokeInviteMutationOptions,
  updateInviteStatusMutationOptions,
} from "../queries";
import type { Invite, InviteStatus, OrgRole } from "../types";
import type { ServiceResult } from "@/lib/types";

interface UseOrgInviteOptions {
  organization: { id: string; name: string } | null | undefined;
  members: Array<{ user_id: string; email?: string }>;
}

export function useOrgInvite({ organization, members }: UseOrgInviteOptions) {
  const queryClient = useQueryClient();

  // Get organization invites
  const {
    data: invites = [],
    isLoading: invitesLoading,
    error: invitesError,
    refetch: refetchInvites,
  } = useQuery({
    ...getOrganizationInvitesQueryOptions(organization?.id || ""),
    enabled: !!organization?.id,
  });

  // Update invite status mutation
  const updateInviteStatusMutation = useMutation({
    ...updateInviteStatusMutationOptions(queryClient),
  });

  // Revoke invite mutation
  const revokeInviteMutation = useMutation({
    ...revokeInviteMutationOptions(queryClient),
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    ...inviteMemberMutationOptions(queryClient),
  });

  // Client-side check to prevent inviting existing members
  const isEmailAlreadyMember = (email: string): boolean => {
    return members.some((member) =>
      member.email?.toLowerCase() === email.toLowerCase()
    );
  };

  // Actions
  const inviteMember = async (
    email: string,
    role: OrgRole,
  ): Promise<ServiceResult<{ success: boolean; invite?: Invite }>> => {
    console.log("inviting member: ", email, role);

    if (!organization?.id) {
      return { error: "org.invite.notFound" };
    }

    // Client-side validation to prevent inviting existing members
    if (isEmailAlreadyMember(email)) {
      return { error: "org.invite.alreadyMember" };
    }

    try {
      const result = await inviteMemberMutation.mutateAsync({
        orgId: organization.id,
        email,
        role,
      });
      return { data: { success: true, invite: result.invite } };
    } catch {
      return { error: "org.invite.failedToSend" };
    }
  };

  const updateInviteStatus = async (inviteId: string, status: InviteStatus) => {
    if (!organization?.id) {
      return { error: "org.invite.noOrganizationSelected" };
    }

    try {
      await updateInviteStatusMutation.mutateAsync({
        inviteId,
        status,
      });
      return { success: true };
    } catch {
      return { error: "org.invite.failedToUpdate" };
    }
  };

  const revokeInvite = async (inviteId: string) => {
    if (!organization?.id) {
      return { error: "org.invite.noOrganizationSelected" };
    }

    try {
      await revokeInviteMutation.mutateAsync({
        inviteId,
      });
      return { success: true };
    } catch {
      return { error: "org.invite.failedToUpdate" };
    }
  };

  const refetch = () => {
    refetchInvites();
  };

  return {
    // Data
    invites,

    // State
    isLoading: invitesLoading,
    error: invitesError,

    // Actions
    inviteMember,
    updateInviteStatus,
    revokeInvite,
    refetch,

    // Validation
    isEmailAlreadyMember,

    // Mutation states
    isInviting: inviteMemberMutation.isPending,
    isUpdatingStatus: updateInviteStatusMutation.isPending,
    isRevoking: revokeInviteMutation.isPending,

    // Mutation errors
    inviteError: inviteMemberMutation.error,
    updateStatusError: updateInviteStatusMutation.error,
    revokeError: revokeInviteMutation.error,
  };
}
