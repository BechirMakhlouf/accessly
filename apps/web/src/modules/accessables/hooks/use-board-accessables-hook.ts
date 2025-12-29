"use client";

import {
  useBoardAccessables as useBoardAccessablesQuery,
  useCreateAccessable,
  useUpdateAccessable,
  useDeleteAccessable,
} from "../queries";
import type { Accessable, AccessableInsert, AccessableUpdate } from "../types";

interface UseBoardAccessablesOptions {
  boardId: string;
  organizationId: string;
}

export function useBoardAccessablesHook({
  boardId,
  organizationId,
}: UseBoardAccessablesOptions) {
  const {
    data: accessablesResult,
    isLoading,
    error,
    refetch,
  } = useBoardAccessablesQuery(boardId, {
    enabled: !!boardId,
  });

  const createMutation = useCreateAccessable();
  const updateMutation = useUpdateAccessable();
  const deleteMutation = useDeleteAccessable();

  const accessables = accessablesResult?.data ?? [];

  const createAccessable = async (
    input: Omit<AccessableInsert, "organization_id" | "board_id">,
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
    return accessables.find((a) => a.id === id);
  };

  return {
    accessables,
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
