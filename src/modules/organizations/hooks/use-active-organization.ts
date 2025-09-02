"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth/hooks/useAuth";
import {
  getOrganizationBySlugQueryOptions,
  getOrganizationMembersQueryOptions,
  updateOrganizationMutationOptions,
} from "../queries";
import { Organization, OrgMember, OrgRole, OrgUpdate } from "../types";
import { routes } from "@/lib/routes";

export function useActiveOrganization() {
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
      // Refetch both organization and members data
      refetchOrg();
      refetchMembers();
    },
  });

  // Computed values
  const isLoading = orgLoading || membersLoading;
  const error = orgError || membersError;
  
  // Current user's role in the active organization
  const currentUserRole: OrgRole | null = user && members
    ? members.find(m => m.user_id === user.id)?.role || null
    : null;

  // Current user's membership details
  const currentUserMembership: OrgMember | null = user && members
    ? members.find(m => m.user_id === user.id) || null
    : null;

  // Set active organization (navigate to it)
  const setActiveOrganization = (org: Organization) => {
    // Navigate to the organization's dashboard
    if (org.slug) {
      router.push(routes.protected.dashboard.org.slug.root(org.slug));
    }
  };

  // Update organization
  const updateOrganization = async (updates: OrgUpdate) => {
    if (!organization?.id) throw new Error("No active organization");
    
    await updateOrgMutation.mutateAsync({
      orgId: organization.id,
      updates,
    });
  };

  // Refetch all data
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
    
    // State
    isLoading,
    error,
    
    // Actions
    setActiveOrganization,
    updateOrganization,
    refetch,
    
    // Mutation state
    isUpdating: updateOrgMutation.isPending,
    updateError: updateOrgMutation.error,
  };
}
