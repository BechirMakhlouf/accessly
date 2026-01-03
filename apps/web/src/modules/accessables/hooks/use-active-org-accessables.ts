'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrg } from '@/modules/organizations';
import {
  getOrgAccessablesQueryOptions,
  createAccessableMutationOptions,
  updateAccessableMutationOptions,
  deleteAccessableMutationOptions,
} from '../queries';
import type { Accessable, AccessableInsert, AccessableUpdate } from '../types';

export function useActiveOrgAccessables() {
  const { organization, isLoading: orgLoading } = useActiveOrg();
  const queryClient = useQueryClient();

  const {
    data: allAccessables,
    isLoading: accessablesLoading,
    error: accessablesError,
    refetch,
  } = useQuery({
    ...getOrgAccessablesQueryOptions(organization?.id ?? ''),
    enabled: !!organization?.id,
  });

  const createMutation = useMutation(
    createAccessableMutationOptions(queryClient)
  );
  const updateMutation = useMutation(
    updateAccessableMutationOptions(queryClient)
  );
  const deleteMutation = useMutation(
    deleteAccessableMutationOptions(queryClient)
  );

  const accessablesList = allAccessables ?? [];
  const orgLevelAccessables = accessablesList.filter(
    (a: Accessable) => a.board_id === null
  );

  const createAccessable = async (
    input: Omit<AccessableInsert, 'organization_id'>
  ) => {
    if (!organization?.id) throw new Error('No active organization');

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
    boardId: string | null = null
  ) => {
    if (!organization?.id) throw new Error('No active organization');

    return deleteMutation.mutateAsync({
      id,
      organizationId: organization.id,
      boardId,
    });
  };

  const getAccessableById = (id: string): Accessable | undefined => {
    return accessablesList.find((a: Accessable) => a.id === id);
  };

  return {
    organization,
    allAccessables: accessablesList,
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
