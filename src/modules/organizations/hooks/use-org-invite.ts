"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrganizationInvitesQueryOptions,
  updateInviteStatusMutationOptions,
  inviteMemberMutationOptions,
} from "../queries";
import { OrgRole, InviteStatus } from "../types";

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

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    ...inviteMemberMutationOptions(queryClient),
  });

  // Client-side check to prevent inviting existing members
  const isEmailAlreadyMember = (email: string): boolean => {
    return members.some(member => 
      member.email?.toLowerCase() === email.toLowerCase()
    );
  };

  // Actions
  const inviteMember = async (email: string, role: OrgRole) => {
    if (!organization?.id) {
      return { error: "org.invite.noOrganizationSelected" };
    }
    
    // Client-side validation to prevent inviting existing members
    if (isEmailAlreadyMember(email)) {
      return { error: "org.invite.alreadyMember" };
    }

    try {
      await inviteMemberMutation.mutateAsync({ 
        orgId: organization.id, 
        email, 
        role, 
        orgName: organization.name 
      });
      return { success: true };
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
        status 
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
    refetch,
    
    // Validation
    isEmailAlreadyMember,
    
    // Mutation states
    isInviting: inviteMemberMutation.isPending,
    isUpdatingStatus: updateInviteStatusMutation.isPending,
    
    // Mutation errors
    inviteError: inviteMemberMutation.error,
    updateStatusError: updateInviteStatusMutation.error,
  };
}
