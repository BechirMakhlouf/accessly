'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveOrg } from '@/modules/organizations/hooks/use-active-org';
import {
  getOrgBoardsQueryOptions,
  createBoardMutationOptions,
  updateBoardMutationOptions,
  deleteBoardMutationOptions,
} from '../queries';
import type { BoardInput, BoardUpdate } from '@accessly/core';

/**
 * Hook that provides access to boards for the current active organization.
 *
 * @returns Object containing:
 * - boards: Array of boards for the active organization
 * - isLoading: Loading state
 * - error: Error state
 * - createBoard: Function to create a new board
 * - updateBoard: Function to update a board
 * - deleteBoard: Function to delete a board
 * - refetch: Function to refetch boards data
 */
export function useActiveOrgBoards() {
  const { activeOrganization } = useActiveOrg();
  const queryClient = useQueryClient();

  // Get boards for the active organization
  const {
    data: boards = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getOrgBoardsQueryOptions(activeOrganization?.id || ''),
    enabled: !!activeOrganization?.id,
  });

  // Create board mutation
  const createBoardMutation = useMutation({
    ...createBoardMutationOptions(queryClient),
    onSuccess: () => {
      // Refetch boards after successful creation
      refetch();
    },
  });

  // Update board mutation
  const updateBoardMutation = useMutation({
    ...updateBoardMutationOptions(queryClient),
    onSuccess: () => {
      // Refetch boards after successful update
      refetch();
    },
  });

  // Delete board mutation
  const deleteBoardMutation = useMutation({
    ...deleteBoardMutationOptions(queryClient),
    onSuccess: () => {
      // Refetch boards after successful deletion
      refetch();
    },
  });

  // Actions
  const createBoard = async (input: BoardInput) => {
    if (!activeOrganization?.id) {
      throw new Error('No active organization');
    }

    // Ensure the board is created for the active organization
    const boardInput = {
      ...input,
      organization_id: activeOrganization.id,
    };

    return await createBoardMutation.mutateAsync(boardInput);
  };

  const updateBoard = async (boardId: string, updates: BoardUpdate) => {
    return await updateBoardMutation.mutateAsync({ boardId, updates });
  };

  const deleteBoard = async (boardId: string) => {
    return await deleteBoardMutation.mutateAsync(boardId);
  };

  return {
    // Data
    boards,
    isLoading,
    error,

    // Actions
    createBoard,
    updateBoard,
    deleteBoard,
    refetch,

    // Mutation states
    isCreating: createBoardMutation.isPending,
    isUpdating: updateBoardMutation.isPending,
    isDeleting: deleteBoardMutation.isPending,

    // Organization context
    activeOrganization,
  };
}
