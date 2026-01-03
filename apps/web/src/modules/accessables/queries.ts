'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  getAccessableById,
  getAccessablesByBoardId,
  getAccessablesByOrganizationId,
  createAccessable,
  updateAccessable,
  deleteAccessable,
} from './actions';
import type { Accessable, AccessableInsert, AccessableUpdate } from './types';

export const ACCESSABLES_KEY = 'accessables';
export const ACCESSABLE_KEY = 'accessable';
export const ORG_ACCESSABLES_KEY = (orgId: string) =>
  [ACCESSABLES_KEY, 'org', orgId] as const;
export const BOARD_ACCESSABLES_KEY = (boardId: string) =>
  [ACCESSABLES_KEY, 'board', boardId] as const;
export const ACCESSABLE_BY_ID_KEY = (id: string) =>
  [ACCESSABLE_KEY, 'id', id] as const;

export function getAccessableByIdQueryOptions(id: string) {
  return {
    queryKey: ACCESSABLE_BY_ID_KEY(id),
    queryFn: async (): Promise<Accessable> => {
      const result = await getAccessableById(id);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('Accessable not found');
      }
      return result.data;
    },
    enabled: !!id,
  };
}

export function getBoardAccessablesQueryOptions(boardId: string) {
  return {
    queryKey: BOARD_ACCESSABLES_KEY(boardId),
    queryFn: async (): Promise<Accessable[]> => {
      const result = await getAccessablesByBoardId(boardId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    enabled: !!boardId,
  };
}

export function getOrgAccessablesQueryOptions(orgId: string) {
  return {
    queryKey: ORG_ACCESSABLES_KEY(orgId),
    queryFn: async (): Promise<Accessable[]> => {
      const result = await getAccessablesByOrganizationId(orgId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data || [];
    },
    enabled: !!orgId,
  };
}

export function createAccessableMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: async (input: AccessableInsert): Promise<Accessable> => {
      const result = await createAccessable(input);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('Failed to create accessable');
      }
      return result.data;
    },
    onSuccess: (newAccessable: Accessable) => {
      queryClient.invalidateQueries({
        queryKey: ORG_ACCESSABLES_KEY(newAccessable.organization_id),
      });
      if (newAccessable.board_id) {
        queryClient.invalidateQueries({
          queryKey: BOARD_ACCESSABLES_KEY(newAccessable.board_id),
        });
      }
    },
  };
}

export function updateAccessableMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: AccessableUpdate;
    }): Promise<Accessable> => {
      const result = await updateAccessable(id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error('Failed to update accessable');
      }
      return result.data;
    },
    onSuccess: (updatedAccessable: Accessable) => {
      queryClient.invalidateQueries({
        queryKey: ACCESSABLE_BY_ID_KEY(updatedAccessable.id),
      });
      queryClient.invalidateQueries({
        queryKey: ORG_ACCESSABLES_KEY(updatedAccessable.organization_id),
      });
      if (updatedAccessable.board_id) {
        queryClient.invalidateQueries({
          queryKey: BOARD_ACCESSABLES_KEY(updatedAccessable.board_id),
        });
      }
    },
  };
}

export function deleteAccessableMutationOptions(
  queryClient: ReturnType<typeof useQueryClient>
) {
  return {
    mutationFn: async ({
      id,
      organizationId: _organizationId,
      boardId: _boardId,
    }: {
      id: string;
      organizationId: string;
      boardId: string | null;
    }): Promise<void> => {
      const result = await deleteAccessable(id);
      if (result.error) {
        throw new Error(result.error);
      }
    },
    onSuccess: (
      _: void,
      variables: { id: string; organizationId: string; boardId: string | null }
    ) => {
      queryClient.invalidateQueries({
        queryKey: ACCESSABLE_BY_ID_KEY(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: ORG_ACCESSABLES_KEY(variables.organizationId),
      });
      if (variables.boardId) {
        queryClient.invalidateQueries({
          queryKey: BOARD_ACCESSABLES_KEY(variables.boardId),
        });
      }
    },
  };
}
