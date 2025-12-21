'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import {
  getUserInvitesQueryOptions,
  updateUserInviteMutationOptions,
} from '../queries';

export function useUserInvites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get user invites
  const {
    data: invites = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getUserInvitesQueryOptions(),
    enabled: !!user,
  });

  // Update user invite mutation (accept/reject)
  const updateInviteMutation = useMutation({
    ...updateUserInviteMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Actions
  const acceptInvite = async (inviteId: string) => {
    return await updateInviteMutation.mutateAsync({
      inviteId,
      status: 'accepted',
    });
  };

  const rejectInvite = async (inviteId: string) => {
    return await updateInviteMutation.mutateAsync({
      inviteId,
      status: 'rejected',
    });
  };

  return {
    // Data
    invites,

    // State
    isLoading,
    error,

    // Actions
    acceptInvite,
    rejectInvite,
    refetch,

    // Mutation states
    isUpdating: updateInviteMutation.isPending,

    // Mutation errors
    updateError: updateInviteMutation.error,
  };
}
