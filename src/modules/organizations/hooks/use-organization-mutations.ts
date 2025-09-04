"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createOrganizationMutationOptions,
  updateOrganizationMutationOptions,
  leaveOrganizationMutationOptions,
  checkSlugUniquenessMutationOptions,
  deleteOrganizationMutationOptions,
} from "../queries";
import { OrgUpdate, OrgInput } from "../types";

export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  // Create organization mutation
  const createOrgMutation = useMutation(createOrganizationMutationOptions(queryClient));

  // Update organization mutation
  const updateOrgMutation = useMutation(updateOrganizationMutationOptions(queryClient));

  // Leave organization mutation
  const leaveOrgMutation = useMutation(leaveOrganizationMutationOptions(queryClient));

  // Check slug uniqueness mutation
  const checkSlugMutation = useMutation(checkSlugUniquenessMutationOptions());

  // Delete organization mutation
  const deleteOrgMutation = useMutation(deleteOrganizationMutationOptions(queryClient));

  // Actions
  const createOrganization = async (data: OrgInput) => {
    return await createOrgMutation.mutateAsync(data);
  };

  const updateOrganization = async (orgId: string, updates: OrgUpdate) => {
    return await updateOrgMutation.mutateAsync({ orgId, updates });
  };

  const leaveOrganization = async (orgId: string) => {
    return await leaveOrgMutation.mutateAsync({ orgId });
  };

  const checkSlugUniqueness = async (slug: string) => {
    return await checkSlugMutation.mutateAsync(slug);
  };

  const deleteOrganization = async (orgId: string) => {
    return await deleteOrgMutation.mutateAsync(orgId);
  };

  return {
    // Actions
    createOrganization,
    updateOrganization,
    leaveOrganization,
    checkSlugUniqueness,
    deleteOrganization,
    
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
