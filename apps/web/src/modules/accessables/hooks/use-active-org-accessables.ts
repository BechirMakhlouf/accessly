"use client";

import { useActiveOrg } from "@/modules/organizations";
import {
  useOrganizationAccessables,
  useCreateAccessable,
  useUpdateAccessable,
  useDeleteAccessable,
} from "../queries";
import type { Accessable, AccessableInsert, AccessableUpdate } from "../types";

export function useActiveOrgAccessables() {
  const { organization, isLoading: orgLoading } = useActiveOrg();

  const {
    data: accessablesResult,
    isLoading: accessablesLoading,
    error: accessablesError,
    refetch,
  } = useOrganizationAccessables(organization?.id ?? "", {
    enabled: !!organization?.id,
  });

  const createMutation = useCreateAccessable();
  const updateMutation = useUpdateAccessable();
  const deleteMutation = useDeleteAccessable();

  const allAccessables = accessablesResult?.data ?? [];
  const orgLevelAccessables = allAccessables.filter((a) => a.board_id === null);

  const createAccessable = async (
    input: Omit<AccessableInsert, "organization_id">,
  ) => {
    if (!organization?.id) throw new Error("No active organization");

    return createMutation.mutateAsync({
      ...input,
      organization_id: organization.id,
    });
  };

  const updateAccessable = async (id: string, updates: AccessableUpdate) => {
    return updateMutation.mutateAsync({ id, updates });
  };

  const deleteAccessable = async (
    id: string,
    boardId: string | null = null,
  ) => {
    if (!organization?.id) throw new Error("No active organization");

    return deleteMutation.mutateAsync({
      id,
      organizationId: organization.id,
      boardId,
    });
  };

  const getAccessableById = (id: string): Accessable | undefined => {
    return allAccessables.find((a) => a.id === id);
  };

  return {
    organization,
    allAccessables,
    orgLevelAccessables,

    isLoading: orgLoading || accessablesLoading,
    error: accessablesError,

    createAccessable,
    updateAccessable,
    deleteAccessable,
    getAccessableById,
    refetch,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}
