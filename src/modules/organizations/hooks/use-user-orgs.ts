"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import {
  getUserOrganizationsQueryOptions,
  createOrganizationMutationOptions,
  updateOrganizationMutationOptions,
  leaveOrganizationMutationOptions,
  checkSlugUniquenessMutationOptions,
  deleteOrganizationMutationOptions,
} from "../queries";
import { OrgUpdate, OrgInput } from "../types";

export function useUserOrgs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all user organizations
  const {
    data: organizations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getUserOrganizationsQueryOptions(),
    enabled: !!user,
  });

  // Create organization mutation
  const createOrgMutation = useMutation({
    ...createOrganizationMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Update organization mutation
  const updateOrgMutation = useMutation({
    ...updateOrganizationMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Leave organization mutation
  const leaveOrgMutation = useMutation({
    ...leaveOrganizationMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Check slug uniqueness mutation
  const checkSlugMutation = useMutation(checkSlugUniquenessMutationOptions());

  // Delete organization mutation
  const deleteOrgMutation = useMutation({
    ...deleteOrganizationMutationOptions(queryClient),
    onSuccess: () => {
      refetch();
    },
  });

  // Actions
  const createOrganization = async (data: OrgInput) => {
    const result = await createOrgMutation.mutateAsync(data);
    return result;
  };

  const updateOrganization = async (orgId: string, updates: OrgUpdate) => {
    await updateOrgMutation.mutateAsync({ orgId, updates });
  };

  const leaveOrganization = async (orgId: string) => {
    return await leaveOrgMutation.mutateAsync({ orgId });
  };

  const checkSlugUniqueness = async (slug: string) => {
    return await checkSlugMutation.mutateAsync(slug);
  };

  const deleteOrganization = async (orgId: string) => {
    await deleteOrgMutation.mutateAsync(orgId);
  };

  return {
    // Data
    organizations,
    
    // State
    isLoading,
    error,
    
    // Actions
    createOrganization,
    updateOrganization,
    leaveOrganization,
    checkSlugUniqueness,
    deleteOrganization,
    refetch,
    
    // Mutation states
    isCreating: createOrgMutation.isPending,
    isUpdating: updateOrgMutation.isPending,
    isLeaving: leaveOrgMutation.isPending,
    isCheckingSlug: checkSlugMutation.isPending,
    isDeleting: deleteOrgMutation.isPending,
    
    // Mutation errors
    createError: createOrgMutation.error,
    updateError: updateOrgMutation.error,
    leaveError: leaveOrgMutation.error,
    checkSlugError: checkSlugMutation.error,
    deleteError: deleteOrgMutation.error,
  };
}
