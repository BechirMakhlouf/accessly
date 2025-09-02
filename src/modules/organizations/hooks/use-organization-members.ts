"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/hooks/useAuth";
import {
  getOrganizationMembersQueryOptions,
  updateMemberRoleMutationOptions,
  removeMemberMutationOptions,
  inviteMemberMutationOptions,
} from "../queries";
import { OrgMember, OrgRole } from "../types";

export function useOrganizationMembers(orgId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get organization members
  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getOrganizationMembersQueryOptions(orgId),
    enabled: !!orgId,
  });

  // Update member role mutation
  const updateRoleMutation = useMutation({
    ...updateMemberRoleMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    ...removeMemberMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    ...inviteMemberMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Current user's role in this organization
  const currentUserRole: OrgRole | null = user && members
    ? members.find(m => m.user_id === user.id)?.role || null
    : null;

  // Current user's membership details
  const currentUserMembership: OrgMember | null = user && members
    ? members.find(m => m.user_id === user.id) || null
    : null;

  // Actions
  const updateMemberRole = async (memberId: string, newRole: "admin" | "member") => {
    await updateRoleMutation.mutateAsync({ orgId, memberId, newRole });
  };

  const removeMember = async (memberId: string) => {
    await removeMemberMutation.mutateAsync({ orgId, memberId });
  };

  const inviteMember = async (email: string, role: OrgRole) => {
    await inviteMemberMutation.mutateAsync({ orgId, email, role });
  };

  return {
    // Data
    members,
    currentUserRole,
    currentUserMembership,
    
    // State
    isLoading,
    error,
    
    // Actions
    updateMemberRole,
    removeMember,
    inviteMember,
    refetch,
    
    // Mutation states
    isUpdatingRole: updateRoleMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    isInvitingMember: inviteMemberMutation.isPending,
    
    // Mutation errors
    updateRoleError: updateRoleMutation.error,
    removeMemberError: removeMemberMutation.error,
    inviteMemberError: inviteMemberMutation.error,
  };
}
