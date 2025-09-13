"use client";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBoardMutationOptions,
  updateBoardMutationOptions,
  deleteBoardMutationOptions,
  updateBoardMemberRoleMutationOptions,
  hardDeleteBoardMutationOptions,
} from '../queries';
import { BoardInput, BoardUpdate, BoardRole } from '../types';

export function useBoardMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation(createBoardMutationOptions(queryClient));
  const updateMutation = useMutation(updateBoardMutationOptions(queryClient));
  const deleteMutation = useMutation(deleteBoardMutationOptions(queryClient));
  const hardDeleteMutation = useMutation(hardDeleteBoardMutationOptions(queryClient));
  const updateMemberRoleMutation = useMutation(updateBoardMemberRoleMutationOptions(queryClient));

  return {
    // actions
    createBoard: (input: BoardInput) => createMutation.mutateAsync(input),
    updateBoard: (boardId: string, updates: BoardUpdate) => updateMutation.mutateAsync({ boardId, updates }),
    deleteBoard: (boardId: string) => deleteMutation.mutateAsync(boardId),
    hardDeleteBoard: (boardId: string) => hardDeleteMutation.mutateAsync(boardId),
    updateMemberRole: (boardId: string, memberId: string, newRole: BoardRole) =>
      updateMemberRoleMutation.mutateAsync({ boardId, memberId, newRole }),

    // states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isHardDeleting: hardDeleteMutation.isPending,
    isUpdatingMemberRole: updateMemberRoleMutation.isPending,

    // errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    hardDeleteError: hardDeleteMutation.error,
    updateMemberRoleError: updateMemberRoleMutation.error,
  };
}
