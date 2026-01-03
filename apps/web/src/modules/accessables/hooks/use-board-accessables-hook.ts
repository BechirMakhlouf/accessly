'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBoardAccessablesQueryOptions,
  createAccessableMutationOptions,
  updateAccessableMutationOptions,
  deleteAccessableMutationOptions,
} from '../queries';
import type { Accessable, AccessableInsert, AccessableUpdate } from '../types';

interface UseBoardAccessablesOptions {
  boardId: string;
  organizationId: string;
}

export function useBoardAccessablesHook({
  boardId,
  organizationId,
}: UseBoardAccessablesOptions) {
  const queryClient = useQueryClient();

  const {
    data: accessables,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getBoardAccessablesQueryOptions(boardId),
    enabled: !!boardId,
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

  const accessablesList = accessables ?? [];

  const createAccessable = async (
    input: Omit<AccessableInsert, 'organization_id' | 'board_id'>
  ) => {
    return createMutation.mutateAsync({
      ...input,
      organization_id: organizationId,
      board_id: boardId,
    });
  };

  const updateAccessable = async (id: string, updates: AccessableUpdate) => {
    return updateMutation.mutateAsync({ id, updates });
  };

  const deleteAccessable = async (id: string) => {
    return deleteMutation.mutateAsync({
      id,
      organizationId,
      boardId,
    });
  };

  const getAccessableById = (id: string): Accessable | undefined => {
    return accessablesList.find((a: Accessable) => a.id === id);
  };

  return {
    accessables: accessablesList,
    boardId,
    organizationId,

    isLoading,
    error,

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
