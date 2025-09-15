"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { getOrgById } from "../actions";
import { useUserInvites } from "./use-user-invites";

interface UseInviteOptions {
  inviteId: string;
}

export function useInvite({ inviteId }: UseInviteOptions) {
  const { user } = useAuth();
  const { invites, acceptInvite, rejectInvite, isUpdating } = useUserInvites();

  // Find the specific invite from the user invites
  const invite = invites?.find(inv => inv.id === inviteId);

  // Get organization details for this invite
  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
  } = useQuery({
    queryKey: ["organization", invite?.organization_id],
    queryFn: async () => {
      if (!invite?.organization_id) return null;
      const result = await getOrgById(invite.organization_id);
      if (result.error) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Unknown error');
      }
      return result.data || null;
    },
    enabled: !!invite?.organization_id && !!user,
  });

  const isLoading = !invite || orgLoading;
  const error = orgError;

  // Actions
  const handleAcceptInvite = async () => {
    if (!invite) return { error: "No invite found" };
    return await acceptInvite(invite.id);
  };

  const handleRejectInvite = async () => {
    if (!invite) return { error: "No invite found" };
    return await rejectInvite(invite.id);
  };

  return {
    // Data
    invite,
    organization,
    
    // State
    isLoading,
    error,
    
    // Actions
    acceptInvite: handleAcceptInvite,
    rejectInvite: handleRejectInvite,
    
    // Mutation states
    isUpdating,
  };
}
