"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  getOrganizationBySlugQueryOptions,
  getOrganizationMembersQueryOptions,
  ORGANIZATION_MEMBERS_KEY,
  removeMemberMutationOptions,
  updateMemberRoleMutationOptions,
  updateOrganizationMutationOptions,
} from "../queries";
import type { Organization, OrgMember, OrgRole, OrgUpdate } from "../types";
import { routes } from "@/lib/routes";

export function useActiveOrg() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  // Get the current organization slug from URL params
  const slug = params.slug as string;

  // Get organization data by slug
  const {
    data: organization,
    isLoading: orgLoading,
    error: orgError,
    refetch: refetchOrg,
  } = useQuery({
    ...getOrganizationBySlugQueryOptions(slug),
    enabled: !!slug,
  });

  // Get organization members
  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
    refetch: refetchMembers,
  } = useQuery({
    ...getOrganizationMembersQueryOptions(organization?.id || ""),
    enabled: !!organization?.id,
  });

  // Update organization mutation
  const updateOrgMutation = useMutation({
    ...updateOrganizationMutationOptions(queryClient),
    onSuccess: () => {
      refetchOrg();
      refetchMembers();
    },
  });

  // Update member role mutation
  const updateRoleMutation = useMutation({
    ...updateMemberRoleMutationOptions(queryClient),
    onSuccess: () => {
      refetchMembers();
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    ...removeMemberMutationOptions(queryClient),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ORGANIZATION_MEMBERS_KEY(organization?.id || ""),
      });
    },
  });

  // Computed values
  const isLoading = orgLoading || membersLoading;
  const error = orgError || membersError;

  // Current user's role in the active organization
  const currentUserRole: OrgRole | null = user && members
    ? members.find((m) => m.user_id === user.id)?.role || null
    : null;

  // Current user's membership details
  const currentUserMembership: OrgMember | null = user && members
    ? members.find((m) => m.user_id === user.id) || null
    : null;

  // Actions
  const setActiveOrganization = (org: Organization) => {
    if (org.slug) {
      router.push(routes.protected.dashboard.org.slug.root(org.slug));
    }
  };

  const updateOrganization = async (updates: OrgUpdate) => {
    if (!organization?.id) throw new Error("No active organization");

    await updateOrgMutation.mutateAsync({
      orgId: organization.id,
      updates,
    });
  };

  const updateMemberRole = async (
    memberId: string,
    newRole: OrgRole,
  ) => {
    if (!organization?.id) throw new Error("No active organization");

    await updateRoleMutation.mutateAsync({
      orgId: organization.id,
      memberId,
      newRole,
    });
  };

  const removeMember = async (memberId: string) => {
    if (!organization?.id) throw new Error("No active organization");

    await removeMemberMutation.mutateAsync({
      orgId: organization.id,
      memberId,
    });
  };

  const refetch = () => {
    refetchOrg();
    refetchMembers();
  };

  return {
    // Data
    activeOrganization: organization,
    organization,
    members,
    currentUserRole,
    currentUserMembership,
    isOrgContext: !!organization,

    // State
    isLoading,
    error,

    // Actions
    setActiveOrganization,
    updateOrganization,
    updateMemberRole,
    removeMember,
    refetch,

    // Mutation states
    isUpdating: updateOrgMutation.isPending,
    isUpdatingRole: updateRoleMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,

    // Mutation errors
    updateError: updateOrgMutation.error,
    updateRoleError: updateRoleMutation.error,
    removeMemberError: removeMemberMutation.error,
  };
}
